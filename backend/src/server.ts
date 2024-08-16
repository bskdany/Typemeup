import express from "express";
import type { User, Session } from "lucia";
import { profileRouter } from "./routes/profile/profileRouter.js";
import { authRouter } from "./routes/auth/authRouter.js";
import { devMode, validateSession } from "./routes/middleware.js";
import { config } from "./lib/config.js";
import cors from 'cors';

console.log("PROD: " + config.is_prod);
console.log("DOCKER: " + config.is_docker);
console.log("Backend port: " + config.port_backend);
console.log("Db location: " + config.db_path);
console.log("CORS: " + config.use_cors);
console.log("Origin: " + config.frontend_url);

const app = express();

if (config.use_cors)
  app.use(cors({
    origin: config.frontend_url,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  }));

app.use(express.json());

if (!config.is_prod) {
  app.use(devMode)
}

app.use(validateSession);

app.use("/api/auth", authRouter);
app.use("/api/profile", profileRouter);

app.listen(config.port_backend);

console.log("Server running on port " + config.port_backend);

declare global {
  namespace Express {
    interface Locals {
      user: User | null;
      session: Session | null;
    }
  }
}