// controllers/paymentController.js
const stripe = require('../utils/stripeConfig')
const Job = require('../models/job')
// Create Payment Intent for Jobs
const createPaymentIntent = async (req, res, next) => {
    const { jobId } = req.body; // Get job ID from request body

    try {
        // Find job from the database
        const job = await Job.findById(jobId).populate('skillPostId'); // Make sure to populate skillPostId

        if (!job) {
            return res.status(404).send({ error: 'Job not found' });
        }

        // Only allow payment if the job is unpaid and mandatory offer
        if (job.isPaid || job.skillPostId.offerType !== 'monetary') {
            return res.status(400).send({ error: 'Job is already paid or not a monetary offer' });
        }

        // Create a payment intent with the price from the job
        const paymentIntent = await stripe.paymentIntents.create({
            amount: job.skillPostId.price * 100, // Convert price to cents
            currency: 'usd', // Currency code
            metadata: { jobId: String(job._id) }, // Store job ID in metadata
        });

        // Return the client secret for frontend to complete payment
        res.status(201).json({
            clientSecret: paymentIntent.client_secret,
            jobId: job._id,
        });
    } catch (error) {
        console.error('Error creating payment intent:', error);
        next(error);
    }
};


const markJobAsPaid = async (req, res, next) => {
    const { jobId, paymentIntentId } = req.body;
    try {
        const job = await Job.findById(jobId);

        if (!job) {
            return res.status(404).send({ error: 'Job not found' });
        }


        job.isPaid = true;
        job.status = 'pending';
        job.escrowPaymentIntentId = paymentIntentId;
        await job.save();
        res.status(200).json({ message: 'Job marked as paid' });
    } catch (error) {
        console.error('Error marking job as paid:', error);
        next(error);
    }
};

module.exports = {
    createPaymentIntent,
    markJobAsPaid
};
