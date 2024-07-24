import { Request, Response } from "express";
import { lucia } from "../../lib/auth.js";

export const logoutRoute = async (req: Request, res: Response) => {
  if (!res.locals.session) {
    return res.status(401).json({ status: "error", message: "Unauthorized" });
  }

  await lucia.invalidateSession(res.locals.session.id);
  res.setHeader("Set-Cookie", lucia.createBlankSessionCookie().serialize());
  return res.status(200).json({ status: "success" });
}