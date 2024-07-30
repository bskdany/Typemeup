import express from "express";
import { authorizeSession } from "../middleware.js";
import { getUserConfigRoute } from "./getUserTypingConfig.js";
import { saveUserTypingConfig } from "./saveUserTypingConfig.js";

export const configRouter = express.Router();
configRouter.use(authorizeSession);

configRouter.get("/getUserTypingConfig", getUserConfigRoute);
configRouter.post("/saveUserTypingConfig", saveUserTypingConfig);