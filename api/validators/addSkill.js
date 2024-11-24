const joi = require('joi');


const schema = joi.object({
    name: joi.string().required().pattern(/^[a-zA-Z\s]+$/),
    description: joi.string(),
})

module.exports = schema;