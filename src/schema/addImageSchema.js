const Joi = require('joi');

const addImageSchema = Joi.object({
    imageUrl: Joi.string()
        .uri()
        .required()
});

module.exports = addImageSchema;