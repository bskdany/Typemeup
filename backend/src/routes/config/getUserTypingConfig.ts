import { Request, Response } from "express";
import { db } from "../../lib/db.js";

export const getUserConfigRoute = async (req: Request, res: Response) => {
  try {
    const userTypingConfig = db.prepare("SELECT typing_config FROM user WHERE id = ?").get(res.locals.user?.id);
    const username = res.locals?.user?.username;
    return res.status(200).json({ status: "success", username: username, userTypingConfig: userTypingConfig })
  }
  catch (e) {
    console.error(e)
    return res.status(500).json({ status: "error", message: "Internal server error" });
  }
};

