const { Router } = require('express');
const schemaValidator = require("../middlewares/schemaValidator.js");
const userSchema = require("../schema/userSchema.js");
const {validateObjectId,validaExisteMiddleware} = require("../middlewares/existe.Middleware.js");
const User = require("../models/User.js");
const {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} = require('../controllers/userController');

const router = Router();

router.get('/', getUsers);
router.get('/:id',validateObjectId(), validaExisteMiddleware(User), getUserById);
router.post('/', schemaValidator(userSchema), createUser);
router.put('/:id',validateObjectId(),validaExisteMiddleware(User), updateUser);
router.delete('/:id',validateObjectId(), validaExisteMiddleware(User), deleteUser);

module.exports = router;