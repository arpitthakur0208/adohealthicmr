import { Pool } from 'pg';

const connectionString = process.env.DATABASE_URL || process.env.PG_CONNECTION || '';
const pool = new Pool({ connectionString });

export async function query(text: string, params?: any[]) {
  return pool.query(text, params);
}

export function getPool() {
  return pool;
}

export async function close() {
  await pool.end();
}
