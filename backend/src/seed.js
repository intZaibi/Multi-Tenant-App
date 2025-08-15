import bcrypt from 'bcrypt';
import db, { testConnection } from './config/db.js';

export const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...');

    // Test connection
    if (!(await testConnection())) return false;

    // Check if Super Admin already exists
    const [existingSuperAdmin] = await db.execute(
      'SELECT user_id FROM users WHERE role = "Super Admin"'
    );

    if (existingSuperAdmin.length > 0) {
      console.log('✅ Super Admin already exists, skipping creation');
    } else {
      // Create Super Admin user
      const hashedPassword = await bcrypt.hash('superadmin123', 12);
      
      await db.execute(
        'INSERT INTO users (email, password, first_name, last_name, role) VALUES (?, ?, ?, ?, ?)',
        ['superadmin@example.com', hashedPassword, 'Super', 'Admin', 'Super Admin']
      );

      console.log('✅ Super Admin created successfully');
      console.log('📧 Email: superadmin@example.com');
      console.log('🔑 Password: superadmin123');
    }
    
    // Create sample tenant
    const [existingTenant] = await db.execute(
      'SELECT id FROM tenants WHERE name = "Sample Organization"'
    );

    if (existingTenant.length === 0) {
      await db.execute(
        'INSERT INTO tenants (name, subdomain) VALUES (?, ?)',
        ['Sample Organization', 'sample']
      );
    } else {
      console.log('✅ Sample tenant already exists, skipping creation');
    }

      const [rows] = await db.query(`SELECT * FROM users`);
      if (!(rows.length > 1)) {  // because one user i.e Super Admin is already created

      // Create sample users for the tenant
      const sampleUsers = [
        {
          email: 'admin@sample.com',
          password: 'admin123',
          first_name: 'John',
          last_name: 'Admin',
          tenant_id: 1,
          role: 'Admin'
        },
        {
          email: 'manager@sample.com',
          password: 'manager123',
          first_name: 'Jane',
          last_name: 'Manager',
          tenant_id: 1,
          role: 'Manager'
        },
        {
          email: 'user@sample.com',
          password: 'user123',
          first_name: 'Bob',
          last_name: 'User',
          tenant_id: 1,
          role: 'User'
        }
      ];

      for (const user of sampleUsers) {
        const hashedPassword = await bcrypt.hash(user.password, 12);
        
        await db.execute(
          'INSERT INTO users (email, password, first_name, last_name, role, tenant_id) VALUES (?, ?, ?, ?, ?, ?)',
          [user.email, hashedPassword, user.first_name, user.last_name, user.role, 1]
        );

        console.log(`✅ Created ${user.role}: ${user.email} (Password: ${user.password})`);
      }
    } else {
      console.log('✅ Sample users already exist, skipping creation');
    }
      
    const [existingNotifications] = await db.execute(
      `SELECT * FROM notifications WHERE user_id = ?`,
      [2]
    );

    if (existingNotifications.length > 0) {
      console.log('✅ Sample notifications already exist, skipping creation');
    } else {
      // Create sample notifications
      const sampleNotifications = [
        {
          title: 'Welcome to the Platform',
          message: 'Welcome to the platform! This is your first notification.',
          type: 'info'
        },
        {
          title: 'Account Activated',
          message: 'Your account has been successfully activated.',
          type: 'success'
        },
        {
          title: 'Profile Completion Required',
          message: 'Please complete your profile information.',
          type: 'warning'
        },
        {
          title: 'System Maintenance',
          message: 'Scheduled maintenance will occur tonight from 2-4 AM.',
          type: 'warning'
        },
        {
          title: 'New Features Available',
          message: 'Check out the new dashboard features we\'ve added!',
          type: 'info'
        }
      ];

      // Get user IDs for the tenant
      // Get users for the tenant who do NOT already have notifications
      const [users] = await db.execute(
        `SELECT u.user_id 
         FROM users u
         WHERE u.tenant_id = ? 
           AND NOT EXISTS (
             SELECT * FROM notifications n WHERE n.user_id = u.user_id
           )`,
        [1]
      );

      // Create notifications for each user
      for (const user of users) {
        for (const notification of sampleNotifications) {
          await db.execute(
            'INSERT INTO notifications (user_id, title, message, type) VALUES (?, ?, ?, ?)',
            [user.user_id, notification.title, notification.message, notification.type]
          );
        }
      }
      console.log('✅ Sample notifications created');
    }

    
    console.log('🎉 Database seeding/setup completed successfully!');

    return true;

  } catch (error) {
    console.error('❌ Database seeding failed:', error);
    return false;
  }
};










