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
  const mongoMatch = envContent.match(/MONGODB_URI=(.+)/);
  if (mongoMatch) {
    MONGODB_URI = mongoMatch[1].trim();
  }
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
    }
    
    process.exit(1);
  });
