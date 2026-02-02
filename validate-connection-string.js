/**
 * Validate MongoDB Connection String
 * Run: node validate-connection-string.js
 * 
 * This script checks if your connection string has the correct format
 */

const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '.env.local');
let MONGODB_URI = null;

if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  const mongoMatch = envContent.match(/MONGODB_URI=(.+)/);
  if (mongoMatch) {
    MONGODB_URI = mongoMatch[1].trim();
  }
}

if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI not found in .env.local');
  process.exit(1);
}

console.log('🔍 Validating MongoDB connection string...\n');
console.log('📍 Connection string:', MONGODB_URI.replace(/\/\/([^:]+):([^@]+)@/, '//$1:***@'));

let isValid = true;
const errors = [];
const warnings = [];

// Check for placeholder values
if (MONGODB_URI.includes('xxxxx')) {
  isValid = false;
  errors.push('❌ Contains placeholder "xxxxx" - replace with your actual cluster address');
}

if (MONGODB_URI.includes('<username>') || MONGODB_URI.includes('<password>') || MONGODB_URI.includes('<dbname>')) {
  isValid = false;
  errors.push('❌ Contains placeholder values (<username>, <password>, <dbname>) - replace with actual values');
}

// Check format
if (MONGODB_URI.startsWith('mongodb+srv://')) {
  console.log('✅ Using SRV connection (mongodb+srv://)');
  
  // Check if it has username:password
  if (!MONGODB_URI.match(/mongodb\+srv:\/\/[^:]+:[^@]+@/)) {
    isValid = false;
    errors.push('❌ Missing username:password in connection string');
  }
  
  // Check cluster address format
  const clusterMatch = MONGODB_URI.match(/@([^/]+)/);
  if (clusterMatch) {
    const clusterAddr = clusterMatch[1];
    if (clusterAddr.includes('xxxxx') || clusterAddr.length < 10) {
      isValid = false;
      errors.push('❌ Invalid cluster address - should be like cluster0.abc123.mongodb.net');
    } else {
      console.log('✅ Cluster address looks valid:', clusterAddr);
    }
  }
  
} else if (MONGODB_URI.startsWith('mongodb://')) {
  console.log('✅ Using standard connection (mongodb://)');
  
  // Check if it has username:password
  if (!MONGODB_URI.match(/mongodb:\/\/[^:]+:[^@]+@/)) {
    isValid = false;
    errors.push('❌ Missing username:password in connection string');
  }
  
} else {
  isValid = false;
  errors.push('❌ Invalid connection string format - should start with mongodb:// or mongodb+srv://');
}

// Check database name
if (!MONGODB_URI.includes('/adohealthicmr') && !MONGODB_URI.includes('/?') && !MONGODB_URI.includes('?retryWrites')) {
  warnings.push('⚠️  Database name not found - make sure to add /adohealthicmr before the ?');
}

// Check for localhost (might not be running)
if (MONGODB_URI.includes('localhost') || MONGODB_URI.includes('127.0.0.1')) {
  warnings.push('⚠️  Using localhost - make sure MongoDB is running locally');
}

// Print results
console.log('');

if (errors.length > 0) {
  console.log('❌ VALIDATION FAILED:\n');
  errors.forEach(err => console.log('   ' + err));
  console.log('');
}

if (warnings.length > 0) {
  console.log('⚠️  WARNINGS:\n');
  warnings.forEach(warn => console.log('   ' + warn));
  console.log('');
}

if (isValid && errors.length === 0) {
  console.log('✅ Connection string format looks valid!');
  console.log('   You can test it with: npm run test-db\n');
} else {
  console.log('💡 HOW TO FIX:');
  console.log('   1. See: get-mongodb-connection.md');
  console.log('   2. Or run: npm run setup-mongodb');
  console.log('   3. Get connection string from MongoDB Atlas → Clusters → Connect\n');
}

process.exit(isValid ? 0 : 1);
