import express, { Request, Response } from "express";
import { db } from "../../lib/db.js";
import { verify } from "@node-rs/argon2";
import { lucia } from "../../lib/auth.js";

import type { DatabaseUser } from "../../lib/db.js";

export const profileRoute = async (req: Request, res: Response) => {
  return res.status(200).json({ status: "success", message: "your're in" })
  // const username: string | null = req.body.username ?? null;
  // if (!username || username.length < 3 || username.length > 31 || !/^[a-z0-9_-]+$/.test(username)) {
  //   return res.status(400).json({ status: "error", message: 'Invalid credentials' });
  // }
  // const password: string | null = req.body.password ?? null;
  // if (!password || password.length < 6 || password.length > 255) {
  //   return res.status(400).json({ status: "error", message: 'Invalid credentials' });
  // }

  // const existingUser = db.prepare("SELECT * FROM user WHERE username = ?").get(username) as
  //   | DatabaseUser
  //   | undefined;
  // if (!existingUser) {
  //   return res.status(400).json({ status: "error", message: 'Invalid credentials' });
  // }

  // const validPassword = await verify(existingUser.password, password, {
  //   memoryCost: 19456,
  //   timeCost: 2,
  //   outputLen: 32,
  //   parallelism: 1
  // });
  // if (!validPassword) {
  //   return res.status(400).json({ status: "error", message: 'Invalid credentials' });
  // }

  // const session = await lucia.createSession(existingUser.id, {});
  // res.setHeader("Set-Cookie", lucia.createSessionCookie(session.id).serialize());
  // return res.status(200).json({ status: "success" })
};

