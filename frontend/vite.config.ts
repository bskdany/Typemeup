import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';
import { config } from "dotenv";

config({ path: "../.env" })

export default defineConfig(({ mode }) => {
  const isDevelopment = mode === 'development';
  const port_frontend = parseInt(process.env.PORT_FRONTEND ?? "") ?? 5173;
  const port_backend = parseInt(process.env.PORT_BACKEND ?? "") ?? 3000;
  const backend_url = isDevelopment ? `http://localhost:${port_backend}/api` : `https://${process.env.BACKEND_URL}/api`;

  return {
    plugins: [sveltekit()],
    test: {
      include: ['src/**/*.{test,spec}.{js,ts}'],
    },
    server: {
      port: port_frontend,
    },
    define: {
      'import.meta.env.BASE_URL': JSON.stringify(backend_url)
    }
  };
});
