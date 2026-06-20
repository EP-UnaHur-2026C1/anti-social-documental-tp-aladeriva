const { Router } = require('express');

const {
  getPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  addCommentToPost,
  deleteCommentFromPost,
  addImageToPost,
  deleteImageFromPost,
} = require('../controllers/postController');

const router = Router();

router.get('/', getPosts);
router.get('/:id', getPostById);

router.post('/', createPost);

router.put('/:id', updatePost);

router.delete('/:id', deletePost);

router.post('/:id/comments', addCommentToPost);
router.delete('/:id/comments/:commentId', deleteCommentFromPost);

router.post('/:id/images', addImageToPost);
router.delete('/:id/images/:imageId', deleteImageFromPost);

module.exports = router;