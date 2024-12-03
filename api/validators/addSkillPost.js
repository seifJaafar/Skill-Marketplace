const Joi = require('joi');

const addSkillPostValidation = Joi.object({
    title: Joi.string().required().messages({
        'string.base': 'Title must be a string',
        'any.required': 'Title is required',
    }),

    description: Joi.string().required().messages({
        'string.base': 'Description must be a string',
        'any.required': 'Description is required',
    }),

    offerType: Joi.string().valid('exchange', 'monetary', 'both').default('both').messages({
        'string.base': 'Offer type must be a string',
        'any.only': 'Offer type must be one of "exchange", "monetary", or "both"',
    }),

    price: Joi.number().optional().min(0).default(0).messages({
        'number.base': 'Price must be a number',
        'number.min': 'Price cannot be less than 0',
        'any.required': 'Price is required',
    }),

    exchangeSkill: Joi.string().regex(/^[0-9a-fA-F]{24}$/).optional().when('offerType', {
        is: Joi.valid('exchange', 'both'),
        then: Joi.required(),
        otherwise: Joi.forbidden(),
    }).messages({
        'objectId.base': 'Invalid ObjectId format for exchangeSkill',
        'any.required': 'Exchange Skill is required for exchange or both offer types',
        'any.forbidden': 'Exchange Skill should not be present for non-exchange offer types',
    }),

    providerName: Joi.string().required().messages({
        'string.base': 'Provider Name must be a string',
        'any.required': 'Provider Name is required',
    }),

    skillCategory: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required().messages({
        'objectId.base': 'Invalid ObjectId format for skillCategory',
        'any.required': 'Skill Category is required',
    }),

    skillLevel: Joi.string().valid('beginner', 'intermediate', 'advanced').required().messages({
        'string.base': 'Skill Level must be a string',
        'any.required': 'Skill Level is required',
        'any.only': 'Skill Level must be one of "beginner", "intermediate", or "advanced"',
    }),

    linkedUserId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).optional().messages({
        'objectId.base': 'Invalid ObjectId format for linkedUserId',
    }),

    status: Joi.string().valid('pending', 'in_progress', 'completed', 'cancelled').optional().default('pending').messages({
        'string.base': 'Status must be a string',
        'any.only': 'Status must be one of "pending", "in_progress", "completed", or "cancelled"',
    }),

    completedAt: Joi.date().optional().messages({
        'date.base': 'Completed At must be a valid date',
    }),

    cancelledAt: Joi.date().optional().messages({
        'date.base': 'Cancelled At must be a valid date',
    }),

    suggestions: Joi.number().default(0).messages({
        'number.base': 'Suggestions must be a number',
    }),

    createdAt: Joi.date().default(Date.now).optional().messages({
        'date.base': 'Created At must be a valid date',
    }),

    updatedAt: Joi.date().default(Date.now).optional().messages({
        'date.base': 'Updated At must be a valid date',
    }),

    isActive: Joi.boolean().default(true).optional().messages({
        'boolean.base': 'isActive must be a boolean value',
    }),
});

module.exports = addSkillPostValidation;
