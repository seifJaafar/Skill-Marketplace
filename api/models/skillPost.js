const mongoose = require('mongoose');
const SkillPostSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    offerType: { type: String, enum: ['exchange', 'monetary'], default: 'exchange' },
    price: { type: Number, required: true, default: 0 },
    exchangeSkill: {
        type: mongoose.Schema.Types.ObjectId, ref: 'Skill', required: function () {
            return this.offerType === 'exchange' || this.offerType === 'both';
        }
    },
    providerId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    providerName: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    isActive: { type: Boolean, default: true },
    skillCategory: { type: mongoose.Schema.Types.ObjectId, ref: 'Skill', required: true },
    skillLevel: { type: String, required: true, enum: ['beginner', 'intermediate', 'advanced'] },
    linkedUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    status: { type: String, required: true, enum: ['pending', 'in_progress', 'completed', 'cancelled'], default: 'pending' },
    completedAt: { type: Date },
    cancelledAt: { type: Date },
    suggestions: { type: Number, default: 0 },
});
const skillPost = mongoose.model('SkillPost', SkillPostSchema);
module.exports = skillPost;