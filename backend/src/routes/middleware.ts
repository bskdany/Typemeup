import { lucia } from "../lib/auth.js";
import { NextFunction, Request, Response } from "express";
import { verifyRequestOrigin } from "lucia";

// manual cors protection
const corsProtection = async (req: Request, res: Response, next: NextFunction) => {
  const originHeader = req.headers.origin ?? null;
  const hostHeader = req.headers.host ?? null;
  if (!originHeader || !hostHeader || !verifyRequestOrigin(originHeader, [hostHeader])) {
    return res.status(403).json({ status: "error", message: "CORS HIT PANIK" });
  }

  return next();
};

// session validation
const validateSession = async (req: Request, res: Response, next: NextFunction) => {
  const sessionId = lucia.readSessionCookie(req.headers.cookie ?? "");
  if (!sessionId) {
    res.locals.user = null;
    res.locals.session = null;
    return next();
  }

  const { session, user } = await lucia.validateSession(sessionId);
  if (!session) {
    const sessionCookie = lucia.createBlankSessionCookie();
    res.append("Set-Cookie", sessionCookie.serialize());
    return next();
  }

  if (session.fresh) {
    const sessionCookie = lucia.createSessionCookie(session.id);
    res.append("Set-Cookie", sessionCookie.serialize());
    return next;
  }

  // Attach the user to the request object for use in subsequent middleware or route handlers
  res.locals.user = user;
  res.locals.session = session;

  next();
}

// authorizing the user
const authorizeSession = async (req: Request, res: Response, next: NextFunction) => {
  const user = res.locals.user;
  if (!user) {
    return res.status(401).json({ status: "error", message: "Unauthorized" });
  }

  next();
}

export {
  corsProtection,
  validateSession,
  authorizeSession
}
