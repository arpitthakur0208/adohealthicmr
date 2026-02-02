/**
 * Quick MongoDB URI Updater
 * This script helps you update your MongoDB connection string
 * Run: node update-mongodb-uri.js
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function updateMongoDBURI() {
  console.log('\n🔧 MongoDB Connection String Updater\n');
  console.log('='.repeat(60));
  
  const envPath = path.join(__dirname, '.env.local');
  
  console.log('\n📋 Instructions:');
  console.log('1. Go to https://cloud.mongodb.com/');
  console.log('2. Login to MongoDB Atlas');
  console.log('3. Click "Clusters" → Click "Connect" on your cluster');
  console.log('4. Choose "Connect your application"');
  console.log('5. Copy the connection string\n');
  
  let connectionString = await question('Paste your MongoDB Atlas connection string here: ');
  connectionString = connectionString.trim();
  
  if (!connectionString) {
    console.log('\n❌ No connection string provided. Exiting.');
    rl.close();
    return;
  }
  
  // Validate format
  if (!connectionString.startsWith('mongodb+srv://') && !connectionString.startsWith('mongodb://')) {
    console.log('\n⚠️  Warning: Connection string should start with mongodb+srv:// or mongodb://');
    const proceed = await question('Continue anyway? (y/n): ');
    if (proceed.toLowerCase() !== 'y') {
      rl.close();
      return;
    }
  }
  
  // Check for placeholders
  if (connectionString.includes('<password>')) {
    const password = await question('Enter your database password (to replace <password>): ');
    connectionString = connectionString.replace('<password>', password);
  }
  
  if (connectionString.includes('<username>')) {
    const username = await question('Enter your database username (to replace <username>): ');
    connectionString = connectionString.replace('<username>', username);
  }
  
  // Ensure database name is set
  if (!connectionString.includes('/adohealthicmr') && !connectionString.match(/\/[^/?]+(\?|$)/)) {
    // Check if it ends with just ? or has no database name
    if (connectionString.includes('mongodb+srv://')) {
      // For SRV, add database name before the ?
      if (connectionString.includes('?')) {
        connectionString = connectionString.replace('?', '/adohealthicmr?');
      } else {
        connectionString += '/adohealthicmr';
      }
    } else {
      // For standard connection
      if (connectionString.includes('?')) {
        connectionString = connectionString.replace('?', '/adohealthicmr?');
      } else {
        connectionString += '/adohealthicmr';
      }
    }
    console.log('\n✅ Added database name: /adohealthicmr');
  }
  
  // Read current .env.local
  let envContent = '';
  if (fs.existsSync(envPath)) {
    envContent = fs.readFileSync(envPath, 'utf8');
  } else {
    // Create from example
    const examplePath = path.join(__dirname, '.env.example');
    if (fs.existsSync(examplePath)) {
      envContent = fs.readFileSync(examplePath, 'utf8');
    }
  }
  
  // Update MONGODB_URI
  if (envContent.includes('MONGODB_URI=')) {
    // Replace existing
    envContent = envContent.replace(/MONGODB_URI=.*/g, `MONGODB_URI=${connectionString}`);
  } else {
    // Add new
    if (!envContent.endsWith('\n')) {
      envContent += '\n';
    }
    envContent += `MONGODB_URI=${connectionString}\n`;
  }
  
  // Write back
  fs.writeFileSync(envPath, envContent, 'utf8');
  
  console.log('\n✅ Successfully updated .env.local!');
  console.log('📍 Connection string:', connectionString.replace(/\/\/([^:]+):([^@]+)@/, '//$1:***@'));
  
  // Test connection
  console.log('\n🧪 Testing connection...');
  console.log('   Run: npm run test-db\n');
  
  rl.close();
}

updateMongoDBURI().catch(console.error);
