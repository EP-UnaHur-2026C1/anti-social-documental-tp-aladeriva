const { Router } = require('express');
const schemaValidator = require("../middlewares/schemaValidator.js");
const userSchema = require("../schema/userSchema.js");
const userUpdateSchema = require("../schema/userUpdateSchema.js");
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
router.put('/:nickName', schemaValidator(userSchema), updateUser);
router.delete('/:nickName', deleteUser);

module.exports = router;