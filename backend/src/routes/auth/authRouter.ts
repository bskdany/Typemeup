import express from "express";
import { loginRoute } from "./login.js";
import { signupRoute } from "./signup.js";
import { logoutRoute } from "./logout.js";

export const authRouter = express.Router();

authRouter.post("/login", loginRoute);
authRouter.post("/signup", signupRoute);
authRouter.post("/logout", logoutRoute);