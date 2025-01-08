import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";

// dotenv
import dotenv from "dotenv";
dotenv.config({ path: "./server/.env" });

// Routes
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import userRouter from "./routes/userRoutes.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const { MONGODB_URI, PORT } = process.env;

const app = express();
app.use(cookieParser());

// Middleware
const allowedOrigins = [
  "https://sari-scan.onrender.com",
  "http://localhost:3000",
  "https://sari-scan.onrender.com",
];
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// Define Routes
// app.get("/", (req, res) => res.send("<b>API WORKING</b>"));
app.use("/api/auth", authRoutes);
app.use("/api/user", userRouter);
app.use("/api/products", productRoutes);

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("Connected to MONGODB");
  })
  .catch((err) => {
    console.log("Error Connecting", err.message);
  });

// Serve static files for simulations
app.use(express.static(path.join(__dirname, "../client/dist")));

// Catch-all route
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/dist/index.html"));
});

// Start server

app.listen(PORT, () => {
  console.log(`Server is running at port ${PORT}`);
});
