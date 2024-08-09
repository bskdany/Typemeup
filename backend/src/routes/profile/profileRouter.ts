import express from "express";
import { authorizeSession } from "../middleware.js";
import { getTypingHistory, saveKeyStatistic, saveTypingTest } from "./typing.js";
import { saveUserTypingConfig } from "./saveUserTypingConfig.js";
import { getUserDataRoute } from "./getUserData.js";

export const profileRouter = express.Router();

profileRouter.get("/getUserData", getUserDataRoute);

profileRouter.use(authorizeSession);

profileRouter.get('/getTypingHistory', getTypingHistory);
profileRouter.post("/saveTypingTest", saveTypingTest);
profileRouter.post("/saveKeyStatistic", saveKeyStatistic);
profileRouter.post("/saveUserTypingConfig", saveUserTypingConfig);