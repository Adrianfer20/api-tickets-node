// src/services/tickets.service.js
import { COLLECTION_PROFILE, COLLECTION_TICKETS, COLLECTION_USER, db } from "../config/firebase.js"; // debe exportar admin.firestore() como "db"
import admin from "firebase-admin";



/**
 * Generador de código: 6 chars [a-z0-9]
 */
const generateRandomCode = () => {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let s = "";
  for (let i = 0; i < 6; i++) s += chars.charAt(Math.floor(Math.random() * chars.length));
  return s;
};

/**
 * Obtener todos los códigos existentes en un perfil (todos los tickets)
 * Devuelve Set de strings
 */
const getExistingCodesSet = async (userName, profileName) => {
  const ticketsSnap = await db
    .collection(COLLECTION_USER)
    .doc(userName)
    .collection(COLLECTION_PROFILE)
    .doc(profileName)
    .collection(COLLECTION_TICKETS)
    .get();

  const set = new Set();
  ticketsSnap.forEach(doc => {
    const data = doc.data();
    if (Array.isArray(data.codes)) {
      data.codes.forEach(c => {
        if (c && c.code) set.add(c.code);
      });
    }
  });
  return set;
};

/**
 * Genera `amount` códigos únicos dentro del perfil
 */
const generateUniqueCodesForProfile = async (userName, profileName, amount) => {
  const existing = await getExistingCodesSet(userName, profileName);
  const codes = [];

  while (codes.length < amount) {
    const c = generateRandomCode();
    if (!existing.has(c) && !codes.some(x => x.code === c)) {
      const codeObj = { code: c, status: false, usedAt: null };
      codes.push(codeObj);
      existing.add(c); // evita colisiones internas del loop
    }
  }

  return codes;
};

/**
 * Crear ticket (cantidad = number)
 */
export const createTicket = async (userName, profileName, quantity) => {
  // validar existencia del perfil (opcional pero recomendable)
  const profileRef = db.collection(COLLECTION_USER).doc(userName).collection(COLLECTION_PROFILE).doc(profileName);
  const profileSnap = await profileRef.get();
  if (!profileSnap.exists) throw new Error("Profile-Tickets no encontrado");

  const codes = await generateUniqueCodesForProfile(userName, profileName, quantity);

  const ticketObj = {
    codes,
    createdAt: admin.firestore.Timestamp.now()
  };

  const newRef = await db
    .collection(COLLECTION_USER)
    .doc(userName)
    .collection(COLLECTION_PROFILE)
    .doc(profileName)
    .collection(COLLECTION_TICKETS)
    .add(ticketObj);

  return { id: newRef.id, ...ticketObj };
};

/**
 * Obtener todos los tickets de un perfil
 */
export const getTickets = async (userName, profileName) => {
  const snap = await db
    .collection(COLLECTION_USER)
    .doc(userName)
    .collection(COLLECTION_PROFILE)
    .doc(profileName)
    .collection(COLLECTION_TICKETS)
    .get();

  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};

/**
 * Obtener un ticket por ID
 */
export const getTicketById = async (userName, profileName, ticketId) => {
  const ref = db
    .collection(COLLECTION_USER)
    .doc(userName)
    .collection(COLLECTION_PROFILE)
    .doc(profileName)
    .collection(COLLECTION_TICKETS)
    .doc(ticketId);

  const snap = await ref.get();
  if (!snap.exists) return null;
  return { id: snap.id, ...snap.data() };
};

/**
 * Actualiza un code dentro de un ticket (usando ticketId)
 * updateFields: { status?: boolean, usedAt?: ISOStringOrNull }
 *
 * Retorna el ticket actualizado (obj) o null si no se encontró el code
 */
export const updateTicketCodeByTicket = async (userName, profileName, ticketId, codeValue, updateFields) => {
  const ticketRef = db
    .collection(COLLECTION_USER)
    .doc(userName)
    .collection(COLLECTION_PROFILE)
    .doc(profileName)
    .collection(COLLECTION_TICKETS)
    .doc(ticketId);

  const ticketSnap = await ticketRef.get();
  if (!ticketSnap.exists) return null;

  const ticketData = ticketSnap.data();
  if (!Array.isArray(ticketData.codes)) return null;

  let found = false;
  const updatedCodes = ticketData.codes.map(c => {
    if (c.code === codeValue) {
      found = true;
      // Decide usedAt value: si se envía usedAt, usarlo; si no y status === true, usar timestamp ahora.
      const newUsedAt = updateFields.usedAt !== undefined
        ? (updateFields.usedAt ? new Date(updateFields.usedAt) : null)
        : (updateFields.status === true ? admin.firestore.Timestamp.now() : c.usedAt);

      return {
        ...c,
        status: updateFields.status !== undefined ? updateFields.status : c.status,
        usedAt: newUsedAt
      };
    }
    return c;
  });

  if (!found) return null;

  await ticketRef.update({ codes: updatedCodes });

  // devolver el ticket actualizado
  const updatedSnap = await ticketRef.get();
  return { id: updatedSnap.id, ...updatedSnap.data() };
};

/**
 * Buscar el ticket que contiene el codeValue en TODO el perfil y actualizarlo.
 * Retorna el ticket actualizado o null si no se encontró.
 */
export const updateTicketCodeByValue = async (userName, profileName, codeValue, updateFields) => {
  const ticketsRef = db
    .collection(COLLECTION_USER)
    .doc(userName)
    .collection(COLLECTION_PROFILE)
    .doc(profileName)
    .collection(COLLECTION_TICKETS);

  // obtenemos todos los tickets y buscamos el que tenga el code
  const snap = await ticketsRef.get();

  let foundTicketId = null;
  snap.forEach(doc => {
    const data = doc.data();
    if (Array.isArray(data.codes) && data.codes.some(c => c.code === codeValue)) {
      foundTicketId = doc.id;
    }
  });

  if (!foundTicketId) return null;

  return await updateTicketCodeByTicket(userName, profileName, foundTicketId, codeValue, updateFields);
};

/**
 * Eliminar ticket
 */
export const deleteTicket = async (userName, profileName, ticketId) => {
  const ref = db
    .collection(COLLECTION_USER)
    .doc(userName)
    .collection(COLLECTION_PROFILE)
    .doc(profileName)
    .collection(COLLECTION_TICKETS)
    .doc(ticketId);

  await ref.delete();
  return true;
};

