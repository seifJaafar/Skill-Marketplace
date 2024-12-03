// config/stripeConfig.js

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY); // Make sure you have the secret key from your environment variables

module.exports = stripe;
