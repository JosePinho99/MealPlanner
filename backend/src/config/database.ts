import { Pool } from 'pg';
import * as dotenv from 'dotenv';

dotenv.config();
const connectionString = process.env.DATABASE_URL;
export const pool = new Pool({
    connectionString,
});