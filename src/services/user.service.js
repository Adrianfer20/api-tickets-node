import { db, auth, COLLECTION_USER } from "../config/firebase.js";


// Crear usuario
export const addUser = async (data) => {
  const { email, password, role, userName, fullName, tlfn } = data;

  // 🔹 Formatear datos a minúsculas para consistencia
  const formattedEmail = email.toLowerCase();
  const formattedUserName = userName.toLowerCase();
  const formattedFullName = fullName.toLowerCase();

  // 🔹 Crear usuario en Firebase Authentication
  const userRecord = await auth.createUser({
    email: formattedEmail,
    password,
    displayName: formattedFullName,
  });

  const uid = userRecord.uid;

  // 🔹 Guardar datos extra en Firestore
  const userData = {
    uid,
    userName: formattedUserName,
    fullName: formattedFullName,
    email: formattedEmail,
    tlfn,
    role: role || "client",
    createdAt: new Date().toISOString(),
  };

  await db.collection(COLLECTION_USER).doc(formattedUserName).set(userData);

  return userData;
};
// Obtener todos los usuarios
export const fetchAllUsers = async () => {
  const snapshot = await db.collection(COLLECTION_USER).get();
  return snapshot.docs.map(doc => doc.data());
};

// Obtener usuario por ID
export const fetchUserById = async (userName) => {
  const doc = await db.collection(COLLECTION_USER).doc(userName).get();
  return doc.exists ? doc.data() : null;
};

// Actualizar usuario
export const editUser = async (userName, updateData) => {
  const userRef = db.collection(COLLECTION_USER).doc(userName);
  await userRef.update(updateData);
};

// Eliminar usuario
export const removeUser = async (userName) => {
  await db.collection(COLLECTION_USER).doc(userName).delete();
};
