const Joi = require('joi');

const questionValidationSchema = Joi.object({
    questionText: Joi.string()
        .trim()
        .required()
        .messages({
            'string.base': 'Question text must be a string.',
            'string.empty': 'Question text cannot be empty.',
            'any.required': 'Question text is required.'
        }),
    options: Joi.array()
        .items(Joi.string().trim().required().messages({
            'string.base': 'Each option must be a string.',
            'string.empty': 'Options cannot contain empty strings.',
            'any.required': 'Each option is required.'
        }))
        .min(2) // Ensure at least two options are provided.
        .required()
        .messages({
            'array.base': 'Options must be an array of strings.',
            'array.min': 'At least two options are required.',
            'any.required': 'Options are required.'
        }),
    correctAnswerIndex: Joi.number()
        .integer()
        .min(0)
        .required()
        .messages({
            'number.base': 'Correct answer index must be a number.',
            'number.integer': 'Correct answer index must be an integer.',
            'number.min': 'Correct answer index cannot be negative.',
            'any.required': 'Correct answer index is required.'
        }),
});

module.exports = questionValidationSchema;
