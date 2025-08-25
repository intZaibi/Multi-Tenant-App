import mysql from 'mysql2/promise';
import "dotenv/config";

const dbConfig = {
  host: process.env.DB_HOST || '127.0.0.1',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'abcd',
  database: process.env.DB_NAME || 'multi_tenant_saas',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

// Create connection pool
const db = mysql.createPool(dbConfig);

// Test database connection
export const testConnection = async () => {
  try {
    await db.query('SELECT 1');
    console.log('✅ Database connected successfully');
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    return false;
  }
};

export default db;