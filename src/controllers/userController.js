const User = require('../models/User');

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
    const { nickName } = req.body;
    const user = await User.create({ nickName });
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
    const { id } = req.params;
    const result = await User.findByIdAndDelete(id);

    if (!result) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.status(200).json({ message: "Usuario eliminado" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar usuario", error });
  }
};

// Actualizar nombre a un usuario
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { nickName } = req.body;
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    user.nickName = nickName;
    await user.save();
    res.json(user);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

// Obtener un usuario por id
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

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
  getUserById

};
