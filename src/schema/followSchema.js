const Joi = require("joi");

const followSchema = Joi.object({
  followerNickName: Joi.string().min(4).required(),
  followedNickName: Joi.string().min(4).required()
});

module.exports = followSchema;