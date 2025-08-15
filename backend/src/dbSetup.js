import connection, { testConnection } from './config/db.js';
import { seedDatabase } from './seed.js';

export async function setupDatabase() {

  if (!(await testConnection())) {
    console.error('❌ Database connection failed, skipping database setup');
    return;
  }

  try {

    console.log('🔧 Setting up database...');

    // Create database if it doesn't exist
    await connection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME || 'multi_tenant_saas'}`);
    console.log(`✅ Database '${process.env.DB_NAME || 'multi_tenant_saas'}' created/verified`);

    // Use the database
    await connection.query(`USE ${process.env.DB_NAME || 'multi_tenant_saas'}`);

    // Create tables one by one
    const createTenantsTableSQL = `
      CREATE TABLE IF NOT EXISTS tenants (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        subdomain VARCHAR(255) NOT NULL UNIQUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      );
    `;

    const createUsersTableSQL = `
      CREATE TABLE IF NOT EXISTS users (
        user_id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100),
        tenant_id INT,
        role ENUM('Super Admin', 'Admin', 'Manager', 'User') NOT NULL DEFAULT 'User',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE SET NULL
      );
    `;

    const createNotificationsTableSQL = `
      CREATE TABLE IF NOT EXISTS notifications (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        title VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        type ENUM('info', 'success', 'warning', 'error') DEFAULT 'info',
        is_read BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
      );
    `;

    const createUserSessionsTableSQL = `
      CREATE TABLE IF NOT EXISTS user_sessions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        refresh_token VARCHAR(500) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
      );
    `;

    await connection.execute(createTenantsTableSQL);
    await connection.execute(createUsersTableSQL);
    await connection.execute(createNotificationsTableSQL);
    await connection.execute(createUserSessionsTableSQL);
    console.log('✅ Tables created/verified successfully');

    // Create indexes separately, check existence and create one by one
    const indexes = [
      {
        name: 'idx_users_email',
        table: 'users',
        column: 'email'
      },
      {
        name: 'idx_users_tenant_id',
        table: 'users',
        column: 'tenant_id'
      },
      {
        name: 'idx_users_role',
        table: 'users',
        column: 'role'
      },
      {
        name: 'idx_notifications_user_id',
        table: 'notifications',
        column: 'user_id'
      },
      {
        name: 'idx_notifications_is_read',
        table: 'notifications',
        column: 'is_read'
      },
      {
        name: 'idx_user_sessions_user_id',
        table: 'user_sessions',
        column: 'user_id'
      },
      {
        name: 'idx_user_sessions_refresh_token',
        table: 'user_sessions',
        column: 'refresh_token'
      }
    ];

    for (const idx of indexes) {
      // Check if index exists
      const [rows] = await connection.query(
        `SHOW INDEX FROM \`${idx.table}\` WHERE Key_name = ?`, [idx.name]
      );
      if (!rows || rows.length === 0) {
        // Create index if it does not exist
        await connection.query(
          `CREATE INDEX \`${idx.name}\` ON \`${idx.table}\`(\`${idx.column}\`)`
        );
      }
    }
    console.log('✅ Indexes created/verified successfully');

    if (!(await seedDatabase())) {
      console.error('❌ Database seeding failed, skipping seeding');
      return ;
    }

  } catch (error) {
    console.error('❌ Database setup failed:', error.message);
    throw new Error(error.message);
  }
}

