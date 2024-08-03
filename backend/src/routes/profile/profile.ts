import { Request, Response } from "express";
import { db } from "../../lib/db.js";

export const profileRoute = async (req: Request, res: Response) => {
  try {
    const typingData = db.prepare("SELECT typingMode, typingEndMode, errorCorrectionMode, timeStarted, timeEnded, timeTaken, wpm, accuracy, targetText FROM TypingTest WHERE user_id = ?").all(res.locals.user?.id);
    return res.status(200).json({ status: "success", typingData: JSON.stringify(typingData) })
  }
  catch (e) {
    console.log(e);
    return res.status(500).json({ status: "error", message: "Internal server error" })
  }
};

