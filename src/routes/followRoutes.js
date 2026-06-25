const { Router } = require('express');

const {
  followUser,
  getFollowing,
  getFollowers,
  unfollowUser
} = require('../controllers/followController');

const router = Router();

router.post('/', followUser);
router.get('/following/:nickname', getFollowing);
router.get('/followers/:nickname', getFollowers);
router.delete('/', unfollowUser);

module.exports = router;