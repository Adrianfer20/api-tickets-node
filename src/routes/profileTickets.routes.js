import { Router } from "express";
import {
  createProfile,
  getAllProfiles,
  getProfileById,
  updateProfile,
  deleteProfile
} from "../controllers/profileTickets.controller.js";

const router = Router({ mergeParams: true });

// Crear perfil de tickets para un usuario
// POST /users/:userName/profiles
router.post("/", createProfile);

// Obtener todos los perfiles de un usuario
// GET /users/:userName/profiles
router.get("/", getAllProfiles);

// Obtener un perfil específico
// GET /users/:userName/profiles/:profileName
router.get("/:profileName", getProfileById);

// Actualizar perfil
// PUT /users/:userName/profiles/:profileName
router.put("/:profileName", updateProfile);

// Eliminar perfil
// DELETE /users/:userName/profiles/:profileName
router.delete("/:profileName", deleteProfile);

export default router;
