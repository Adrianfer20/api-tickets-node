// src/controllers/tickets.controller.js
import * as ticketsService from "../services/tickets.service.js";

/**
 * Crear ticket (cantidad indicada en body: { quantity: number })
 */
export const createTicketController = async (req, res) => {
  try {
    const { userName, profileName } = req.params;
    const { quantity } = req.body;

    if (!quantity || typeof quantity !== "number" || quantity <= 0) {
      return res.status(400).json({ success: false, message: "quantity (número > 0) es requerido en el body" });
    }

    const ticket = await ticketsService.createTicket(userName, profileName, quantity);
    return res.status(201).json({ success: true, message: "Ticket creado correctamente", data: ticket });
  } catch (err) {
    console.error("createTicketController:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * Obtener todos los tickets de un perfil
 */
export const getTicketsController = async (req, res) => {
  try {
    const { userName, profileName } = req.params;
    const tickets = await ticketsService.getTickets(userName, profileName);
    return res.status(200).json({ success: true, data: tickets });
  } catch (err) {
    console.error("getTicketsController:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * Obtener ticket por ID
 */
export const getTicketByIdController = async (req, res) => {
  try {
    const { userName, profileName, ticketId } = req.params;
    const ticket = await ticketsService.getTicketById(userName, profileName, ticketId);
    if (!ticket) return res.status(404).json({ success: false, message: "Ticket no encontrado" });
    return res.status(200).json({ success: true, data: ticket });
  } catch (err) {
    console.error("getTicketByIdController:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * Actualizar un code dentro de un ticket (se proporciona ticketId en la ruta)
 * Body opcional: { status: boolean, usedAt: "ISO string" }
 */
export const updateTicketCodeByTicketController = async (req, res) => {
  try {
    const { userName, profileName, ticketId, codeValue } = req.params;
    const { status, usedAt } = req.body;

    if (status === undefined && usedAt === undefined) {
      return res.status(400).json({ success: false, message: "Al menos status o usedAt deben enviarse en el body" });
    }

    const updated = await ticketsService.updateTicketCodeByTicket(
      userName,
      profileName,
      ticketId,
      codeValue,
      { status, usedAt }
    );

    if (!updated) return res.status(404).json({ success: false, message: "Código no encontrado en ese ticket" });

    return res.status(200).json({ success: true, message: "Código actualizado correctamente", data: updated });
  } catch (err) {
    console.error("updateTicketCodeByTicketController:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * Actualizar un code buscando sólo por codeValue (sin ticketId)
 * Body opcional: { status: boolean, usedAt: "ISO string" }
 */
export const updateTicketCodeByValueController = async (req, res) => {
  try {
    const { userName, profileName, codeValue } = req.params;
    // let { status, usedAt } = req.body;
    let status, usedAt 


    // ✅ Si no se envía ninguno, asignar valores por defecto
    if (status === undefined && usedAt === undefined) {
      status = true;
      usedAt = new Date().toISOString();
    } else {
      // ✅ Si solo se envía status pero no usedAt
      if (status !== undefined && usedAt === undefined) {
        usedAt = new Date().toISOString();
      }
      // ✅ Si solo se envía usedAt pero no status
      if (status === undefined && usedAt !== undefined) {
        status = true;
      }
    }

    const updated = await ticketsService.updateTicketCodeByValue(
      userName,
      profileName,
      codeValue,
      { status, usedAt }
    );

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Código no encontrado en ningún ticket del perfil",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Código actualizado correctamente",
      data: updated,
    });
  } catch (err) {
    console.error("updateTicketCodeByValueController:", err);
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};


/**
 * Eliminar ticket por ID
 */
export const deleteTicketController = async (req, res) => {
  try {
    const { userName, profileName, ticketId } = req.params;
    await ticketsService.deleteTicket(userName, profileName, ticketId);
    return res.status(200).json({ success: true, message: "Ticket eliminado correctamente" });
  } catch (err) {
    console.error("deleteTicketController:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};
