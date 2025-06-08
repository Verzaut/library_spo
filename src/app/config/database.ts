import * as dotenv from 'dotenv';
import { join } from 'path';
import { Pool } from 'pg';

// Загружаем .env файл из корневой директории проекта
dotenv.config({ path: join(process.cwd(), '.env') });

const dbConfig = {
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: 'library_db',
  password: process.env.DB_PASSWORD || 'postgres',
  port: parseInt(process.env.DB_PORT || '5432'),
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
};

console.log('Database configuration:', {
  ...dbConfig,
  password: dbConfig.password ? '****' : 'not set'
});

const pool = new Pool(dbConfig);

export default pool; 