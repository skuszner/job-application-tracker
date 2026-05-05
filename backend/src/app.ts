import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.ts";
import jobsRoutes from "./routes/jobs.ts";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.status(200).send("OK");
});

app.use("/auth", authRoutes);
app.use("/jobs", jobsRoutes);

export default app;
