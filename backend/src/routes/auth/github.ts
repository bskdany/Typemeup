import { OAuth2RequestError, generateState } from "arctic";
import { github, lucia } from "../../lib/auth.js";
import { parseCookies, serializeCookie } from "oslo/cookie"
import { db } from "../../lib/db.js";
import { generateId } from "lucia";
import type { Request, Response } from "express";

import type { DatabaseUser } from "../../lib/db.js";
import { defaultUserTypingConfig, generateKeyStatistic } from "../../lib/defaultData.js";
import { config } from "../../lib/config.js";

export const githubLoginRoute = async (_: Request, res: Response) => {
  const state = generateState();
  const scopes = ["user:email", "repo"];
  const url = github.createAuthorizationURL(state, scopes);
  res
    .appendHeader(
      "Set-Cookie",
      serializeCookie("github_oauth_state", state, {
        path: "/",
        secure: true,
        httpOnly: true,
        maxAge: 60 * 10,
        sameSite: "lax"
      })
    )
    .redirect(url.toString());
};

export const githubLoginCallbackRoute = async (req: Request, res: Response) => {
  const code = req.query.code?.toString() ?? null;
  const state = req.query.state?.toString() ?? null;
  const storedState = parseCookies(req.headers.cookie ?? "").get("github_oauth_state") ?? null;
  if (!code || !state || !storedState || state !== storedState) {
    console.log(code, state, storedState);
    res.status(400).end();
    return;
  }
  try {
    const tokens = await github.validateAuthorizationCode(code);
    const githubUserResponse = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${tokens.accessToken()}`
      }
    });
    const githubUser: GitHubUser = await githubUserResponse.json();
    const existingUser = db.prepare("SELECT * FROM user WHERE github_id = ?").get(githubUser.id) as
      | DatabaseUser
      | undefined;

    console.log(existingUser);
    if (existingUser) {
      const session = await lucia.createSession(existingUser.id, {});
      return res
        .appendHeader("Set-Cookie", lucia.createSessionCookie(session.id).serialize())
        .redirect(config.frontend_url);
    }

    const userId = generateId(15);
    let username = githubUser.login;

    let usernameExists = true;
    let counter = 1;
    while (usernameExists) {
      const existingUsername = db.prepare("SELECT id FROM user WHERE username = ?").get(username);
      if (!existingUsername) {
        usernameExists = false;
      } else {
        username = `${githubUser.login}${counter}`;
        counter++;
      }
    }


    db.prepare("INSERT INTO user (id, username, github_id, typing_config, key_statistics ) VALUES(?, ?, ?, ?, ?)").run(
      userId,
      githubUser.login,
      githubUser.id,
      JSON.stringify(defaultUserTypingConfig),
      JSON.stringify(generateKeyStatistic(defaultUserTypingConfig.smartModeConfig.fingerMap))
    );

    const session = await lucia.createSession(userId, {});
    return res
      .appendHeader("Set-Cookie", lucia.createSessionCookie(session.id).serialize())
      .redirect(config.frontend_url);
  } catch (e) {
    if (e instanceof OAuth2RequestError && e.message === "bad_verification_code") {
      // invalid code
      res.status(400).end();
      return;
    }
    res.status(500).end();
    return;
  }
};

interface GitHubUser {
  id: string;
  login: string;
}
