const Joi = require("joi");

const postImageSchema = Joi.object({
    imagenesUrls: Joi.array().items(Joi.string().uri().required()).required()
});

module.exports = postImageSchema;