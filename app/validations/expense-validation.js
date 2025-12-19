const Joi = require('joi');

const expenseValidationSchema = Joi.object({
    title: Joi.string().required(),
    expenseDate: Joi.date().less(new Date()).required(),
    amount: Joi.number().min(1).required(),
    category: Joi.string().required().hex(),
    description: Joi.string().required()
});

module.exports = expenseValidationSchema;
