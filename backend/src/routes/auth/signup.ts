import { Request, Response } from "express";
import { db } from "../../lib/db.js";
import { hash } from "@node-rs/argon2";
import { lucia } from "../../lib/auth.js";
import { generateId } from "lucia";

export const signupRoute = async (req: Request, res: Response) => {
  const username: string | null = req.body.username ?? null;
  if (!username || username.length < 3 || username.length > 31 || !/^[a-z0-9_-]+$/.test(username)) {
    return res.status(400).json({ status: "error", message: 'Invalid username format' });
  }

  const password: string | null = req.body.password ?? null;
  if (!password || password.length < 6 || password.length > 255) {
    return res.status(400).json({ status: "error", message: 'Invalid password format' });
  }

  // checking if user is already taken
  if (db.prepare("SELECT * FROM user where username = ?").get(username) !== undefined) {
    return res.status(400).json({ status: "error", message: 'Username already in use' });
  }

  const passwordHash = await hash(password, {
    memoryCost: 19456,
    timeCost: 2,
    outputLen: 32,
    parallelism: 1
  });

  const userId = generateId(15);

  try {
    db.prepare("INSERT INTO user (id, username, password) VALUES(?, ?, ?)").run(
      userId,
      username,
      passwordHash
    );

    const session = await lucia.createSession(userId, {});
    res.setHeader("Set-Cookie", lucia.createSessionCookie(session.id).serialize());
    return res.status(200).json({ status: "success", username: username });
  } catch (e) {
    console.error(e)

    return res.status(500).json({ status: "error", message: "Internal server error" });
  }
};
