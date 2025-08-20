import { db } from "../config/firebase.js";

// Crear usuario
export const addUser = async (userData) => {
  const userRef = db.collection("User").doc(userData.userName);
  await userRef.set({
    ...userData,
    createdAt: new Date()
  });
};

// Obtener todos los usuarios
export const fetchAllUsers = async () => {
  const snapshot = await db.collection("User").get();
  return snapshot.docs.map(doc => doc.data());
};

// Obtener usuario por ID
export const fetchUserById = async (userName) => {
  const doc = await db.collection("User").doc(userName).get();
  return doc.exists ? doc.data() : null;
};

// Actualizar usuario
export const editUser = async (userName, updateData) => {
  const userRef = db.collection("User").doc(userName);
  await userRef.update(updateData);
};

// Eliminar usuario
export const removeUser = async (userName) => {
  await db.collection("User").doc(userName).delete();
};
