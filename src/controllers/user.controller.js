import {
  addUser,
  fetchAllUsers,
  fetchUserById,
  editUser,
  removeUser
} from "../services/user.service.js";

// Crear usuario
export const createUser = async (req, res) => {
  try {
    const { userName, fullName, email, password, tlfn, role } = req.body;

    if (!userName || !fullName || !email || !password || !tlfn) {
      return res.status(400).json({ error: "Faltan campos obligatorios" });
    }

    const newUser = await addUser({ userName, fullName, email, password, tlfn, role });
    res.status(201).json({ message: "Usuario creado correctamente", user: newUser });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener todos los usuarios
export const getAllUsers = async (req, res) => {
  try {
    const users = await fetchAllUsers();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener un usuario por ID
export const getUserById = async (req, res) => {
  try {
    const { userName } = req.params;
    const user = await fetchUserById(userName);
    if (!user) return res.status(404).json({ error: "Usuario no encontrado" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Actualizar usuario
export const updateUser = async (req, res) => {
  try {
    const { userName } = req.params;
    const data = req.body;
    await editUser(userName, data);
    res.json({ message: "Usuario actualizado correctamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Eliminar usuario
export const deleteUser = async (req, res) => {
  try {
    const { userName } = req.params;
    await removeUser(userName);
    res.json({ message: "Usuario eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
