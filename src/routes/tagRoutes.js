const { Router } = require('express');
const Tag = require("../models/Tag.js");
const schemaValidator = require("../middlewares/schemaValidator");
const {validateObjectId,validaExisteMiddleware} = require("../middlewares/existe.middleware");
const tagSchema= require("../schema/tagSchema.js");
const {
  getTags,
  getTagById,
  createTag,
  updateTag,
  deleteTag,
} = require('../controllers/tagController');

const router = Router();

router.get('/', getTags);
router.get('/:id', validateObjectId('id'),validaExisteMiddleware(Tag, 'id'),getTagById);

router.post('/',schemaValidator(tagSchema),createTag);

router.put('/:id',validateObjectId(),validaExisteMiddleware(Tag),updateTag);

router.delete('/:id',validateObjectId(),validaExisteMiddleware(Tag),deleteTag);

module.exports = router;