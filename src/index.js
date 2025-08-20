import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import userRoutes from "./routes/user.routes.js";
import profileRoutes from "./routes/profileTickets.routes.js";
import ticketsRoutes from "./routes/tickets.routes.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Rutas de usuarios
app.use("/users", userRoutes);

// Rutas de perfiles
app.use("/users/:userName/profiles", profileRoutes);

// Rutas de tickets
app.use("/users/:userName/profiles/:profileName/tickets", ticketsRoutes);

app.get("/", (req, res) => {res.json({ message: "API con Firebase lista 🚀" })});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {console.log(`Servidor corriendo en http://localhost:${PORT}`);});
