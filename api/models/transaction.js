const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
    jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true }, // Links to the Job
    clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Client initiating the payment
    providerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Skill provider receiving the payment
    amount: { type: Number, required: true }, // Payment amount in cents (Stripe uses the smallest currency unit)
    currency: { type: String, default: 'usd' }, // Currency code
    paymentIntentId: { type: String, required: true }, // Stripe PaymentIntent ID
    escrowAccountId: { type: String, required: true }, // Stripe Connected Account ID for the provider
    status: { 
        type: String, 
        enum: ['pending', 'requires_payment', 'requires_capture', 'succeeded', 'cancelled', 'failed'], 
        default: 'pending' 
    }, // Payment status
    paymentMethodId: { type: String }, // Stripe PaymentMethod ID
    captured: { type: Boolean, default: false }, // Indicates if the payment has been captured
    disputeStatus: { 
        type: String, 
        enum: ['none', 'under_review', 'won', 'lost', 'refunded'], 
        default: 'none' 
    }, // Dispute status
    disputeId: { type: String }, // Stripe Dispute ID
    disputeReason: { type: String }, // Reason for the dispute (Stripe dispute reason codes)
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

const Transaction = mongoose.model('Transaction', TransactionSchema);
module.exports = Transaction;
