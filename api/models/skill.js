const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const SkillSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    description: {
        type: String
    },
    linkedQuiz: {
        type: Schema.Types.ObjectId,
        ref: 'Quiz',
        default: null,
        unique: true
    }
});

const Skill = mongoose.model("Skill", SkillSchema);
module.exports = Skill;
