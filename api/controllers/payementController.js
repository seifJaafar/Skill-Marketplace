
const stripe = require('../utils/stripeConfig')
const Job = require('../models/job')
const User = require('../models/User');
const Course = require('../models/course');
const Enrollment = require("../models/enrollement");
const Transaction = require("../models/transaction");
const requestRefund = async (req, res, next) => {
    const { jobId } = req.body;
    try {
        const job = await Job.findById(jobId)
            .populate('providerId')
            .populate('clientId');

        if (!job) {
            return res.status(404).send({ error: 'Job not found' });
        }

        const userId = req.user.sub;
        const providerId = String(job.providerId._id);
        const clientId = String(job.clientId._id);


        if (userId !== clientId) {
            return res.status(401).send({ error: 'Unauthorized: Only the client can request a refund' });
        }


        const paymentIntentId = job.escrowPaymentIntentId;
        if (!paymentIntentId) {
            return res.status(400).send({ error: 'No valid payment intent found' });
        }

        const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
        const transferGroup = `job_${job._id}_payment`;

        if (!job.escrowPaymentTransferred) {
            console.log('Payment Intent:', paymentIntent.status);
            if (paymentIntent.status === 'succeeded') {

                const refund = await stripe.refunds.create({
                    payment_intent: paymentIntentId,
                });


                job.status = 'refunded';
                job.clientRefunded = true;
                job.providerCompleted = false;
                await job.save();

                res.status(200).json({ message: 'Refund successfully issued to the client' });
            } else {
                res.status(400).json({ error: 'Payment has not been completed or is invalid for refund' });
            }
        } else {
            const transfer = await stripe.transfers.list({
                transfer_group: transferGroup,
            });
            console.log('Transfer:', transfer);
            if (transfer && transfer.data.length > 0) {
                const providerTransfer = transfer.data[0];

                if (providerTransfer.reversed === false && providerTransfer.amount_reversed === 0) {
                    res.status(400).json({ error: 'Money has already been transferred to the provider. Please contact the provider for a refund' });
                } else {
                    res.status(500).json({ error: 'Transfer to provider was not successful' });
                }
            } else {
                res.status(400).json({ error: 'No transfer found for this payment' });
            }
        }
    } catch (error) {
        console.error('Error requesting refund:', error);
        next(error);
    }
};
const SaveEnrollment = async (req, res, next) => {
    try {
        const { paymentIntentId, courseId } = req.body;

        const payementIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

        // Check if payementIntent exists and has a valid status
        if (!payementIntent || !payementIntent.status) {
            return res.status(400).json({ error: "Invalid payment intent" });
        }

        const userId = req.user.sub;
        const courseDoc = await Course.findById(courseId);
        if (!courseDoc) {
            return res.status(404).send({ error: 'Course not found' });
        }
        const enroll = await Enrollment.findOne({ user: userId, course: courseId });
        if (enroll) {
            return res.status(400).send({ error: 'You already enrolled in this course' });
        }
        if (payementIntent.status === "succeeded") {
            const enroll = new Enrollment({
                user: userId,
                course: courseId,
            });
            await enroll.save();
            const transaction = new Transaction({
                user: userId,
                type: "enrollment",
                course: courseId,
                amount: courseDoc.price,
                status: "pending",
                payementIntentId: payementIntent.id
            });
            await transaction.save();
            courseDoc.usersEnrolled = courseDoc.usersEnrolled + 1;
            await courseDoc.save();
            const user = await User.findById(userId)
            user.enrollments.push(enroll._id);
            await user.save();
            res.status(201).json({ message: 'Enrollment saved successfully' });
        }
        else {
            return res.status(400).send({ error: 'Payment not succeeded' });
        }
    } catch (error) {
        console.error('Error saving enrollment:', error);
        next(error);
    }
}
const CourseCreatePaymentIntent = async (req, res, next) => {
    const { courseId } = req.body;

    try {
        const userId = req.user.sub;
        const courseDoc = await Course.findById(courseId);
        if (!courseDoc) {
            return res.status(404).send({ error: 'Course not found' });
        }
        const enroll = await Enrollment.findOne({ user: userId, course: courseId });
        if (enroll) {
            return res.status(400).send({ error: 'You already enrolled in this course' });
        }
        const paymentIntent = await stripe.paymentIntents.create({
            amount: courseDoc.price * 100,
            currency: 'usd',
            metadata: { courseId: String(courseDoc._id) },
        });
        if (!paymentIntent) {
            return res.status(400).send({ error: 'Payment intent not created' });
        }
        res.status(201).json({
            clientSecret: paymentIntent.client_secret,
        });

    } catch (error) {
        console.error('Error creating payment intent:', error);
        next(error);
    }
}
const createPaymentIntent = async (req, res, next) => {
    const { jobId } = req.body;

    try {

        const job = await Job.findById(jobId).populate('skillPostId');

        if (!job) {
            return res.status(404).send({ error: 'Job not found' });
        }


        if (job.isPaid || job.skillPostId.offerType !== 'monetary') {
            return res.status(400).send({ error: 'Job is already paid or not a monetary offer' });
        }


        const paymentIntent = await stripe.paymentIntents.create({
            amount: job.skillPostId.price * 100,
            currency: 'usd',
            metadata: { jobId: String(job._id) },
        });


        res.status(201).json({
            clientSecret: paymentIntent.client_secret,
            jobId: job._id,
        });
    } catch (error) {
        console.error('Error creating payment intent:', error);
        next(error);
    }
};
function isSuspiciousCompletion(job) {

    const completionTime = new Date() - job.createdAt;
    return completionTime < 3600000;
}
const markJobAsDone = async (req, res, next) => {
    const { jobId } = req.body;
    try {
        const job = await Job.findById(jobId)
            .populate('providerId')
            .populate('clientId')
            .populate('skillPostId');

        const userId = req.user.sub;
        if (!job) {
            return res.status(404).send({ error: 'Job not found' });
        }

        const providerId = String(job.providerId._id);
        const clientId = String(job.clientId._id);
        const userString = String(userId);


        if (userString === providerId) {
            job.providerCompleted = true;
        } else if (userString === clientId) {
            job.clientCompleted = true;
        } else {
            return res.status(401).send({ error: 'Unauthorized' });
        }
        await job.save();


        if (job.providerCompleted && job.clientCompleted) {
            if (job.skillPostId.offerType === 'monetary') {
                if (isSuspiciousCompletion(job)) {
                    if (job.escrowPaymentIntentId) {

                        const paymentIntent = await stripe.paymentIntents.retrieve(job.escrowPaymentIntentId);

                        console.log('Payment Intent:', paymentIntent);
                        if (paymentIntent.status === 'succeeded') {

                            const amountReceived = paymentIntent.amount_received;
                            const transferGroup = `job_${job._id}_payment`;
                            const transfer = await stripe.transfers.create({
                                amount: amountReceived,
                                currency: 'usd',
                                destination: job.providerId.stripeAccountId,
                                description: `Payment for Job #${job._id}`,
                                transfer_group: transferGroup,
                            });


                            console.log('Transfer:', transfer);


                            const balanceTransaction = await stripe.balanceTransactions.retrieve(transfer.balance_transaction);
                            console.log('Balance Transaction:', balanceTransaction);
                            if (balanceTransaction.status === 'available') {
                                console.log('Payment processed successfully');
                                job.status = 'released';
                                job.escrowPaymentTransferred = true;
                                job.completedAt = new Date();
                                await job.save();


                                res.status(200).json({ message: 'Job marked as done and payment processed' });
                            } else {
                                console.error('Failed to process payment: Transfer status not succeeded');
                                job.providerCompleted = false;
                                job.clientCompleted = false;
                                await job.save();
                                res.status(500).json({ error: 'Failed to process payment transfer', details: balanceTransaction.status });
                            }
                        } else {
                            console.error('Payment has not been completed or is invalid');
                            job.providerCompleted = false;
                            job.clientCompleted = false;
                            await job.save();
                            res.status(400).json({ error: 'Payment has not been completed or is invalid' });
                        }
                    } else {
                        console.error('No valid escrow payment intent found');
                        job.providerCompleted = false;
                        job.clientCompleted = false;
                        await job.save();
                        res.status(400).json({ error: 'No valid escrow payment intent found' });
                    }
                }
            } else if (job.skillPostId.offerType === 'exchange') {
                if (!isSuspiciousCompletion(job)) {
                    const provider = await User.findById(job.providerId).select("points");
                    const client = await User.findById(job.clientId).select("points");

                    provider.points = provider.points + 10;
                    client.points = client.points + 10;
                    await provider.save();
                    await client.save();
                    job.status = 'released';
                    job.completedAt = new Date();
                    await job.save();
                    res.status(200).json({ message: 'Job marked as done and points added to provider and client' });
                } else {
                    console.error('Suspicious completion');
                    res.status(400).json({ error: 'Suspicious completion' });
                }
            }
            else {
                console.error('Both provider and client need to mark the job as completed');
                res.status(400).json({ error: 'Both provider and client need to mark the job as completed' });
            }
        }

    } catch (error) {
        const job = await Job.findById(jobId);
        job.providerCompleted = false;
        job.clientCompleted = false;
        await job.save();
        console.error('Error marking job as done:', error);
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
    markJobAsPaid,
    markJobAsDone,
    requestRefund,
    CourseCreatePaymentIntent,
    SaveEnrollment
};
