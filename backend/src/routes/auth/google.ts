import { OAuth2RequestError, generateState, generateCodeVerifier, decodeIdToken } from "arctic";
import { google, lucia } from "../../lib/auth.js";
import { parseCookies, serializeCookie } from "oslo/cookie"
import { db } from "../../lib/db.js";
import { generateId } from "lucia";
import type { Request, Response } from "express";
import type { DatabaseUser } from "../../lib/db.js";
import { defaultUserTypingConfig, generateKeyStatistic } from "@shared/defaultData.js";
import { config } from "../../lib/config.js";

interface GoogleUser {
  id: string;
  login: string;
}

export const googleLoginRoute = async (_: Request, res: Response) => {
  const state = generateState();
  const codeVerifier = generateCodeVerifier();
  const scopes = ["openid", "profile"];
  const url = google.createAuthorizationURL(state, codeVerifier, scopes);

  res
    .appendHeader(
      "Set-Cookie",
      serializeCookie("state", state, {
        path: "/",
        secure: true,
        httpOnly: true,
        maxAge: 60 * 10,
        sameSite: "lax"
      })
    )
    .appendHeader(
      "Set-Cookie",
      serializeCookie("codeVerifier", codeVerifier, {
        path: "/",
        secure: true,
        httpOnly: true,
        maxAge: 60 * 10,
        sameSite: "lax"
      })
    )
    .redirect(url.toString());
};

export const googleLoginCallbackRoute = async (req: Request, res: Response) => {
  const code = req.query.code?.toString();
  const state = req.query.state?.toString();

  const storedState = parseCookies(req.headers.cookie ?? "").get("state");
  const codeVerifier = parseCookies(req.headers.cookie ?? "").get("codeVerifier") ?? "";

  if (!code || !state || !storedState || state !== storedState) {
    console.log(code, state, storedState);
    res.status(400).end();
    return;
  }

  try {
    const tokens = await google.validateAuthorizationCode(code, codeVerifier);
    const accessToken = tokens.accessToken();
    const accessTokenExpiresAt = tokens.accessTokenExpiresAt();

    const googleData: any = decodeIdToken(tokens.idToken());
    const googleName = googleData["given_name"];
    const googleId = googleData["sub"];

    const existingUser = db.prepare("SELECT * FROM user WHERE google_id = ?").get(googleId) as
      | DatabaseUser
      | undefined;

    if (existingUser) {
      console.log(`User with username ${existingUser} already exists`)
      const session = await lucia.createSession(existingUser.id, {});
      return res
        .appendHeader("Set-Cookie", lucia.createSessionCookie(session.id).serialize())
        .redirect(config.frontend_url);
    }

    const userId = generateId(15);

    let usernameExists = true;
    let counter = 1;
    let username = googleName;
    while (usernameExists) {
      const existingUsername = db.prepare("SELECT id FROM user WHERE username = ?").get(username);
      if (!existingUsername) {
        usernameExists = false;
      } else {
        username = `${username}${counter}`;
        counter++;
      }
    }

    db.prepare("INSERT INTO user (id, username, google_id, typing_config, key_statistics ) VALUES(?, ?, ?, ?, ?)").run(
      userId,
      username,
      googleId,
      JSON.stringify(defaultUserTypingConfig),
      JSON.stringify(generateKeyStatistic(defaultUserTypingConfig.smartModeConfig.fingerMap))
    );

    const session = await lucia.createSession(userId, {});
    console.log(`Created google user with username: ${username}`)
    return res
      .appendHeader("Set-Cookie", lucia.createSessionCookie(session.id).serialize())
      .redirect(config.frontend_url);
  } catch (e) {
    console.log(`Internal server error: ${e}`)

    if (e instanceof OAuth2RequestError && e.message === "bad_verification_code") {
      // invalid code
      res.status(400).end();
      return;
    }
    res.status(500).end();
    return;
  }
};

