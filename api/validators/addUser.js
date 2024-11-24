const joi = require('joi');

const roles = ['admin', 'skillprovider', 'skillexpert'];
const objectIdRegex = /^[0-9a-fA-F]{24}$/;

const schema = joi.object({
  email: joi.string().email().required(),
  role: joi.string().valid(...roles).required().messages({
    'any.only': 'Invalid role'
  }),
  username: joi.string().pattern(/^[a-zA-Z\s]+$/).required().messages({
    'string.pattern.base': 'Username must contain only letters',
  }),
  phone: joi.string().pattern(/^[0-9]+$/).required().messages({
    'string.pattern.base': 'Phone must contain only numbers'
  }),
  approved: joi.boolean().default(false),
  skills: joi.array().items(
    joi.string().pattern(objectIdRegex).required().messages({
      'string.pattern.base': 'Each skill ID must be a valid ObjectId',
      'string.base': 'Each skill ID must be a string',
    })
  ).required().messages({
    'array.base': 'Skills must be an array',
    'array.includesRequiredUnknowns': 'Skills array cannot be empty',
  }),

  // Conditional validation for GitHub and LinkedIn profiles
  githubProfile: joi.when('role', {
    is: 'skillexpert',
    then: joi.string()
      .pattern(/^https:\/\/github\.com\/[A-Za-z0-9_-]+$/)
      .required()
      .messages({
        'string.empty': 'GitHub profile link is required for skill experts',
        'string.pattern.base': 'GitHub profile link must be a valid GitHub URL (e.g., https://github.com/username)'
      }),
    otherwise: joi.optional()
  }),

  linkedinProfile: joi.when('role', {
    is: 'skillexpert',
    then: joi.string()
      .pattern(/^https:\/\/www\.linkedin\.com\/in\/[A-Za-z0-9_-]+\/?$/)
      .required()
      .messages({
        'string.empty': 'LinkedIn profile link is required for skill experts',
        'string.pattern.base': 'LinkedIn profile link must be a valid LinkedIn URL (e.g., https://www.linkedin.com/in/username)'
      }),
    otherwise: joi.optional()
  })
});

module.exports = schema;
