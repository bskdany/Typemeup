const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    user: process.env.USERNAME,
    password: process.env.PASSWORD,
    host: 'localhost',
    database: 'typemeup',
    port: 5432
});

export const query = (text :string, params :string[] = []) => {
    const start = Date.now();
    const res = pool.query(text, params);
    const duration = Date.now() - start;
    console.log(`Executed query ${text} duration: ${duration} rows: ${res.rowCount}`)
    return res;
}


