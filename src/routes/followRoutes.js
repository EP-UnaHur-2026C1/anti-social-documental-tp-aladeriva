const { Router } = require('express');
const schemaValidator = require("../middlewares/schemaValidator");
const {validateObjectId,validaExisteMiddleware} = require("../middlewares/existe.middleware.js");
const Follow = require("../models/Follow.js");
const followSchema = require("../schema/followSchema.js");
const {
  followUser,
  unfollowUser,
  getFollowing,
  getFollowers,
} = require('../controllers/followController');

const router = Router();

// Seguir a un usuario
router.post('/',schemaValidator(followSchema),followUser);

// Dejar de seguir
router.delete('/', schemaValidator(followSchema), unfollowUser);

// Obtener a quiénes sigue un usuario
router.get('/:nickname/following', getFollowing);

// Obtener seguidores de un usuario
router.get('/:nickname/followers', getFollowers);

module.exports = router;