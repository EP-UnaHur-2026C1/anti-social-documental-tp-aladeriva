const Joi = require("joi");

const postSchema = Joi.object({
    descripcion: Joi.string().min(5).required(),
    userNickName: Joi.string().min(4).required(),
    tags: Joi.array().items(Joi.string()),
    imagenesUrls: Joi.array().items(Joi.string())
})
module.exports = postSchema