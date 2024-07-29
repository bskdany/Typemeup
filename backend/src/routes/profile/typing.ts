import { Request, Response } from "express";
import { db } from "../../lib/db.js";

export const saveTypingTest = async (req: Request, res: Response) => {
  try {

    db.prepare("INSERT INTO TypingTest (user_id, typingMode, errorCorrectionMode, timeStarted, timeEnded, timeTaken, wpm, accuracy, targetText) VALUES(?,?,?,?,?,?,?,?,?)").run(res.locals.user?.id, req.body.typingMode, req.body.errorCorrectionMode, req.body.timeStarted, req.body.timeEnded, req.body.timeTaken, req.body.wpm, req.body.accuracy, req.body.targetText);
  }
  catch (e) {
    console.error(e)
    return res.status(400).json({ status: "error", message: "wrong data" })
  }

  return res.status(200).json({ status: "success" })
};

