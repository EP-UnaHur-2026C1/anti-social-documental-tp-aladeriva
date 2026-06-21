// src/controllers/userController.js

const { User } = require('../db/schema/userSchema');
const { validateUser } = require('../middlewares/validation');

// Obtener todos los usuarios
const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener usuarios", error });
  }
};

// Crear un nuevo usuario
const createUser = async (req, res) => {
  try {
    const { nickName, password } = req.body;
    const user = await User.create({ _id: nickName, nickName, password });
    res.status(201).json(user);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: "Error: El nickName ya existe." });
    }
    res.status(500).json({ message: "Error al crear usuario", error });
  }
};

// Eliminar un usuario por nickName
const deleteUser = async (req, res) => {
  try {
    const { nickName } = req.params;
    const result = await User.findByIdAndDelete(nickName);

    if (!result) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.status(200).json({ message: "Usuario eliminado" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar usuario", error });
  }
};

// Actualizar la contraseña de un usuario
const updateUser = async (req, res) => {
  try {
    const { nickName } = req.params;
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ message: "La contraseña es obligatoria." });
    }

    const user = await User.findByIdAndUpdate(
      nickName,
      { password },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.status(200).json({ message: "Contraseña actualizada correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar usuario", error });
  }
};

// Obtener un usuario por nickName
const getUserById = async (req, res) => {
  try {
    const { nickName } = req.params;
    const user = await User.find({nickName: nickName});

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener usuario", error });
  }
};

module.exports = {
  createUser,
  getUsers,
  deleteUser,
  updateUser,
  getUserById,

};
