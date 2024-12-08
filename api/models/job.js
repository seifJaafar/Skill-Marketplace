const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
    skillPostId: { type: mongoose.Schema.Types.ObjectId, ref: 'SkillPost', required: true }, // Linked skill post
    providerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Skill provider
    clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Client linking to the skill post
    escrowPaymentIntentId: { type: String, default: null }, // Payment intent ID
    transactionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Transaction' }, // Linked Transaction ID
    isPaid: { type: Boolean, default: false }, // Payment status
    status: {
        type: String,
        enum: ['pending', 'released', 'refunded'],
        default: 'pending'
    },
    escrowPaymentTransferred: { type: Boolean, default: false }, // Escrow payment status
    providerCompleted: { type: Boolean, default: false }, // Provider's completion status
    clientCompleted: { type: Boolean, default: false }, // Client's completion status
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    completedAt: { type: Date }, // When the job is marked as completed
    cancelledAt: { type: Date },
    clientRefunded: { type: Boolean, default: false } // When the job is marked as cancelled
});

const Job = mongoose.model('Job', JobSchema);
module.exports = Job;
