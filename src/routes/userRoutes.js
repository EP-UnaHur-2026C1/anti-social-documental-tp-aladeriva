const { Router } = require('express');
const schemaValidator = require("../middlewares/schemaValidator.js");
const userSchema = require("../schema/userSchema.js");
const {validateObjectId,validaExisteMiddleware} = require("../middlewares/existe.Middleware.js");
const User = require("../models/User.js");
const {
  getUsers,
  getUserBynickname,
  createUser,
  updateUser,
  deleteUser,
} = require('../controllers/userController');

const router = Router();

router.get('/', getUsers);
router.get('/:nickName', getUserBynickname);
router.post('/', schemaValidator(userSchema), createUser);
router.put('/:nickName',validateObjectId,validaExisteMiddleware(User), updateUser);
router.delete('/:nickName', deleteUser);

module.exports = router;