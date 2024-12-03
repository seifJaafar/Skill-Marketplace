const Joi = require('joi');

const quizValidationSchema = Joi.object({
    title: Joi.string()
        .trim()
        .required()
        .messages({
            'string.base': 'Title must be a string.',
            'string.empty': 'Title cannot be empty.',
            'any.required': 'Title is required.'
        }),
    skill: Joi.string()
        .pattern(/^[0-9a-fA-F]{24}$/) // Ensures it's a valid ObjectId.
        .required()
        .messages({
            'string.pattern.base': 'Skill ID must be a valid ObjectId.',
            'any.required': 'Skill ID is required.'
        }),
    questions: Joi.array()
        .items(Joi.string().pattern(/^[0-9a-fA-F]{24}$/).messages({
            'string.pattern.base': 'Each question ID must be a valid ObjectId.'
        }))
        .unique() // Ensure no duplicate question IDs.
        .messages({
            'array.base': 'Questions must be an array of valid ObjectIds.',
            'array.unique': 'Duplicate question IDs are not allowed.'
        })
});

module.exports = quizValidationSchema;
