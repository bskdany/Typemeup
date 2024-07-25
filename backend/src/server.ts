import express from "express";
import type { User, Session } from "lucia";
import { profileRouter } from "./routes/profile/profileRouter.js";
import { authRouter } from "./routes/auth/authRouter.js";
import { corsProtection, validateSession } from "./routes/middleware.js";
import { config } from "./lib/config.js";

const app = express();
app.use(express.urlencoded());

if (config.env === "production") {
  app.use(corsProtection);
}
app.use(validateSession);

app.use("/api/auth", authRouter);
app.use("/api/profile", profileRouter);

app.listen(config.port);

console.log("Server running on port " + config.port);

declare global {
  namespace Express {
    interface Locals {
      user: User | null;
      session: Session | null;
    }
  }
}