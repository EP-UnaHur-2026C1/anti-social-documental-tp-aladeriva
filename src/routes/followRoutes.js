const { Router } = require('express');

const {
  getFollows,
  getFollowById,
  createFollow,
  updateFollow,
  deleteFollow,
} = require('../controllers/followController');

const router = Router();

router.get('/', getFollows);
router.get('/:id', getFollowById);

router.post('/', createFollow);

router.put('/:id', updateFollow);

router.delete('/:id', deleteFollow);

module.exports = router;