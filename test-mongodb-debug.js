/**
 * Test MongoDB connection with debug mode
 * Run: node test-mongodb-debug.js
 * Or: $env:DEBUG="mongoose:*"; node test-mongodb-debug.js
 */

const fs = require('fs');
const path = require('path');

// Enable mongoose debug if not already set
if (!process.env.DEBUG) {
  process.env.DEBUG = 'mongoose:*';
}

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

console.log('🔍 Testing MongoDB connection with DEBUG mode...');
console.log('📍 Connection string:', MONGODB_URI.replace(/\/\/.*@/, '//***:***@'));
console.log('🔧 Debug mode: ENABLED (mongoose:*)\n');
console.log('='.repeat(60));
console.log('Watch for detailed connection logs below:\n');

mongoose.connect(MONGODB_URI, {
  serverSelectionTimeoutMS: 10000,
  socketTimeoutMS: 45000,
})
  .then(() => {
    console.log('\n' + '='.repeat(60));
    console.log('✅ SUCCESS! MongoDB is connected!');
    console.log('✅ Connection state:', mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected');
    console.log('✅ Database name:', mongoose.connection.db.databaseName);
    mongoose.connection.close();
    process.exit(0);
  })
  .catch((error) => {
    console.log('\n' + '='.repeat(60));
    console.error('❌ FAILED! MongoDB connection error:');
    console.error('   Error:', error.message);
    console.error('   Error code:', error.code);
    
    // Detailed analysis
    if (error.message.includes('ECONNREFUSED')) {
      console.log('\n💡 This means MongoDB server is not reachable.');
      console.log('   Check the debug logs above for more details.');
    } else if (error.message.includes('authentication failed')) {
      console.log('\n💡 Authentication failed - check username/password in connection string.');
    } else if (error.message.includes('IP') || error.message.includes('whitelist')) {
      console.log('\n💡 IP not whitelisted - add your IP in MongoDB Atlas Network Access.');
    } else if (error.message.includes('SRV') || error.message.includes('DNS')) {
      console.log('\n💡 SRV/DNS issue - try non-SRV connection string.');
    }
    
    process.exit(1);
  });
