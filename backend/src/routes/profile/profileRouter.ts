import express from "express";
import { authorizeSession } from "../middleware.js";
import { profileRoute } from "./profile.js";

export const profileRouter = express.Router();
profileRouter.use(authorizeSession);

profileRouter.get('/', profileRoute);