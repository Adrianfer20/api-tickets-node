import { db } from "../config/firebase.js";

// Crear perfil
export const addProfile = async (userName, profileData) => {
  const profileRef = db
    .collection("User")
    .doc(userName)
    .collection("Profile-Tickets")
    .doc(profileData.name);
    
  await profileRef.set({
    ...profileData,
    createdAt: new Date()
  });
};

// Obtener todos los perfiles
export const fetchAllProfiles = async (userName) => {
  const snapshot = await db
    .collection("User")
    .doc(userName)
    .collection("Profile-Tickets")
    .get();

  return snapshot.docs.map(doc => doc.data());
};

// Obtener un perfil por ID
export const fetchProfileById = async (userName, profileName) => {
  const docRef = await db
    .collection("User")
    .doc(userName)
    .collection("Profile-Tickets")
    .doc(profileName)
    .get();

  return docRef.exists ? docRef.data() : null;
};

// Actualizar perfil
export const editProfile = async (userName, profileName, updateData) => {
  const profileRef = db
    .collection("User")
    .doc(userName)
    .collection("Profile-Tickets")
    .doc(profileName);

  await profileRef.update(updateData);
};

// Eliminar perfil
export const removeProfile = async (userName, profileName) => {
  await db
    .collection("User")
    .doc(userName)
    .collection("Profile-Tickets")
    .doc(profileName)
    .delete();
};
