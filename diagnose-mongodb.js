/**
 * MongoDB Connection Diagnostic Script
 * Follows the steps from the troubleshooting guide
 * Run: node diagnose-mongodb.js
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔍 MongoDB Connection Diagnostic Tool\n');
console.log('='.repeat(60));

// STEP 1: Check .env.local file
console.log('\n✅ STEP 1: Checking .env.local file...');
const envPath = path.join(__dirname, '.env.local');
let MONGODB_URI = null;

if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  const mongoMatch = envContent.match(/MONGODB_URI=(.+)/);
  if (mongoMatch) {
    MONGODB_URI = mongoMatch[1].trim();
    const hiddenUri = MONGODB_URI.replace(/\/\/([^:]+):([^@]+)@/, '//$1:***@');
    console.log('   Found MONGODB_URI:', hiddenUri);
    
    // Check if it's SRV or non-SRV
    if (MONGODB_URI.includes('mongodb+srv://')) {
      console.log('   ⚠️  Using SRV connection (mongodb+srv://)');
      console.log('   💡 If connection fails, try non-SRV connection string');
    } else if (MONGODB_URI.includes('mongodb://')) {
      console.log('   ✅ Using standard connection (mongodb://)');
    }
  } else {
    console.log('   ❌ MONGODB_URI not found in .env.local');
  }
} else {
  console.log('   ❌ .env.local file not found');
}

// STEP 2: Test connection with mongoose
console.log('\n✅ STEP 2: Testing MongoDB connection...');
if (!MONGODB_URI) {
  console.log('   ❌ Cannot test - MONGODB_URI not found');
  process.exit(1);
}

const mongoose = require('mongoose');

// Extract host for testing
let testHost = 'localhost';
if (MONGODB_URI.includes('mongodb+srv://')) {
  const match = MONGODB_URI.match(/mongodb\+srv:\/\/(?:[^:]+:[^@]+@)?([^/]+)/);
  if (match) {
    testHost = match[1];
  }
} else if (MONGODB_URI.includes('mongodb://')) {
  const match = MONGODB_URI.match(/mongodb:\/\/(?:[^:]+:[^@]+@)?([^:/]+)/);
  if (match) {
    testHost = match[1];
  }
}

console.log(`   Testing connection to: ${testHost}`);

mongoose.connect(MONGODB_URI, {
  serverSelectionTimeoutMS: 10000,
})
  .then(() => {
    console.log('   ✅ SUCCESS! MongoDB is connected!');
    console.log('   ✅ Connection state:', mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected');
    mongoose.connection.close();
    process.exit(0);
  })
  .catch((error) => {
    console.log('   ❌ FAILED! MongoDB connection error:');
    console.log('   Error:', error.message);
    
    // Detailed error analysis
    if (error.message.includes('ECONNREFUSED')) {
      console.log('\n   💡 DIAGNOSIS: Connection refused');
      if (testHost === 'localhost' || testHost === '127.0.0.1') {
        console.log('   → Local MongoDB is not running');
        console.log('   → Solution: Start MongoDB service or use MongoDB Atlas');
      } else {
        console.log('   → Cannot reach MongoDB server');
        console.log('   → Possible causes:');
        console.log('     1. Firewall blocking connection');
        console.log('     2. IP not whitelisted in MongoDB Atlas');
        console.log('     3. Network/DNS issue');
      }
    } else if (error.message.includes('authentication failed') || error.message.includes('bad auth')) {
      console.log('\n   💡 DIAGNOSIS: Authentication failed');
      console.log('   → Wrong username or password');
      console.log('   → Check your MongoDB Atlas credentials');
    } else if (error.message.includes('IP') || error.message.includes('whitelist')) {
      console.log('\n   💡 DIAGNOSIS: IP not whitelisted');
      console.log('   → Your IP is not allowed in MongoDB Atlas');
      console.log('   → Solution: MongoDB Atlas → Network Access → Add IP Address');
    } else if (error.message.includes('SRV') || error.message.includes('DNS')) {
      console.log('\n   💡 DIAGNOSIS: SRV/DNS issue');
      console.log('   → Your hosting may not support mongodb+srv://');
      console.log('   → Solution: Use non-SRV connection string from MongoDB Atlas');
      console.log('   → Get it from: MongoDB Atlas → Connect → Drivers → "Standard connection string"');
    } else if (error.message.includes('timeout')) {
      console.log('\n   💡 DIAGNOSIS: Connection timeout');
      console.log('   → Server is not reachable or blocked');
      console.log('   → Check firewall and network settings');
    }
    
    console.log('\n✅ STEP 3: Recommended Actions:');
    console.log('   1. If using MongoDB Atlas:');
    console.log('      - Verify credentials in connection string');
    console.log('      - Check Network Access → Add IP (or 0.0.0.0/0 for all)');
    console.log('      - Try non-SRV connection if SRV fails');
    console.log('   2. If using local MongoDB:');
    console.log('      - Start MongoDB service: Start-Service MongoDB');
    console.log('      - Or install MongoDB: https://www.mongodb.com/try/download/community');
    console.log('   3. Test with debug mode:');
    console.log('      $env:DEBUG="mongoose:*"; npm run dev');
    
    process.exit(1);
  });
