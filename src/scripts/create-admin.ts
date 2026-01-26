/**
 * Script to create an admin user
 * Run this with: npx tsx src/scripts/create-admin.ts
 * Or: ts-node src/scripts/create-admin.ts
 */

import readline from 'readline';
import connectDB from '../lib/db';
import User from '../models/User';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(query: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(query, resolve);
  });
}

async function createAdmin() {
  try {
    await connectDB();
    console.log('✅ Connected to database');

    const username = await question('Enter username: ');
    const password = await question('Enter password: ');
    const email = await question('Enter email (optional): ');

    if (!username || !password) {
      console.error('❌ Username and password are required');
      process.exit(1);
    }

    // Check if user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      console.error(`❌ User with username "${username}" already exists`);
      process.exit(1);
    }

    // Create admin user
    const admin = await User.create({
      username,
      password,
      email: email || undefined,
      role: 'admin',
    });

    console.log('✅ Admin user created successfully!');
    console.log(`   Username: ${admin.username}`);
    console.log(`   Email: ${admin.email || 'N/A'}`);
    console.log(`   Role: ${admin.role}`);
    
    rl.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Failed to create admin user:', error);
    rl.close();
    process.exit(1);
  }
}

createAdmin();
