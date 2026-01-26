# Quick Start Guide - Backend Setup

## Step 1: Install Dependencies

```bash
npm install
```

This will install:
- MongoDB/Mongoose for database
- JWT and bcryptjs for authentication
- All other project dependencies

## Step 2: Set Up MongoDB

### Option A: Local MongoDB
1. Download and install MongoDB from [mongodb.com](https://www.mongodb.com/try/download/community)
2. Start MongoDB service
3. MongoDB will run on `mongodb://localhost:27017`

### Option B: MongoDB Atlas (Cloud - Recommended)
1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Get your connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/adohealthicmr`)

## Step 3: Configure Environment Variables

1. Copy the example environment file:
   ```bash
   cp .env.example .env.local
   ```

2. Edit `.env.local` and update:
   ```env
   MONGODB_URI=your-mongodb-connection-string
   JWT_SECRET=generate-a-random-secret-key-here
   WEB3FORMS_ACCESS_KEY=your-web3forms-key (optional)
   ```

   **Important**: Generate a strong JWT_SECRET. You can use:
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

## Step 4: Migrate Existing Data

Import your existing modules and questions from `data/app-data.json`:

```bash
npm run migrate
```

This will:
- Connect to MongoDB
- Import all modules
- Import all questions
- Preserve your existing data structure

## Step 5: Create Admin User

Create your first admin account:

```bash
npm run create-admin
```

Follow the prompts to create an admin user.

## Step 6: Start Development Server

```bash
npm run dev
```

Your backend is now running! The API will be available at:
- `http://localhost:3000/api/`

## Testing the Backend

### 1. Test Authentication

**Register a user:**
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"password123"}'
```

**Login:**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"password123"}' \
  -c cookies.txt
```

**Get current user:**
```bash
curl http://localhost:3000/api/auth/me -b cookies.txt
```

### 2. Test Modules API

**Get all modules:**
```bash
curl http://localhost:3000/api/modules
```

**Get single module:**
```bash
curl http://localhost:3000/api/modules/1
```

### 3. Test Questions API

**Get all questions:**
```bash
curl http://localhost:3000/api/questions
```

**Get questions for a module:**
```bash
curl http://localhost:3000/api/questions?moduleId=1
```

## API Endpoints Summary

### Public Endpoints
- `GET /api/modules` - Get all modules
- `GET /api/modules/[id]` - Get single module
- `GET /api/questions` - Get all questions
- `GET /api/questions?moduleId=1` - Get questions for a module
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Authenticated Endpoints (Require Login)
- `GET /api/auth/me` - Get current user info
- `POST /api/auth/logout` - Logout
- `GET /api/answers` - Get user's answers
- `POST /api/answers` - Submit an answer

### Admin Only Endpoints
- `POST /api/modules` - Create module
- `PUT /api/modules/[id]` - Update module
- `DELETE /api/modules/[id]` - Delete module
- `POST /api/questions` - Create question
- `POST /api/data/save` - Bulk save data

## Troubleshooting

### MongoDB Connection Error
- Check if MongoDB is running
- Verify `MONGODB_URI` in `.env.local` is correct
- For Atlas: Check IP whitelist and credentials

### Authentication Not Working
- Verify `JWT_SECRET` is set in `.env.local`
- Check browser cookies are enabled
- Ensure you're using the same domain (cookies are domain-specific)

### Migration Fails
- Ensure MongoDB is running and accessible
- Check `data/app-data.json` exists and is valid JSON
- Verify database connection string is correct

## Next Steps

1. Update your frontend to use the new API endpoints
2. Implement user authentication in your React components
3. Replace localStorage calls with API calls
4. Add error handling and loading states

For detailed API documentation, see `BACKEND_SETUP.md`.
