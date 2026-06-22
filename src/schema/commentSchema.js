const Joi = require("joi");

const commentSchema = Joi.object({
    texto: Joi.string().min(1).required(),
    userNickName: Joi.string().required(),
    postId: Joi.number().integer().required()
});

module.exports = commentSchema;