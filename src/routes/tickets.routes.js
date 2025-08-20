// src/routes/tickets.routes.js
import { Router } from "express";
import {
  createTicketController,
  getTicketsController,
  getTicketByIdController,
  updateTicketCodeByTicketController,
  updateTicketCodeByValueController,
  deleteTicketController
} from "../controllers/tickets.controller.js";

import { validateCreateTicket } from "../middlewares/validators.js";
const router = Router({ mergeParams: true });

// Crear un nuevo ticket con X códigos
// POST /users/:userName/profiles/:profileName/tickets
router.post("/", validateCreateTicket, createTicketController);

// Obtener todos los tickets de un perfil
// GET /users/:userName/profiles/:profileName/tickets
// BODY {}
router.get("/", getTicketsController);

// Obtener un ticket por ID
// GET /users/:userName/profiles/:profileName/tickets/:ticketId
router.get("/:ticketId", getTicketByIdController);

// Actualizar un code específico dentro de un ticket (usando ticketId y codeValue)
// Post /users/:userName/profiles/:profileName/tickets/:ticketId/codes/:codeValue
router.post("/:ticketId/codes/:codeValue", updateTicketCodeByTicketController);

// Actualizar un code buscando solo por codeValue (sin ticketId)
// Post /users/:userName/profiles/:profileName/tickets/codes/:codeValue
router.post("/codes/:codeValue", updateTicketCodeByValueController);

// Eliminar un ticket
// DELETE /users/:userName/profiles/:profileName/tickets/:ticketId
router.delete("/:ticketId", deleteTicketController);

export default router;

