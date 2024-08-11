import type { Request, Response } from "express";
import { db } from "../../lib/db.js";

export const saveTypingTest = async (req: Request, res: Response) => {
  try {

    db.prepare("INSERT INTO TypingTest (user_id, typingMode, typingEndMode, errorCorrectionMode, timeStarted, timeEnded, timeTaken, wpm, accuracy, targetText) VALUES(?,?,?,?,?,?,?,?,?,?)").run(res.locals.user?.id, req.body.typingMode, req.body.typingEndMode, req.body.errorCorrectionMode, req.body.timeStarted, req.body.timeEnded, req.body.timeTaken, req.body.wpm, req.body.accuracy, req.body.targetText);
  }
  catch (e) {
    console.error(e)
    return res.status(400).json({ status: "error", message: "wrong data" })
  }

  return res.status(200).json({ status: "success" })
};

export const saveKeyStatistic = async (req: Request, res: Response) => {
  try {
    const keyStatistics = req.body.keyStatistics;

    db.prepare("UPDATE user SET key_statistics = ? WHERE id = ?")
      .run(JSON.stringify(keyStatistics), res.locals.user?.id);

    return res.status(200).json({ status: "success" });
  }
  catch (e) {
    console.error(e)
    return res.status(500).json({ status: "error", message: "Internal server error" });
  }
}

export const getTypingHistory = async (req: Request, res: Response) => {
  try {
    const typingData = db.prepare("SELECT typingMode, typingEndMode, errorCorrectionMode, timeStarted, timeEnded, timeTaken, wpm, accuracy, targetText FROM TypingTest WHERE user_id = ?").all(res.locals.user?.id);
    return res.status(200).json({ status: "success", typingData: JSON.stringify(typingData) });
  }
  catch (e) {
    console.log(e);
    return res.status(500).json({ status: "error", message: "Internal server error" });
  }
};