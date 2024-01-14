const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST_ADDR,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
});

export const query = (text :string, params :string[] = []) => {
    const start = Date.now();
    const res = pool.query(text, params);
    const duration = Date.now() - start;
    console.log(`Executed query ${text} duration: ${duration} rows: ${res.rowCount}`)
    return res;
}


