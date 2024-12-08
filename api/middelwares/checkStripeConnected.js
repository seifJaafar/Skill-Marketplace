const User = require('../models/User');
const ExpressError = require('../utils/ExpressError'); // Assuming you have an ExpressError class to handle errors

// Middleware to check if user has a stripe field
const checkStripe = async (req, res, next) => {
    try {
        const userId = req.user.sub; // Assuming the user ID is in req.user (from authenticated session)

        // Fetch the user from the database
        const user = await User.findById(userId);
        if (!user) {
            return next(new ExpressError('User not found', 404));
        }

        // Check if the user has a stripe field (e.g. stripeCustomerId)
        if (!user.stripeAccountId) {
            return next(new ExpressError('Please Link Stripe Account in settings first', 400));
        }
        next();
    } catch (error) {
        console.error(error);
        next(error); // Pass any other errors to the error handler
    }
};

module.exports = checkStripe;
