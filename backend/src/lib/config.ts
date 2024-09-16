export const isProd = process.env.NODE_ENV === "production";
export const isDocker = process.env.IS_DOCKER === "true";
const db_path: string = isDocker ? "/data/typemeup_prod.sqlite" : "./typemeup_dev.sqlite";
const port_backend = parseInt(process.env.PORT_BACKEND ?? "3000") ?? 3000;
const frontend_url = process.env.URL_FRONTEND ?? 'http://localhost:5173';
const backendUrl = process.env.VITE_URL_BACKEND ?? 'http://localhost:5173';

export const config: Config = {
  is_prod: isProd,
  is_docker: isDocker,
  port_backend: port_backend,
  db_path: db_path,
  frontend_url: frontend_url,
  use_cors: process.env.USE_CORS ? true : false,
  githubCLientId: process.env.GITHUB_CLIENT_ID || "",
  githubClientSecret: process.env.GITHUB_CLIENT_SECRET || "",
  googleClientId: process.env.GOOGLE_CLIENT_ID || "",
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
  backendUrl: backendUrl
}

export interface Config {
  is_prod: boolean,
  is_docker: boolean,
  port_backend: number,
  db_path: string,
  frontend_url: string,
  use_cors: boolean,
  githubCLientId: string,
  githubClientSecret: string,
  googleClientId: string,
  googleClientSecret: string
  backendUrl: string
}
