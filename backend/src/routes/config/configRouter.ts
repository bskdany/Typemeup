import express from "express";
import { authorizeSession } from "../middleware.js";
import { getUserConfigRoute } from "./getUserConfig.js";

export const configRouter = express.Router();
configRouter.use(authorizeSession);

configRouter.get("/getUserConfig", getUserConfigRoute)