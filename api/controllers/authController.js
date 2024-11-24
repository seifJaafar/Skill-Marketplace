const User = require('../models/User');
const { sendEmail, CreateAccount, ResetPassword, WaitApproval } = require('../utils/msgUtils');
const mongoose = require('mongoose');
const ExpressError = require('../utils/ExpressError');
const apiJson = require('../utils/apiJson');
const crypto = require("crypto")
exports.Register = async (req, res, next) => {
    try {
        const existingUser = await User.findOne({ email: req.body.email });

        if (existingUser) {
            if (existingUser.role === 'skillprovider') {
                if (!existingUser.quizCompleted) {
                    apiJson({ req, res, data: { user: existingUser }, model: User });
                }
            }
        }
        const skills = req.body.skills.map(skillId => new mongoose.Types.ObjectId(skillId));
        const user = new User({ ...req.body, skills: skills });
        if (req.body.role === "skillexpert") {
            await sendEmail(WaitApproval({ Name: UserName, Email: UserEmail }))?.then((val) => { }).catch((err) => console.error("SMTP ERROR", err));
        }
        await user.save();
        apiJson({ req, res, data: { user }, model: User });
    } catch (error) {
        next(error)
    }
}

// quiz.controller.js
exports.handleQuizResult = async (req, res) => {
    let { userId, skillID, currentSkillIndex, skills, quizScore } = req.body;
    try {
        // Find the user by ID

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // If the user scored less than 3, remove the skill from the user's skills array
        if (quizScore < 3) {
            user.skills = user.skills.filter(skill => skill.toString() !== skillID);
            await user.save();

        }

        if (currentSkillIndex === skills.length - 1) {
            user.quizCompleted = true;
            if (user.skills.length === 0) {
                await User.deleteOne({ _id: userId });
                return res.status(200).json({ message: 'User deleted due to insufficient score' });
            } else {
                // Approve the user if skills remain
                user.approved = true;
                await user.save();
                return res.status(200).json({ message: 'User approved for next step' });
            }
        }

        // If not the last quiz, continue to the next quiz
        return res.status(200).json({ message: 'Next quiz' });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};


exports.LogIn = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email }).exec();

        if (!user) {
            const msg = "incorrect email or password"
            throw new ExpressError(msg, 400)
        }
        if (user.approved === false) {
            const msg = "your account is not approved yet"
            throw new ExpressError(msg, 400)
        }
        const isPasswordValid = await user.validatePassword(password);
        if (!isPasswordValid) {

            const msg = "incorrect email or password"
            throw new ExpressError(msg, 400)
        }
        const accessToken = await user.token();
        const data = { user, accessToken };
        return apiJson({ req, res, data, model: User });
    } catch (error) {
        next(error)
    }
}
exports.ResetPassword = async (req, res, next) => {
    try {
        const email = req.body.email;
        const user = await User.findOne({ email }).exec();
        if (!user) {
            const msg = "Email incorrect";
            throw new ExpressError(msg, 400);
        }
        if (!user.approved) {
            const msg = "Compte pas encore approuvé par l'admin";
            throw new ExpressError(msg, 400);
        }
        const tempPass = crypto.randomBytes(16).toString('hex');
        user.password = tempPass;
        const name = user.username;
        const Email = user.email;
        await user.save();

        await sendEmail(ResetPassword({ NewPassword: tempPass, Name: name, Email }))
            .then((val) => { })
            .catch((err) => { });

        const data = { message: "Success password reset" };
        return apiJson({ req, res, data, model: User });
    } catch (err) {
        next(err);
    }
}
exports.ByToken = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.sub);
        const data = {
            user: user
        }
        res.status(200).json(data)
    } catch (err) {
        next(err)
    }
}
exports.GetAllusers = async (req, res, next) => {
    try {
        const { role, approved } = req.query;
        const query = {};
        if (role) {
            query.role = role;
        }
        if (approved !== undefined) {
            if (approved === "true") {
                query.approved = true;
            } else {
                query.approved = false;
            }

        }
        const users = await User.find(query).populate('skills', 'name');;
        const data = { users };
        return apiJson({ req, res, data, model: User });
    } catch (err) {
        next(err);
    }
}
exports.UpdateUser = async (req, res, next) => {
    try {
        const id = req.params.id;
        let { email, username, approved, role, phone, githubProfile, linkedinProfile, points, skills, quizCompleted } = req.body;
        skills = skills.map(skillId => new mongoose.Types.ObjectId(skillId));
        const updateFields = { email, username, approved, role, phone, githubProfile, linkedinProfile, points, skills, quizCompleted };
        const userbeforeUpdate = await User.findById(id).select('username email role approved ').lean();
        if (!userbeforeUpdate) {
            const msg = "User not found";
            throw new ExpressError(msg, 400);
        }
        const UpdatedUser = await User.findByIdAndUpdate(id, updateFields, { new: true }).select('username email role approved').lean();
        if (!UpdatedUser) {
            const msg = "User not found";
            throw new ExpressError(msg, 400);
        }
        const data = { message: "User Updated succefuly" };
        return apiJson({ req, res, data, model: User });
    } catch (err) {
        next(err);
    }
}
exports.DeleteUser = async (req, res, next) => {
    try {
        const id = req.params.id;
        const user = await User.findByIdAndDelete(id);
        if (!user) {
            const msg = "User not found";
            throw new ExpressError(msg, 400);
        }
        const data = { message: "User Deleted succefuly" };
        return apiJson({ req, res, data, model: User });
    } catch (err) {
        next(err);
    }
}
exports.addUser = async (req, res, next) => {
    try {
        const { role, username, email } = req.body;
        const existingUser = await User.findOne({ email: req.body.email });
        if (existingUser) {
            const msg = "User already exist";
            throw new ExpressError(msg, 400);
            return;
        }
        const tempPass = crypto.randomBytes(16).toString('hex');
        const user = await new User({ ...req.body, password: tempPass });
        await user.save();
        await sendEmail(CreateAccount({ Name: username, Email: email, password: tempPass }))?.then((val) => { }).catch((err) => console.error("SMTP ERROR", err));
        const data = { user };
        return apiJson({ req, res, data, model: User });
    } catch (error) {
        next(error)
    }
}