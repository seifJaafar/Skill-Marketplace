const mongoose = require('mongoose');
const ExpressError = require('../utils/ExpressError');
const apiJson = require('../utils/apiJson');
const User = require('../models/User');
const stripe = require('../utils/stripeConfig')
exports.StripeWebhookAccount = async (req, res, next) => {
    try {
        console.log("Stripe Webhook received");
        const sig = req.headers['stripe-signature']; // Get the signature from headers
        const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET; // Set this to the webhook secret key in Stripe Dashboard
        let event;

        try {
            event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
        } catch (err) {
            console.log('Error verifying webhook:', err);
            return res.status(400).send(`Webhook Error: ${err.message}`);
        }

        console.log('Webhook received:', event.type);
        switch (event.type) {
            case 'capability.updated':
                break;
            case 'account.updated':
                const account = event.data.object;
                if (account.payouts_enabled) { // Check if the account is fully activated (payouts_enabled)
                    // Find the user by the Stripe Account ID
                    const user = await User.findOne({ tempStripeAccountId: account.id });
                    // If the user exists, store the Stripe Account ID in the user document
                    if (user) {
                        // Store the actual Stripe account ID in the stripeAccountId field
                        user.stripeAccountId = account.id;
                        // Remove the tempStripeAccountId after storing the real one
                        user.tempStripeAccountId = undefined;
                        await user.save();
                        console.log('Stripe Account ID saved for user:', user.email);
                    } else {
                        console.log('User not found for Stripe account:', account.id);
                    }
                }
            default:
                console.log(`Unhandled event type: ${event.type}`);
        }
        // Return a 200 response to acknowledge receipt of the webhook
        res.status(200).send({ received: true });
    } catch (err) {
        next(err);
    }
}