const Joi = require('joi');

const addCommentSchema = Joi.object({
    text: Joi.string()
        .trim()
        .min(1)
        .required(),

    nickName: Joi.string()
        .trim()
        .min(4)
        .required()
});

module.exports = addCommentSchema;