const Post = require("../models/Post.js");
const { Router } = require('express');
const schemaValidator = require("../middlewares/schemaValidator");
const {validateObjectId,validaExisteMiddleware} = require("../middlewares/existe.middleware");
const createPostSchema = require("../schema/createPostSchema.js");
const addCommentSchema = require("../schema/addCommentSchema.js");
const addImageSchema= require("../schema/addImageSchema.js");
const tagSchema = require("../schema/tagSchema.js");
const {
  getAllPosts,
  getPostById,
  getCommentsByPostId,
  getImagesByPostId,
  createPost,
  updatePost,
  deletePost,
  addComment,
  deleteCommentFromPost,
  addImageToPost,
  addTagToPost,
  removeImageFromPost
} = require('../controllers/postController');

const router = Router();

router.get('/', getAllPosts);
router.get('/:postId', getPostById);
router.get('/:postId/comments', getCommentsByPostId);
router.get('/:postId/images', getImagesByPostId);

router.post('/', schemaValidator(createPostSchema),createPost);
router.post('/:postId/comments',schemaValidator(addCommentSchema),addComment);
router.post('/:postId/images', schemaValidator(addImageSchema),addImageToPost);
router.post('/:postId/tag', schemaValidator(tagSchema),addTagToPost);

router.put('/:id',validateObjectId,validaExisteMiddleware(Post),updatePost);

router.delete('/:id', deletePost);
router.delete('/:postId/comments/:commentId', deleteCommentFromPost);
router.delete('/:postId/images/:imageId', removeImageFromPost);



module.exports = router;                      