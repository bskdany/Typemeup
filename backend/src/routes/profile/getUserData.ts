import { Request, Response } from "express";
import { db } from "../../lib/db.js";
import { defaultUserTypingConfig, generateKeyStatistic } from "../../lib/defaultData.js";

export const getUserDataRoute = async (req: Request, res: Response) => {
  try {
    const username = res.locals?.user?.username;

    if (username) {
      const userResult = db.prepare("SELECT typing_config, key_statistics FROM user WHERE id = ?").get(res.locals.user?.id) as { typing_config: string, key_statistics: string };

      return res.status(200).json({
        status: "success",
        username: username,
        userTypingConfig: userResult.typing_config,
        keyStatistics: userResult.key_statistics
      })
    }

    else {
      return res.status(200).json({
        status: "success",
        username: "",
        userTypingConfig: JSON.stringify(defaultUserTypingConfig),
        keyStatistics: JSON.stringify(generateKeyStatistic(defaultUserTypingConfig.smartModeConfig.fingerMap))
      })
    }

  }
  catch (e) {
    console.error(e)
    return res.status(500).json({ status: "error", message: "Internal server error" });
  }
};

