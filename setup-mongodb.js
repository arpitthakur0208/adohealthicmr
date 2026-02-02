/**
 * MongoDB Setup Helper Script
 * This script helps you configure MongoDB connection
 * Run: node setup-mongodb.js
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

async function setupMongoDB() {
  console.log('\n🔧 MongoDB Setup Helper\n');
  console.log('='.repeat(60));
  console.log('\nChoose your MongoDB setup:');
  console.log('1. MongoDB Atlas (Cloud) - Recommended ✅');
  console.log('2. Local MongoDB (requires installation)');
  console.log('3. Skip setup (manual configuration)\n');

  const choice = await question('Enter your choice (1-3): ');

  const envPath = path.join(__dirname, '.env.local');
  let envContent = '';

  if (fs.existsSync(envPath)) {
    envContent = fs.readFileSync(envPath, 'utf8');
  } else {
    // Create from example if doesn't exist
    const examplePath = path.join(__dirname, '.env.example');
    if (fs.existsSync(examplePath)) {
      envContent = fs.readFileSync(examplePath, 'utf8');
    }
  }

  if (choice === '1') {
    console.log('\n📝 MongoDB Atlas Setup:');
    console.log('1. Go to https://www.mongodb.com/cloud/atlas');
    console.log('2. Sign up/Login and create a free cluster');
    console.log('3. Database Access → Create database user (remember username/password)');
    console.log('4. Network Access → Add IP Address → Add Current IP (or 0.0.0.0/0 for all)');
    console.log('5. Clusters → Connect → Connect your application');
    console.log('6. Copy the connection string\n');

    const connectionString = await question('Paste your MongoDB Atlas connection string: ');
    
    // Clean up the connection string
    let mongoUri = connectionString.trim();
    
    // Replace <password> and <dbname> if present
    if (mongoUri.includes('<password>')) {
      const password = await question('Enter your database password: ');
      mongoUri = mongoUri.replace('<password>', password);
    }
    if (mongoUri.includes('<dbname>')) {
      mongoUri = mongoUri.replace('<dbname>', 'adohealthicmr');
    }
    if (!mongoUri.includes('/adohealthicmr') && !mongoUri.includes('?retryWrites')) {
      // Add database name if not present
      mongoUri = mongoUri.replace(/\/$/, '') + '/adohealthicmr';
    }

    // Update .env.local
    if (envContent.includes('MONGODB_URI=')) {
      envContent = envContent.replace(/MONGODB_URI=.*/g, `MONGODB_URI=${mongoUri}`);
    } else {
      envContent += `\nMONGODB_URI=${mongoUri}\n`;
    }

    console.log('\n✅ MongoDB Atlas connection string configured!');
    
  } else if (choice === '2') {
    console.log('\n📝 Local MongoDB Setup:');
    console.log('1. Download MongoDB: https://www.mongodb.com/try/download/community');
    console.log('2. Install MongoDB Community Edition');
    console.log('3. Start MongoDB service:\n');
    console.log('   Windows PowerShell:');
    console.log('   Start-Service MongoDB\n');
    console.log('   Or start manually:');
    console.log('   mongod --dbpath "C:\\data\\db"\n');

    const mongoUri = 'mongodb://localhost:27017/adohealthicmr';
    
    if (envContent.includes('MONGODB_URI=')) {
      envContent = envContent.replace(/MONGODB_URI=.*/g, `MONGODB_URI=${mongoUri}`);
    } else {
      envContent += `\nMONGODB_URI=${mongoUri}\n`;
    }

    console.log('✅ Local MongoDB connection string configured!');
    console.log('⚠️  Make sure MongoDB is running before testing connection.');
    
  } else {
    console.log('\n⏭️  Skipping setup. Please configure MONGODB_URI manually in .env.local');
    rl.close();
    return;
  }

  // Write updated .env.local
  fs.writeFileSync(envPath, envContent, 'utf8');
  console.log('\n✅ .env.local file updated!');

  // Test connection
  console.log('\n🧪 Testing MongoDB connection...');
  const testScript = path.join(__dirname, 'test-db-connection.js');
  if (fs.existsSync(testScript)) {
    console.log('Run: npm run test-db\n');
  }

  rl.close();
}

setupMongoDB().catch(console.error);
