export const config: Config = {
  env: process.env.NODE_ENV as Config["env"] ?? "development",
  port: parseInt(process.env.PORT_BACKEND ?? "") ?? 3000,
  db_name: process.env.DB_NAME ?? "typemeup.sqlite",
  db_path: process.env.PATH_TO_DB ?? "./db.sqlite"
}

export interface Config {
  env: "production" | "development",
  port: number,
  db_path: string,
  db_name: string
}