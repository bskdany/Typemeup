import express from "express";
import type { User, Session } from "lucia";
import { profileRouter } from "./routes/profile/profileRouter.js";
import { authRouter } from "./routes/auth/authRouter.js";
import { devMode, validateSession } from "./routes/middleware.js";
import { config } from "./lib/config.js";
import cors from 'cors';
import { db } from "./lib/db.js";
import http from 'http';
import { migrateDbSchema } from "./lib/migrateDbSchema.js";

console.log("PROD: " + config.is_prod);
console.log("DOCKER: " + config.is_docker);
console.log("Backend port: " + config.port_backend);
console.log("Db location: " + config.db_path);
console.log("CORS: " + config.use_cors);
console.log("Origin: " + config.frontend_url);

// doing server migration from here for now
// migrateUserTypingConfig(db);
migrateDbSchema(db);

const app = express();
const server = http.createServer(app);

if (config.use_cors)
  app.use(cors({
    origin: config.frontend_url,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  }));
else {
  app.use(cors());
}

app.use(express.json());

if (!config.is_prod) {
  app.use(devMode)
}

app.use(validateSession);

app.use("/api/auth", authRouter);
app.use("/api/profile", profileRouter);

app.get('/api/sitemap.xml', (_, res) => {
  const baseUrl = config.frontend_url;
  const routes = [
    '',
    '/about',
    '/account',
    '/config',
    '/profile'
  ];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${routes.map(route => `
        <url>
          <loc>${baseUrl}${route}</loc>
          <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
          <changefreq>weekly</changefreq>
          <priority>0.8</priority>
        </url>
      `).join('')}
    </urlset>`;

  res.header('Content-Type', 'application/xml');
  res.send(sitemap);
});

server.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});

console.log("Server running on port " + config.port_backend);

declare global {
  namespace Express {
    interface Locals {
      user: User | null;
      session: Session | null;
    }
  }
}
