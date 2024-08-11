import type { Request, Response } from "express";
import { db } from "../../lib/db.js";

export const saveUserTypingConfig = async (req: Request, res: Response) => {
  try {
    const typingConfig = req.body.userTypingConfig;
    const userId = res.locals.user?.id;
    db.prepare("UPDATE user SET typing_config = ? WHERE id = ?").run(JSON.stringify(typingConfig), userId);

    return res.status(200).json({ status: "success" });
  } catch (e) {
    console.error(e)
    return res.status(500).json({ status: "error", message: "Internal server error" });
  }
};
