import express from "express";
import { authorizeSession } from "../middleware.js";
import { profileRoute } from "./profile.js";
import { saveTypingTest } from "./typing.js";

export const profileRouter = express.Router();
profileRouter.use(authorizeSession);

profileRouter.get('/', profileRoute);
profileRouter.post("/saveTypingTest", saveTypingTest)