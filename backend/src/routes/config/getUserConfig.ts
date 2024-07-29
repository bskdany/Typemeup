import express, { Request, Response } from "express";
import { db } from "../../lib/db.js";
import { verify } from "@node-rs/argon2";
import { lucia } from "../../lib/auth.js";

import type { DatabaseUser } from "../../lib/db.js";

export const getUserConfigRoute = async (req: Request, res: Response) => {
  const username = res.locals?.user?.username;

  return res.status(200).json({ status: "success", username: username })
};

