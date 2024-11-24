const joi = require('joi');


const schema = joi.object({
    email: joi.string().email().required(),
})

module.exports = schema;