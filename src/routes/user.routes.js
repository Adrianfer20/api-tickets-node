import { Router } from "express";
import {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser
} from "../controllers/user.controller.js";

const router = Router();

// Crear usuario
// POST /users 
// Body: { userName, fullName, email, tfln }
router.post("/", createUser);

// Obtener todos los usuarios
// GET /users
router.get("/", getAllUsers);

// Obtener un usuario por userName
// GET /users/:userName
router.get("/:userName", getUserById);

// Actualizar usuario
// PUT /users/:userName
router.put("/:userName", updateUser);

// Eliminar usuario
// DELETE /users/:userName
router.delete("/:userName", deleteUser);

export default router;
