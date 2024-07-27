const env: Config["env"] = process.env.NODE_ENV as Config["env"];
const db_path: string = env === "production" ? "/data/typemeup.sqlite" : "./typemeup_dev.sqlite";
const port_frontend = parseInt(process.env.PORT_FRONTEND ?? "") ?? 5173;
const port_backend = parseInt(process.env.PORT_BACKEND ?? "") ?? 3000;
const frontend_url = env === "production" ? `https://${process.env.URL}` : `http://localhost:${port_frontend}`;

export const config: Config = {
  env: env,
  port_backend: port_backend,
  port_frontend: port_frontend,
  db_path: db_path,
  frontend_url: frontend_url

}

export interface Config {
  env: "production" | "development",
  port_backend: number,
  port_frontend: number
  db_path: string,
  frontend_url: string
}