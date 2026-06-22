const Joi = require("joi");

const tagSchema = Joi.object({
    name: Joi.string().min(2).required()
});

module.exports = tagSchema;