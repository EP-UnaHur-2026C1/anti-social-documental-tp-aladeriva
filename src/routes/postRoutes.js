const Post = require("../models/Post.js");
const { Router } = require('express');
const schemaValidator = require("../middlewares/schemaValidator");
const {validateObjectId,validaExisteMiddleware} = require("../middlewares/existe.middleware.js");
const createPostSchema = require("../schema/createPostSchema.js");
const addCommentSchema = require("../schema/addCommentSchema.js");
const addImageSchema= require("../schema/addImageSchema.js");
const tagSchema = require("../schema/tagSchema.js");
const {
  getAllPosts,
  getPostById,
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
router.get('/:id', getPostById);

router.post('/', schemaValidator(createPostSchema),createPost);
router.post('/:id/comments',schemaValidator(addCommentSchema),addComment);
router.post('/:id/images', schemaValidator(addImageSchema),addImageToPost);
router.post('/:id/tag', schemaValidator(tagSchema),addTagToPost);

router.put('/:id',validateObjectId,validaExisteMiddleware(Post),updatePost);

router.delete('/:id', deletePost);
//router.delete('/:id/comments/:commentId', deleteCommentFromPost);
router.delete('/:id/images/:imageId', removeImageFromPost);



module.exports = router;                      