/**
 * Quick script to test MongoDB connection
 * Run: node test-db-connection.js
 * 
 * Note: This script reads .env.local manually since we don't use dotenv
 */

const fs = require('fs');
const path = require('path');

// Read .env.local manually
const envPath = path.join(__dirname, '.env.local');
let MONGODB_URI = 'mongodb://localhost:27017/adohealthicmr';

if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  // Find the first uncommented MONGODB_URI line
  const lines = envContent.split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    // Skip commented lines and empty lines
    if (trimmed && !trimmed.startsWith('#') && trimmed.startsWith('MONGODB_URI=')) {
      const mongoMatch = trimmed.match(/MONGODB_URI=(.+)/);
      if (mongoMatch) {
        MONGODB_URI = mongoMatch[1].trim();
        break; // Use the first uncommented line
      }
    }
  }
}

// Check for placeholder values
if (MONGODB_URI.includes('xxxxx') || MONGODB_URI.includes('<username>') || MONGODB_URI.includes('<password>') || MONGODB_URI.includes('<dbname>')) {
  console.error('❌ ERROR: Connection string contains placeholder values!');
  console.error('📍 Current connection string:', MONGODB_URI.replace(/\/\/.*@/, '//***:***@'));
  console.error('\n💡 SOLUTION:');
  console.error('   Your MONGODB_URI in .env.local has placeholder values (xxxxx, <username>, etc.)');
  console.error('   You need to replace them with your actual MongoDB Atlas credentials.\n');
  console.error('   Steps to get your connection string:');
  console.error('   1. Go to https://cloud.mongodb.com/');
  console.error('   2. Login to MongoDB Atlas');
  console.error('   3. Go to Clusters → Click "Connect" on your cluster');
  console.error('   4. Choose "Connect your application"');
  console.error('   5. Copy the connection string');
  console.error('   6. Replace <password> with your database password');
  console.error('   7. Replace <dbname> with "adohealthicmr" (or your database name)');
  console.error('   8. Update .env.local with the complete connection string\n');
  console.error('   Or run: npm run setup-mongodb\n');
  process.exit(1);
}

const mongoose = require('mongoose');

console.log('🔍 Testing MongoDB connection...');
console.log('📍 Connection string:', MONGODB_URI.replace(/\/\/.*@/, '//***:***@')); // Hide password

mongoose.connect(MONGODB_URI, {
  serverSelectionTimeoutMS: 5000,
})
  .then(() => {
    console.log('✅ SUCCESS! MongoDB is connected!');
    console.log('✅ You can now run: npm run create-default-admin');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ FAILED! MongoDB connection error:');
    console.error('   Error:', error.message);
    
    if (error.message.includes('ECONNREFUSED')) {
      console.log('\n💡 SOLUTION:');
      console.log('   MongoDB is not running. You have two options:');
      console.log('   1. Use MongoDB Atlas (cloud) - See FIX_MONGODB_NOW.md');
      console.log('   2. Install and start local MongoDB');
      console.log('      Download: https://www.mongodb.com/try/download/community');
      console.log('      Then run: Start-Service MongoDB');
    } else if (error.message.includes('authentication failed')) {
      console.log('\n💡 SOLUTION:');
      console.log('   Wrong username or password in connection string.');
      console.log('   Check your .env.local MONGODB_URI');
    } else if (error.message.includes('IP')) {
      console.log('\n💡 SOLUTION:');
      console.log('   Your IP is not whitelisted in MongoDB Atlas.');
      console.log('   Go to Network Access → Add IP Address → Allow from anywhere');
    } else if (error.message.includes('ENOTFOUND') || error.message.includes('querySrv')) {
      console.log('\n💡 SOLUTION:');
      console.log('   DNS/SRV lookup failed. Possible causes:');
      console.log('   1. Connection string has placeholder values (xxxxx, cluster0.xxxxx)');
      console.log('   2. Network/firewall blocking SRV queries');
      console.log('   3. Invalid cluster address\n');
      console.log('   Fix options:');
      console.log('   Option A: Get correct connection string from MongoDB Atlas');
      console.log('      - Go to Clusters → Connect → Connect your application');
      console.log('      - Copy the connection string (should NOT have xxxxx)');
      console.log('      - Replace <password> and <dbname> with actual values');
      console.log('      - Update .env.local\n');
      console.log('   Option B: Use non-SRV connection (if SRV fails)');
      console.log('      - Go to Clusters → Connect → Drivers');
      console.log('      - Choose "Standard connection string" (not SRV)');
      console.log('      - Copy and use that instead\n');
      console.log('   Run: npm run setup-mongodb (for interactive setup)');
    }
    
    process.exit(1);
  });
