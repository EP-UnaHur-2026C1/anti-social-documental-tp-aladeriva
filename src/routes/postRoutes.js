const { Router } = require('express');
const Post = require("../models/Post.js");
const schemaValidator = require("../middlewares/schemaValidator");
const {validateObjectId,validaExisteMiddleware} = require("../middlewares/existe.middleware.js");
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
  updateCommentVisibility,
  deleteCommentFromPost,
  addImageToPost,
  addTagToPost,
  removeImageFromPost
} = require('../controllers/postController');

const router = Router();

router.get('/', getAllPosts);
router.get('/:postId', validateObjectId('postId'),validaExisteMiddleware(Post, 'postId'),getPostById);
router.get('/:postId/comments', validateObjectId('postId'),validaExisteMiddleware(Post, 'postId'),getCommentsByPostId);
router.get('/:postId/images', validateObjectId('postId'),validaExisteMiddleware(Post, 'postId'),getImagesByPostId);

router.post('/', schemaValidator(createPostSchema),createPost);
router.post('/:postId/comments',schemaValidator(addCommentSchema),addComment);
router.post('/:postId/images', schemaValidator(addImageSchema),addImageToPost);
router.post('/:postId/tag', schemaValidator(tagSchema),addTagToPost);


router.put('/:postId',validateObjectId('postId'),validaExisteMiddleware(Post,'postId'),updatePost);
router.put('/:postId/comments/:commentId/visibility',validateObjectId('postId'),validateObjectId('commentId'),validaExisteMiddleware(Post, 'postId'),updateCommentVisibility);

router.delete('/:postId',validateObjectId('postId'),validaExisteMiddleware(Post,'postId'), deletePost);
router.delete('/:postId/comments/:commentId', validateObjectId('postId'),validateObjectId('commentId'),validaExisteMiddleware(Post,'postId'),deleteCommentFromPost);
router.delete('/:postId/images/:imageId', validateObjectId('postId'),validateObjectId('imageId'),validaExisteMiddleware(Post,'postId'),removeImageFromPost);



module.exports = router;                      