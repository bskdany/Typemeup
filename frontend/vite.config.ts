import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig, loadEnv } from 'vite';
import { config } from "dotenv";
import Markdown from 'vite-plugin-md';

config({ path: "../.env" })

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const port_frontend = parseInt(env.VITE_PORT_FRONTEND ?? "") ?? 5173;

  return {
    plugins: [sveltekit(), Markdown()],
    test: {
      include: ['src/**/*.{test,spec}.{js,ts}'],
    },
    server: {
      port: port_frontend,
    },
    assetsInclude: ['**/*.md']
  };
});
