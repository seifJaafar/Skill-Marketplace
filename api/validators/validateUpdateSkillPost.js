const Joi = require('joi');

const UpdateSkillPostValidation = Joi.object({
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

    price: Joi.number()
        .min(0)
        .optional()
        .when('offerType', {
            is: 'monetary',
            then: Joi.number().greater(0).required().messages({
                'number.greater': 'Price must be greater than 0 when offer type is "monetary"',
                'any.required': 'Price is required when offer type is "monetary"',
            }),
            otherwise: Joi.number().default(0),
        })
        .messages({
            'number.base': 'Price must be a number',
            'number.min': 'Price cannot be less than 0',
        }),

    exchangeSkill: Joi.string()
        .regex(/^[0-9a-fA-F]{24}$/)
        .optional()
        .when('offerType', {
            is: Joi.valid('exchange', 'both'),
            then: Joi.required(),
            otherwise: Joi.optional(),
        })
        .messages({
            'objectId.base': 'Invalid ObjectId format for exchangeSkill',
            'any.required': 'Exchange Skill is required for exchange or both offer types',
            'any.forbidden': 'Exchange Skill should not be present for non-exchange offer types',
        }),
    skillCategory: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required().messages({
        'objectId.base': 'Invalid ObjectId format for skillCategory',
        'any.required': 'Skill Category is required',
    }),

    linkedUserId: Joi.string()
        .regex(/^[0-9a-fA-F]{24}$/)
        .optional()
        .when('offerType', {
            is: 'both',
            then: Joi.forbidden().messages({
                'any.unknown': 'linkedUserId cannot be provided if offerType is "both"',
            }),
        })
        .messages({
            'objectId.base': 'Invalid ObjectId format for linkedUserId',
        }),

    status: Joi.string().valid('pending', 'in_progress', 'completed', 'cancelled').optional().default('pending').messages({
        'string.base': 'Status must be a string',
        'any.only': 'Status must be one of "pending", "in_progress", "completed", or "cancelled"',
    })
});

module.exports = UpdateSkillPostValidation;
