import {
  addProfile,
  fetchAllProfiles,
  fetchProfileById,
  editProfile,
  removeProfile
} from "../services/profileTickets.service.js";

// Crear perfil
export const createProfile = async (req, res) => {
  try {
    const { userName } = req.params;
    const data = req.body;

    if (!data.name || !data.uptime || !data.server) {
      return res.status(400).json({ error: "Faltan campos obligatorios" });
    }

    await addProfile(userName, data);
    res.status(201).json({ message: "Perfil creado correctamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener todos los perfiles de un usuario
export const getAllProfiles = async (req, res) => {
  try {
    const { userName } = req.params;
    const profiles = await fetchAllProfiles(userName);
    res.json(profiles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener un perfil por ID
export const getProfileById = async (req, res) => {
  try {
    const { userName, profileName } = req.params;
    const profile = await fetchProfileById(userName, profileName);
    if (!profile) {
      return res.status(404).json({ error: "Perfil no encontrado" });
    }
    res.json(profile);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Actualizar perfil
export const updateProfile = async (req, res) => {
  try {
    const { userName, profileName } = req.params;
    const data = req.body;
    await editProfile(userName, profileName, data);
    res.json({ message: "Perfil actualizado correctamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Eliminar perfil
export const deleteProfile = async (req, res) => {
  try {
    const { userName, profileName } = req.params;
    await removeProfile(userName, profileName);
    res.json({ message: "Perfil eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
