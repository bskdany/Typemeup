import { lucia } from "../lib/auth.js";
import { NextFunction, Request, Response } from "express";

export async function validateSession(req: Request, res: Response, next: NextFunction) {
  const sessionId = lucia.readSessionCookie(req.headers.cookie ?? "");
  if (!sessionId) {
    return res.status(401).json({ status: "error", message: "Unauthorized" });
  }

  try {
    const { session, user } = await lucia.validateSession(sessionId);

    if (!session) {
      const sessionCookie = lucia.createBlankSessionCookie();
      res.setHeader("Set-Cookie", sessionCookie.serialize());
      return res.status(401).json({ status: "error", message: "Unauthorized" });
    }

    if (session.fresh) {
      const sessionCookie = lucia.createSessionCookie(session.id);
      res.setHeader("Set-Cookie", sessionCookie.serialize());
    }

    // Attach the user to the request object for use in subsequent middleware or route handlers
    res.locals.user = user;
    res.locals.session = session;

    next();
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: "error", message: "Internal server error" });
  }
}