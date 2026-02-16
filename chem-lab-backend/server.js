import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import experimentRoutes from "./routes/experimentRoutes.js";

dotenv.config();

const app = express();

/* ----------- CORS FIX ----------- */
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://v-one-kohl.vercel.app"  // ❌ removed trailing slash
    ],
    credentials: true,
  })
);

app.use(express.json());

/* ----------- MongoDB ----------- */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.log("MongoDB Error:", err));

/* ----------- Health Check ----------- */
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

/* ----------- Routes ----------- */
app.use("/api/experiments", experimentRoutes);

/* ----------- Server ----------- */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
