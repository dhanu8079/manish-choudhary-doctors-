import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- MongoDB Setup ---
const MONGODB_URI = process.env.MONGODB_URI;

if (MONGODB_URI) {
  mongoose.connect(MONGODB_URI)
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.error("MongoDB connection error:", err));
} else {
  console.warn("MONGODB_URI not found in environment. Appointment saving will be disabled.");
}

const appointmentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  problem: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Appointment = mongoose.model("Appointment", appointmentSchema);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  // --- API Routes ---
  app.post("/api/appointments", async (req, res) => {
    try {
      if (!MONGODB_URI) {
         // Fallback for demo purposes if DB not connected
         console.log("Demo mode: Appointment data:", req.body);
         return res.status(200).json({ message: "Appointment request received (Demo Mode)" });
      }

      const { name, phone, date, time, problem } = req.body;
      
      // Basic validation
      if (!name || !phone || !date || !time || !problem) {
        return res.status(400).json({ error: "All fields are required" });
      }

      const appointment = new Appointment({
        name,
        phone,
        date: new Date(date),
        time,
        problem,
      });

      await appointment.save();
      res.status(201).json({ message: "Appointment saved successfully", data: appointment });
    } catch (error) {
      console.error("Error saving appointment:", error);
      res.status(500).json({ error: "Failed to save appointment" });
    }
  });

  // --- Vite Middleware / Static Serving ---
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
