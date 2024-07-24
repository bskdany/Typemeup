import express from "express";
import { verifyRequestOrigin } from "lucia";
import dotenv from "dotenv";
import { lucia } from "./lib/auth.js";
import type { User, Session } from "lucia";
import { profileRouter } from "./routes/profile/profileRouter.js";
import { authRouter } from "./routes/auth/authRouter.js";

dotenv.config();
const app = express();
app.use(express.urlencoded());

// manual cors protection
app.use((req, res, next) => {
  if (process.env.NODE_ENV === "production") {
    const originHeader = req.headers.origin ?? null;
    const hostHeader = req.headers.host ?? null;
    if (!originHeader || !hostHeader || !verifyRequestOrigin(originHeader, [hostHeader])) {
      return res.status(403).json({ status: "error", message: "Cors babyyyy" });
    }
  }
  return next();
});

app.use(async (req, res, next) => {
  const sessionId = lucia.readSessionCookie(req.headers.cookie ?? "");
  if (!sessionId) {
    res.locals.user = null;
    res.locals.session = null;
    return next();
  }

  const { session, user } = await lucia.validateSession(sessionId);
  if (session && session.fresh) {
    res.appendHeader("Set-Cookie", lucia.createSessionCookie(session.id).serialize());
  }
  if (!session) {
    res.appendHeader("Set-Cookie", lucia.createBlankSessionCookie().serialize());
  }
  res.locals.session = session;
  res.locals.user = user;
  return next();
});

app.use("/api/auth", authRouter);
app.use("/api/profile", profileRouter);

app.listen(process.env.PORT);

console.log("Server running on port " + process.env.PORT);

declare global {
  namespace Express {
    interface Locals {
      user: User | null;
      session: Session | null;
    }
  }
}