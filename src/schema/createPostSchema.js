const Joi = require('joi');

const createPostSchema = Joi.object({
    description: Joi.string()
        .trim()
        .min(5)
        .required(),

    nickName: Joi.string()
        .trim()
        .min(4)
        .required()
});

module.exports = createPostSchema;