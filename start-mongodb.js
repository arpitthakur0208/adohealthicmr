/**
 * MongoDB Starter Script
 * Helps start MongoDB if it's installed
 * Run: node start-mongodb.js
 */

const { execSync, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔍 Checking MongoDB installation...\n');

// Common MongoDB installation paths
const commonPaths = [
  'C:\\Program Files\\MongoDB\\Server\\7.0\\bin\\mongod.exe',
  'C:\\Program Files\\MongoDB\\Server\\6.0\\bin\\mongod.exe',
  'C:\\Program Files\\MongoDB\\Server\\5.0\\bin\\mongod.exe',
  'C:\\Program Files\\MongoDB\\Server\\4.4\\bin\\mongod.exe',
  'C:\\mongodb\\bin\\mongod.exe',
  process.env.LOCALAPPDATA + '\\Programs\\mongodb\\bin\\mongod.exe',
];

let mongodPath = null;

// Check if mongod exists in common paths
for (const testPath of commonPaths) {
  if (fs.existsSync(testPath)) {
    mongodPath = testPath;
    console.log('✅ Found MongoDB at:', mongodPath);
    break;
  }
}

// Try to find via PATH
if (!mongodPath) {
  try {
    const result = execSync('where mongod', { encoding: 'utf8', stdio: 'pipe' });
    if (result && !result.includes('Could not find')) {
      mongodPath = result.trim().split('\n')[0];
      console.log('✅ Found MongoDB in PATH:', mongodPath);
    }
  } catch (e) {
    // Not in PATH
  }
}

if (!mongodPath) {
  console.log('❌ MongoDB not found in common locations.');
  console.log('\n💡 Solutions:');
  console.log('   1. Install MongoDB Community Edition:');
  console.log('      https://www.mongodb.com/try/download/community');
  console.log('   2. Or use MongoDB Atlas (cloud - free):');
  console.log('      Run: npm run setup-mongodb');
  console.log('      See: QUICK_MONGODB_SETUP.md\n');
  process.exit(1);
}

// Check if MongoDB is already running
try {
  const testResult = execSync('Test-NetConnection -ComputerName localhost -Port 27017 -InformationLevel Quiet', {
    shell: 'powershell.exe',
    encoding: 'utf8',
    stdio: 'pipe'
  });
  
  if (testResult.trim() === 'True') {
    console.log('✅ MongoDB is already running on port 27017!');
    console.log('   You can test connection with: npm run test-db\n');
    process.exit(0);
  }
} catch (e) {
  // Port not open, continue to start MongoDB
}

// Check for data directory
const dataDir = path.join(process.env.USERPROFILE || process.env.HOME, 'data', 'db');
const altDataDir = 'C:\\data\\db';

let dbPath = dataDir;
if (!fs.existsSync(dataDir)) {
  if (fs.existsSync(altDataDir)) {
    dbPath = altDataDir;
  } else {
    console.log('⚠️  Data directory not found. Creating:', dataDir);
    try {
      fs.mkdirSync(dataDir, { recursive: true });
      console.log('✅ Created data directory:', dataDir);
    } catch (err) {
      console.log('❌ Could not create data directory:', err.message);
      console.log('   You may need to create it manually or run MongoDB as administrator\n');
      process.exit(1);
    }
  }
}

console.log('📁 Using data directory:', dbPath);
console.log('\n🚀 Starting MongoDB...');
console.log('   This will start MongoDB in the background.');
console.log('   Press Ctrl+C to stop MongoDB when done.\n');

// Start MongoDB
const mongod = spawn(mongodPath, ['--dbpath', dbPath], {
  stdio: 'inherit',
  shell: true
});

mongod.on('error', (err) => {
  console.error('❌ Error starting MongoDB:', err.message);
  console.error('\n💡 Try running as administrator or check MongoDB installation.\n');
  process.exit(1);
});

mongod.on('exit', (code) => {
  if (code !== null && code !== 0) {
    console.error(`\n❌ MongoDB exited with code ${code}`);
    console.error('   Check the error messages above for details.\n');
  }
});

// Wait a bit and test connection
setTimeout(() => {
  try {
    const testResult = execSync('Test-NetConnection -ComputerName localhost -Port 27017 -InformationLevel Quiet', {
      shell: 'powershell.exe',
      encoding: 'utf8',
      stdio: 'pipe'
    });
    
    if (testResult.trim() === 'True') {
      console.log('\n✅ MongoDB started successfully!');
      console.log('   Listening on: localhost:27017');
      console.log('   Data directory:', dbPath);
      console.log('\n🧪 Test connection: npm run test-db');
      console.log('   To stop MongoDB: Press Ctrl+C\n');
    } else {
      console.log('\n⚠️  MongoDB may still be starting...');
      console.log('   Wait a few seconds and run: npm run test-db\n');
    }
  } catch (e) {
    console.log('\n⚠️  Could not verify MongoDB started.');
    console.log('   Check if MongoDB is running manually.\n');
  }
}, 3000);

// Handle Ctrl+C
process.on('SIGINT', () => {
  console.log('\n\n🛑 Stopping MongoDB...');
  mongod.kill();
  process.exit(0);
});

console.log('   MongoDB process started. Waiting for connection...');
