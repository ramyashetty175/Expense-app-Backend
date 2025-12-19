const Joi = require('joi');

const categoryValidationSchema = Joi.object({
    name: Joi.string().trim().required()
})

module.exports = categoryValidationSchema;
