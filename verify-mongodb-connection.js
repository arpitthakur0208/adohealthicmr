/**
 * Enhanced MongoDB Connection Verifier
 * This script does a more thorough check of MongoDB connection
 */

const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// Read .env.local
const envPath = path.join(__dirname, '.env.local');
let MONGODB_URI = 'mongodb://localhost:27017/adohealthicmr';

if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  const lines = envContent.split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#') && trimmed.startsWith('MONGODB_URI=')) {
      const mongoMatch = trimmed.match(/MONGODB_URI=(.+)/);
      if (mongoMatch) {
        MONGODB_URI = mongoMatch[1].trim();
        break;
      }
    }
  }
}

console.log('🔍 Enhanced MongoDB Connection Test\n');
console.log('📍 Connection string:', MONGODB_URI.replace(/\/\/.*@/, '//***:***@'));
console.log('⏳ Testing connection (this may take up to 15 seconds)...\n');

// Increase timeout for initial connection
mongoose.connect(MONGODB_URI, {
  serverSelectionTimeoutMS: 15000,
  socketTimeoutMS: 20000,
  connectTimeoutMS: 15000,
})
  .then(async () => {
    console.log('✅ MongoDB connection established!');
    
    // Verify we can actually use the connection
    try {
      const adminDb = mongoose.connection.db.admin();
      const serverStatus = await adminDb.serverStatus();
      console.log('✅ Server status retrieved successfully');
      console.log(`   MongoDB version: ${serverStatus.version || 'Unknown'}`);
      console.log(`   Uptime: ${Math.floor(serverStatus.uptime / 60)} minutes`);
      
      // List databases to verify we can query
      const dbList = await mongoose.connection.db.admin().listDatabases();
      console.log(`✅ Can query databases (found ${dbList.databases.length} databases)`);
      
      console.log('\n✅✅✅ MongoDB is FULLY CONNECTED and WORKING! ✅✅✅');
      console.log('✅ You can now run: npm run create-default-admin\n');
      
      await mongoose.connection.close();
      process.exit(0);
    } catch (verifyError) {
      console.log('⚠️  Connection established but verification failed:', verifyError.message);
      console.log('   MongoDB may still be initializing. Try again in a few seconds.\n');
      await mongoose.connection.close();
      process.exit(1);
    }
  })
  .catch((error) => {
    console.error('❌ FAILED! MongoDB connection error:');
    console.error('   Error:', error.message);
    console.error('   Error code:', error.code || 'N/A');
    
    if (error.message.includes('ECONNREFUSED')) {
      console.log('\n💡 SOLUTION:');
      console.log('   MongoDB is not running or not accessible.');
      console.log('   1. Start MongoDB:');
      console.log('      - Right-click start-mongodb-debug.bat → Run as administrator');
      console.log('      - Or: Start-Service MongoDB (PowerShell as Admin)');
      console.log('   2. Wait 10-15 seconds for MongoDB to fully start');
      console.log('   3. Run this test again: npm run verify-mongodb\n');
    } else if (error.message.includes('timeout') || error.message.includes('Server selection')) {
      console.log('\n💡 SOLUTION:');
      console.log('   MongoDB is starting but not ready yet.');
      console.log('   1. Check if MongoDB process is running');
      console.log('   2. Wait 15-30 seconds for MongoDB to fully initialize');
      console.log('   3. Check MongoDB window for any error messages');
      console.log('   4. Run this test again: npm run verify-mongodb\n');
    } else if (error.message.includes('authentication failed')) {
      console.log('\n💡 SOLUTION:');
      console.log('   Authentication failed. Check username/password in connection string.\n');
    } else {
      console.log('\n💡 Check MongoDB logs for more details.');
      console.log('   If MongoDB is running, check the MongoDB window for errors.\n');
    }
    
    process.exit(1);
  });
