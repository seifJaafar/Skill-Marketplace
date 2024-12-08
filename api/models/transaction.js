const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, enum: ['enrollment', 'payment'], required: true },
    course: {
        type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: () => {
            return this.type === 'enrollment';
        }
    },
    job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: () => { return this.type === 'payment'; } },
    amount: { type: Number, required: true },
    status: { type: String, enum: ['pending', 'eligible', 'transferred', 'refunded'], default: 'pending' },
    createdAt: { type: Date, default: Date.now },
    payementIntentId: { type: String, required: true },
});

const Transaction = mongoose.model('Transaction', TransactionSchema);
module.exports = Transaction;
