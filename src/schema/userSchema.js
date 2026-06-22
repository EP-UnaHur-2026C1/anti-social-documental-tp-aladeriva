const Joi = require("joi");

const userSchema = Joi.object({
    nickName: Joi.string().min(4).required()
})

module.exports = userSchema