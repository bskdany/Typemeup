import { Request, Response } from "express";
import { db } from "../../lib/db.js";
import { defaultUserTypingConfig, generateFingersStatistics } from "../../lib/defaultData.js";

export const getUserDataRoute = async (req: Request, res: Response) => {
  try {
    const userTypingConfigResult = db.prepare("SELECT typing_config FROM user WHERE id = ?").get(res.locals.user?.id) as { typing_config: string };
    const username = res.locals?.user?.username;

    if (username) {
      const fingerMap = JSON.stringify(JSON.parse(userTypingConfigResult.typing_config).smartModeConfig.fingerMap);
      const defaultFingersPosition = JSON.stringify(JSON.parse(userTypingConfigResult.typing_config).smartModeConfig.defaultFingersPosition);

      const fingersStatisticsResult = db.prepare("SELECT fingers_statistics FROM user_fingers_statistics WHERE user_id = ? AND finger_map = ? AND default_fingers_position = ?")
        .get(
          res.locals.user?.id,
          fingerMap,
          defaultFingersPosition
        ) as { fingers_statistics: string };

      return res.status(200).json({
        status: "success",
        username: username,
        userTypingConfig: userTypingConfigResult.typing_config,
        fingersStatistics: fingersStatisticsResult.fingers_statistics
      })
    }

    else {
      return res.status(200).json({
        status: "success",
        username: "",
        userTypingConfig: JSON.stringify(defaultUserTypingConfig),
        fingersStatistics: JSON.stringify(generateFingersStatistics(defaultUserTypingConfig.smartModeConfig.fingerMap))
      })
    }

  }
  catch (e) {
    console.error(e)
    return res.status(500).json({ status: "error", message: "Internal server error" });
  }
};

