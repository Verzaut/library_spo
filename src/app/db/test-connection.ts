import 'dotenv/config';
import pool from '../config/database';

async function testConnection() {
  try {
    // Проверяем наличие переменных окружения
    console.log('Checking environment variables...');
    console.log('DB_USER:', process.env.DB_USER ? 'Set' : 'Not set');
    console.log('DB_PASSWORD:', process.env.DB_PASSWORD ? 'Set' : 'Not set');
    console.log('DB_HOST:', process.env.DB_HOST || 'localhost');
    console.log('DB_PORT:', process.env.DB_PORT || '5432');
    
    console.log('\nTrying to connect to PostgreSQL...');
    const client = await pool.connect();
    console.log('Successfully connected to PostgreSQL');
    
    // Проверяем существование базы данных
    const dbResult = await client.query(
      "SELECT datname FROM pg_database WHERE datname = 'library_db'"
    );
    
    if (dbResult.rows.length === 0) {
      console.log('Warning: Database "library_db" does not exist');
    } else {
      console.log('Database "library_db" exists');
      
      // Проверяем существование таблицы users
      const tableResult = await client.query(
        "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'users'"
      );
      
      if (tableResult.rows.length === 0) {
        console.log('Warning: Table "users" does not exist');
      } else {
        console.log('Table "users" exists');
      }
    }
    
    client.release();
  } catch (err) {
    console.error('Database connection error:', err);
    if (err instanceof Error) {
      console.error('Error details:', {
        message: err.message,
        stack: err.stack
      });
    }
  } finally {
    // Закрываем пул соединений
    await pool.end();
  }
}

testConnection(); 