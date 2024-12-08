const User = require('../models/User');
const SkillPost = require('../models/skillPost');
const Job = require('../models/job');
const mongoose = require('mongoose');
const apiJson = require('../utils/apiJson');


exports.addSkillPost = async (req, res) => {
    try {
        let { title, description, skillCategory, skillLevel, exchangeSkill, providerName } = req.body;

        const providerId = req.user.sub;
        const user = await User.findById(providerId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        if (!user.stripeAccountId) {
            return res.status(400).json({ message: 'Please connect your stripe account first' });
        }
        skillCategory = new mongoose.Types.ObjectId(skillCategory);
        exchangeSkill = new mongoose.Types.ObjectId(exchangeSkill);
        const newSkillPost = new SkillPost({
            title,
            description,
            skillCategory,
            skillLevel,
            exchangeSkill,
            providerName,
            providerId
        });
        await newSkillPost.save();
        res.status(200).json({
            message: 'Skill Post added successfully',
            skillPost: newSkillPost,
        });
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: 'Server error' });
    }
};
exports.updateSkillPost = async (req, res) => {
    try {
        const skillPostId = req.params.id;
        if (!mongoose.Types.ObjectId.isValid(skillPostId)) {
            return res.status(400).json({ message: 'Invalid Skill Post ID' });
        }
        const skillPost = await SkillPost.findById(skillPostId).populate('providerId');
        if (!skillPost) {
            return res.status(404).json({ message: 'Skill Post not found' });
        }
        const userId = req.user.sub;
        if (skillPost.providerId._id.toString() !== userId.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'You are not authorized to update this skill post' });
        }
        const { title, description, skillCategory, skillLevel, exchangeSkill, providerName, price, offerType } = req.body;
        const updatedSkillPost = {
            title,
            description,
            skillCategory: new mongoose.Types.ObjectId(skillCategory),
            skillLevel,
            exchangeSkill: new mongoose.Types.ObjectId(exchangeSkill),
            providerName,
            price,
            offerType,
            updatedAt: Date.now(),
        };
        await SkillPost.findByIdAndUpdate(skillPostId, updatedSkillPost);
        res.status(200).json({ message: 'Skill Post updated successfully' });
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: 'An error occurred while updating the skill post' });
    }
};
exports.linkUserToSkillPost = async (req, res) => {
    try {
        const skillPostId = req.params.id;
        if (!mongoose.Types.ObjectId.isValid(skillPostId)) {
            return res.status(400).json({ message: 'Invalid Skill Post ID' });
        }
        const { linkedUserId } = req.body;

        if (!mongoose.Types.ObjectId.isValid(linkedUserId)) {
            return res.status(400).json({ message: 'Invalid Linked User ID' });
        }
        const client = await User.findById(linkedUserId);
        const skillPost = await SkillPost.findById(skillPostId);
        if (!skillPost) {
            return res.status(404).json({ message: 'Skill Post not found' });
        }

        // Ensure the SkillPost is not already linked
        if (skillPost.linkedUserId) {
            return res.status(400).json({ message: 'Skill Post is already linked to a user' });
        }

        // Additional validation based on offerType
        if (skillPost.offerType === 'monetary' && skillPost.price <= 0) {
            return res.status(400).json({ message: 'Price cannot be zero or negative for monetary offers' });
        }

        if (skillPost.offerType === 'exchange' && !skillPost.exchangeSkill) {
            return res.status(400).json({ message: 'Exchange skill cannot be null for exchange offers' });
        }
        if (skillPost.offerType === 'exchange' && client.role !== 'skillprovider') {
            return res.status(400).json({ message: 'Client must be a skill provider for exchange offers' });
        }
        if (skillPost.offerType === 'exchange' && !client.skills.includes(skillPost.exchangeSkill)) {
            return res.status(400).json({ message: 'Client does not have the required skill for exchange' });
        }


        // Create the job first
        const job = new Job({
            skillPostId,
            providerId: skillPost.providerId,
            clientId: linkedUserId,
            escrowPaymentIntentId: null,
            isPaid: skillPost.offerType === 'exchange' ? true : false,
        });

        // If job creation fails, return an error
        try {
            await job.save();
        } catch (err) {
            return res.status(500).json({ message: 'Error creating job', error: err });
        }

        // If job creation is successful, save the linked user to the skill post
        skillPost.linkedUserId = linkedUserId;
        skillPost.status = 'in_progress';

        await skillPost.save();

        res.status(200).json({ message: 'Skill Post linked successfully and Job created', job });
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: 'An error occurred while linking the user to the skill post' });
    }
};


exports.deleteSkillPost = async (req, res) => {
    try {
        const skillPostId = req.params.id;
        if (!mongoose.Types.ObjectId.isValid(skillPostId)) {
            return res.status(400).json({ message: 'Invalid Skill Post ID' });
        }
        const skillPost = await SkillPost.findById(skillPostId).populate('providerId');
        if (!skillPost) {
            return res.status(404).json({ message: 'Skill Post not found' });
        }
        const userId = req.user.sub;
        if (skillPost.providerId._id.toString() !== userId.toString() && skillPost.providerId.role !== 'admin') {
            return res.status(403).json({ message: 'You are not authorized to delete this skill post' });
        }
        await SkillPost.findByIdAndDelete(skillPostId);
        res.status(200).json({ message: 'Skill Post deleted successfully' });
    } catch (e) {
        console.error(e);
        next(e);
    }
};

exports.getSkillPosts = async (req, res) => {
    try {
        const skillPosts = await SkillPost.find({ status: "pending" })
            .populate('skillCategory')
            .populate('exchangeSkill')
            .sort({ suggestions: -1 });

        res.status(200).json({
            data: skillPosts,
        });
    } catch (e) {
        console.error(e);
        next(e);
    }
};
exports.getSkillPostById = async (req, res) => {
    try {
        const skillPostId = req.params.id;
        if (!mongoose.Types.ObjectId.isValid(skillPostId)) {
            return res.status(400).json({ message: 'Invalid Skill Post ID' });
        }
        const skillPost = await SkillPost.findById(skillPostId)
            .populate('skillCategory')
            .populate('exchangeSkill');
        if (!skillPost) {
            return res.status(404).json({ message: 'Skill Post not found' });
        }
        res.status(200).json({
            data: skillPost,
        });
    } catch (e) {
        console.error(e);
        next(e);
    }
}
exports.getSkillPostsByUser = async (req, res) => {
    try {
        const providerId = req.user.sub;
        if (!providerId) {
            return res.status(400).json({ message: 'Provider ID is required' });
        } else {
            const skillPosts = await SkillPost.find({ providerId })
                .populate('skillCategory')
                .populate('exchangeSkill').populate({
                    path: 'linkedUserId',
                    select: 'username email'
                })
                .sort({ createdAt: -1 });
            res.status(200).json({
                data: skillPosts,
            });
        }

    } catch (e) {
        console.error(e);
        res.status(500).json({ message: 'Server error' });
    }
}

