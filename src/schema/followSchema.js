const Joi = require("joi");

const followSchema = Joi.object({
  follower_nickname: Joi.string().min(4).required(),
  followed_nickname: Joi.string().min(4).required()
});

module.exports = followSchema;