import path from 'node:path';
import { fileURLToPath } from 'node:url';

console.log("Running app in " + (process.env.NODE_ENV ?? "development") + " environment")
const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const envPath = path.resolve(__dirname, '../../../.env')