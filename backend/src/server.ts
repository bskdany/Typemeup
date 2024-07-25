import express from "express";
import type { User, Session } from "lucia";
import { profileRouter } from "./routes/profile/profileRouter.js";
import { authRouter } from "./routes/auth/authRouter.js";
import dotenv from "dotenv";
import { corsProtection, validateSession } from "./routes/middleware.js";
import { envPath } from "./lib/envPath.js";

dotenv.config({ path: envPath });
const app = express();
app.use(express.urlencoded());

if (process.env.NODE_ENV === "production") {
  app.use(corsProtection);
}
app.use(validateSession);

app.use("/api/auth", authRouter);
app.use("/api/profile", profileRouter);

app.listen(process.env.PORT_BACKEND);

console.log("Server running on port " + process.env.PORT_BACKEND);

declare global {
  namespace Express {
    interface Locals {
      user: User | null;
      session: Session | null;
    }
  }
}