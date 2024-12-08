const User = require('../models/User');
const { sendEmail, CreateAccount, ResetPassword, WaitApproval } = require('../utils/msgUtils');
const mongoose = require('mongoose');
const ExpressError = require('../utils/ExpressError');
const apiJson = require('../utils/apiJson');
const crypto = require("crypto")
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.Register = async (req, res, next) => {
    try {
        const existingUser = await User.findOne({ email: req.body.email });

        if (existingUser) {
            if (existingUser.role === 'skillprovider') {
                if (!existingUser.quizCompleted) {
                    apiJson({ req, res, data: { user: existingUser }, model: User });
                }
            }
            const msg = "User already exist";
            throw new ExpressError(msg, 400);
        }
        if (req.body.role === "skillprovider") {
            const skills = req.body.skills.map(skillId => new mongoose.Types.ObjectId(skillId));
            const user = new User({ ...req.body, skills: skills });
            await user.save();
            apiJson({ req, res, data: { user }, model: User });
        } else if (req.body.role === "skillexpert") {
            const skills = req.body.skills.map(skillId => new mongoose.Types.ObjectId(skillId));
            await sendEmail(WaitApproval({ Name: req.body.username, Email: req.body.email }))?.then((val) => { }).catch((err) => console.error("SMTP ERROR", err));
            const user = new User({ ...req.body, skills: skills });
            await user.save();
            apiJson({ req, res, data: { user }, model: User });
        } else if (req.body.role === "client") {
            const user = new User({ ...req.body, approved: true });
            await user.save();
            apiJson({ req, res, data: { user }, model: User });
        }

    } catch (error) {
        next(error)
    }
}

exports.GetUserById = async (req, res, next) => {
    try {
        let id = req.params.id;
        const user = await User.findById(id).populate('skills', 'name').select("email username bio role phone githubProfile linkedinProfile skills avatar resume websiteLink");
        if (!user) {
            const msg = "User not found";
            throw new ExpressError(msg, 400);
        }
        const data = { user };
        return apiJson({ req, res, data, model: User });
    } catch (err) {
        next(err)
    }
}
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
        const user = await User.findById(req.user.sub).populate('skills');
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
exports.UpdatePassword = async (req, res, next) => {
    try {
        console.log("UpdatePassword function started");

        const userId = req.user?.sub;
        console.log("Extracted User ID:", userId);

        if (!userId) {
            console.log("User ID missing");
            return res.status(400).send({ error: 'User ID is missing' });
        }

        const user = await User.findById(userId);
        console.log("Fetched user from DB:", user);

        if (!user) {
            console.log("User not found");
            return res.status(404).send({ error: 'User not found' });
        }

        const { OldPassword, NewPassword } = req.body;
        console.log("Received Passwords - Old:", OldPassword, "New:", NewPassword);

        const isPasswordValid = await user.validatePassword(OldPassword);
        console.log("Password validation result:", isPasswordValid);

        if (!isPasswordValid) {
            console.log("Old password incorrect");
            return res.status(400).send({ error: 'Incorrect password' });
        }

        user.password = NewPassword;
        await user.save();

        console.log("Password updated and user saved");

        const data = { message: "Password Updated successfully" };
        return res.status(200).json(data);
    } catch (err) {
        console.error("Unhandled Error in UpdatePassword:", err);
        return res.status(500).send({ error: "Internal Server Error" });
    }
};

exports.updateAccount = async (req, res, next) => {
    try {
        const userId = req.user.sub;
        console.log("req.bodyyyy", req.body);
        const user = await User.findById(userId)
        if (!user) {
            return res.status(404).send({ error: 'User not found' });
        }
        let { email, username, phone, githubProfile, linkedinProfile, skills, quizCompleted, avatar, resume, websiteLink } = req.body;
        let skillsTransformed = [];
        if (skills) {
            skillsTransformed = JSON.parse(skills).map((skillId) =>
                new mongoose.Types.ObjectId(skillId)
            );
        }
        const basePath = "uploads"; // Root folder for uploads
        const normalizePath = (fullPath) => {
            const relativePath = fullPath.split(`${basePath}\\`)[1]; // Extract path after `uploads\`
            return `\\${basePath}\\${relativePath}`; // Prefix with relative base folder
        };

        const avatarUploaded =
            req.files?.avatar && req.files.avatar[0]
                ? normalizePath(req.files.avatar[0].path)
                : user.avatar;
        const resumeUploaded =
            req.files?.resume && req.files.resume[0]
                ? normalizePath(req.files.resume[0].path)
                : user.resume;
        const updateFields = { email, username, phone, githubProfile, linkedinProfile, skills: skillsTransformed, quizCompleted, resume: resumeUploaded, avatar: avatarUploaded, websiteLink };
        const UpdatedUser = await User.findByIdAndUpdate(userId, updateFields, { new: true }).select('username email role approved').lean();
        if (!UpdatedUser) {
            const msg = "User not found";
            throw new ExpressError(msg, 400);
        }
        const data = { message: "User Updated succefuly" };
        return apiJson({ req, res, data, model: User });

    } catch (err) {
        next(err)
    }
}
exports.getUsersPublicInfos = async (req, res, next) => {
    try {
        const { query } = req.query;
        if (query.LeaderBoard) {
            if (query.IncludeUser) {
                const users = await User.find({ approved: true, role: 'skillprovider' }).populate('skills', 'name');
                const data = { users };
                return apiJson({ req, res, data, model: User });
            } else {
                const users = await User.find({ approved: true, role: 'skillprovider', _id: { $ne: req.user.sub } }).select('username email role phone githubProfile linkedinProfile  skills').populate('skills', 'name');
                const data = { users };
                return apiJson({ req, res, data, model: User });
            }
        }
        const users = await User.find({
            approved: true,
            role: { $ne: "admin" },
            _id: { $ne: req.user.sub }
        }).select('username email role phone githubProfile linkedinProfile  skills').populate('skills', 'name');
        const data = { users };
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
exports.connectStripeAccount = async (req, res, next) => {
    try {
        const userId = req.user.sub;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).send({ error: 'User not found' });
        }
        if (user.stripeAccountId) {
            return res.status(400).send({ error: 'Stripe account already connected' });
        }

        const account = await stripe.accounts.create({
            type: 'standard',
            email: user.email, // Provider's email
            capabilities: {
                card_payments: { requested: true },
                transfers: { requested: true }, // Enable funds transfers
            },
        });

        console.log('Test Provider Account ID:', account.id);
        user.tempStripeAccountId = account.id;
        await user.save();


        const accountLink = await stripe.accountLinks.create({
            account: account.id, // Connected account ID
            refresh_url: `${process.env.FRONTEND_URL}`,
            return_url: `${process.env.FRONTEND_URL}`,
            type: 'account_onboarding',
        });

        console.log('Onboarding Link:', accountLink.url);
        res.status(200).json({ url: accountLink.url });
    } catch (error) {
        console.error('Error connecting Stripe account:', error);
        next(error);
    }
}