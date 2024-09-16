import { Lucia } from "lucia";
import { BetterSqlite3Adapter } from "@lucia-auth/adapter-sqlite";
import { db } from "./db.js";
import type { DatabaseUser } from "./db.js";
import { GitHub, Google } from "arctic";
import { config } from "./config.js";

const adapter = new BetterSqlite3Adapter(db, {
  user: "user",
  session: "session"
});

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    attributes: {
      secure: process.env.NODE_ENV === "production"
    }
  },
  getUserAttributes: (attributes) => {
    return {
      username: attributes.username,
      githubId: attributes.github_id,
    };
  }
});

export const github = new GitHub(config.githubCLientId, config.githubClientSecret, config.backendUrl + "/auth/github/login/callback");
export const google = new Google(config.googleClientId, config.googleClientSecret, config.backendUrl + "/auth/google/login/callback");
declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: Omit<DatabaseUser, "id">;
  }
}
