const { Router } = require('express');

const {
  followUser,
  unfollowUser,
  getFollowing,
  getFollowers,
} = require('../controllers/followController');

const router = Router();

// Seguir a un usuario
router.post('/', followUser);

// Dejar de seguir
router.delete('/', unfollowUser);

// Obtener a quiénes sigue un usuario
router.get('/:nickname/following', getFollowing);

// Obtener seguidores de un usuario
router.get('/:nickname/followers', getFollowers);

module.exports = router;