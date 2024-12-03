const Joi = require('joi');

const reviewValidationSchema = Joi.object({
    reviewee: Joi.string().required().regex(/^[0-9a-fA-F]{24}$/).message('Invalid ObjectId for reviewee'),
    rating: Joi.number().required().min(1).max(5).message('Rating must be between 1 and 5'),
    comment: Joi.string().required().max(500).message('Comment is required and should not exceed 500 characters'),
});

module.exports = reviewValidationSchema;
