/**
 * Script to create the default admin user
 * Run this with: npx tsx backend/scripts/create-default-admin.ts
 */

// Use relative imports for scripts (path aliases may not work in tsx)
import connectDB from '../lib/db';
import User from '../models/User';

const DEFAULT_ADMIN = {
  username: 'adohealthicmr',
  password: 'Welcome@25',
  email: 'admin@adohealthicmr.com',
  role: 'admin' as const,
};

async function createDefaultAdmin() {
  try {
    await connectDB();
    console.log('✅ Connected to database');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ username: DEFAULT_ADMIN.username });
    if (existingAdmin) {
      console.log(`ℹ️  Admin user "${DEFAULT_ADMIN.username}" already exists. Skipping creation.`);
      process.exit(0);
    }

    // Create default admin user
    const admin = await User.create(DEFAULT_ADMIN);

    console.log('✅ Default admin user created successfully!');
    console.log(`   Username: ${admin.username}`);
    console.log(`   Email: ${admin.email}`);
    console.log(`   Role: ${admin.role}`);
    console.log(`   Password: ${DEFAULT_ADMIN.password}`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Failed to create default admin user:', error);
    process.exit(1);
  }
}

createDefaultAdmin();
