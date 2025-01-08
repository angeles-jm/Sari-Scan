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
app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:3000"], // Specify the allowed origin
    credentials: true, // Allow credentials (cookies, headers)
  })
);

// Define Routes
app.get("/", (req, res) => res.send("<b>API WORKING</b>"));
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

// Serve static files
app.use(express.static(path.join(__dirname, "../client/dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/dist", "index.html"));
});

// Start server

app.listen(PORT, () => {
  console.log(`Server is running at port ${PORT}`);
});
