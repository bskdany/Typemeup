import express from "express";
import { validateSession } from "../authMiddleware.js";
import { profileRoute } from "./profile.js";

export const profileRouter = express.Router();
profileRouter.use(validateSession);

profileRouter.post('/', profileRoute);