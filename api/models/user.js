const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const moment = require('moment');
const jwt = require('jsonwebtoken');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    password: {
        type: String,
        minlength: 4,
        maxlength: 128,
        required: true
    },
    email: {
        type: String,
        match: /^\S+@\S+\.\S+$/,
        unique: true,
        trim: true,
        lowercase: true,
        required: true,
        index: { unique: true }
    },
    avatar: {
        type: String,  // Stores the URL or file path of the avatar image
        default: 'uploads/avatars/default-avatar.png',
    },
    resume: {
        type: String,  // Stores the file path or URL for the resume
        default: null,
    },
    websiteLink: {
        type: String,  // Stores the user's website link
        default: null,
    },
    bio: {
        type: String,  // Stores the user's bio
        default: null,
    },
    phone: {
        type: String,
        index: true,
        trim: true,
        validate: {
            validator: function (v) {
                return /^[0-9]+$/.test(v);
            },
            message: props => `${props.value} is not a valid phone number! Only numeric characters are allowed.`
        }
    },
    role: {
        type: String,
        required: true,
        enum: ['skillprovider', 'skillexpert', 'admin', 'client']
    }
    ,
    approved: {
        type: Boolean,
        default: false
    },
    username: {
        type: String, required: true, unique: true
    },
    points: { type: Number, default: 0, min: 0 },
    createdAt: { type: Date, default: Date.now },
    skills: [{
        type: Schema.Types.ObjectId,
        ref: 'Skill'
    }],
    quizCompleted: {
        require: function () {
            return this.role === 'skillprovider';
        },
        type: Boolean,
        default: function () {
            return this.role === 'skillprovider' ? false : true;
        }
    },
    githubProfile: {
        type: String,
        require: function () {
            return this.role === 'skillexpert';
        },
        message: "GitHub profile link is required for skill experts"
    },
    linkedinProfile: {
        type: String,
        require: function () {
            return this.role === 'skillexpert';
        },
        message: "Linekdin profile link is required for skill experts"
    },
    stripeAccountId: {
        type: String,
        default: null
    },
    tempStripeAccountId: {
        type: String,
        default: null
    },
    enrollments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Enrollment' }]
}

)
UserSchema.pre('save', async function save(next) {
    try {
        const rounds = 10;
        if (this.isModified('password')) {
            const hash = await bcrypt.hash(this.password, rounds);
            this.password = hash;
        }
        return next();
    } catch (error) {
        return next(error);
    }
});
UserSchema.methods.validatePassword = async function (password) {
    return bcrypt.compare(password, this.password);
}
UserSchema.methods.token = async function () {
    const payload = {
        exp: moment().add(process.env.JWT_EXPIRATION, 'minutes').unix(),
        iat: moment().unix(),
        sub: this._id
    };
    return jwt.sign(payload, process.env.JWT_SECRET);
}
const User = mongoose.model("User", UserSchema);
module.exports = User;