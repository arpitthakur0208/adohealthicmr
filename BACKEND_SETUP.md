# Backend Architecture Documentation

## Overview

The backend is built using Next.js API Routes with MongoDB as the database. It includes:
- User authentication with JWT tokens
- Role-based access control (Admin/User)
- RESTful API endpoints
- Database models for Modules, Questions, Answers, and Users

## Database Models

### User
- `username` (String, unique, required)
- `password` (String, hashed with bcrypt, required)
- `email` (String, optional)
- `role` (Enum: 'user' | 'admin', default: 'user')
- `createdAt`, `updatedAt` (timestamps)

### Module
- `id` (Number, unique, required)
- `title` (String, required)
- `description` (String, required)
- `color` (String, required)
- `createdAt`, `updatedAt` (timestamps)

### Question
- `id` (Number, required)
- `moduleId` (Number, required, indexed)
- `question` (String, required)
- `options` (Array of Strings, min 2, required)
- `correctAnswer` (Number, optional)
- `createdAt`, `updatedAt` (timestamps)
- Compound index: `{ moduleId: 1, id: 1 }` (unique)

### Answer
- `userId` (ObjectId, ref: User, required, indexed)
- `moduleId` (Number, required, indexed)
- `questionId` (Number, required)
- `answer` (String, required)
- `isCorrect` (Boolean, optional, auto-calculated)
- `submittedAt` (Date)
- `createdAt`, `updatedAt` (timestamps)
- Compound index: `{ userId: 1, moduleId: 1, questionId: 1 }` (unique)

## Authentication

### JWT Tokens
- Tokens are stored in HTTP-only cookies
- Expires in 7 days
- Contains: `userId`, `username`, `role`

### Middleware Functions
- `getCurrentUser(request)` - Get current user from token
- `requireAuth(handler)` - Require authentication
- `requireAdmin(handler)` - Require admin role

## API Routes

### Authentication Routes (`/api/auth/`)

#### POST `/api/auth/register`
Register a new user.

**Request Body:**
```json
{
  "username": "string",
  "password": "string",
  "email": "string (optional)",
  "role": "user | admin (optional, default: user)"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "user": {
    "id": "ObjectId",
    "username": "string",
    "email": "string",
    "role": "string"
  }
}
```

#### POST `/api/auth/login`
Login user.

**Request Body:**
```json
{
  "username": "string",
  "password": "string"
}
```

**Response:** Same as register

#### POST `/api/auth/logout`
Logout user (clears cookie).

#### GET `/api/auth/me`
Get current user information.

### Module Routes (`/api/modules/`)

#### GET `/api/modules`
Get all modules (public).

**Response:**
```json
{
  "success": true,
  "modules": [...]
}
```

#### POST `/api/modules`
Create a new module (Admin only).

**Request Body:**
```json
{
  "id": 1,
  "title": "string",
  "description": "string",
  "color": "string"
}
```

#### GET `/api/modules/[id]`
Get single module by ID.

#### PUT `/api/modules/[id]`
Update module (Admin only).

#### DELETE `/api/modules/[id]`
Delete module (Admin only).

### Question Routes (`/api/questions/`)

#### GET `/api/questions`
Get all questions (optional query: `?moduleId=1`).

**Response:**
```json
{
  "success": true,
  "questions": [...]
}
```

#### POST `/api/questions`
Create a new question (Admin only).

**Request Body:**
```json
{
  "id": 1,
  "moduleId": 1,
  "question": "string",
  "options": ["string", "string", ...],
  "correctAnswer": 1
}
```

### Answer Routes (`/api/answers/`)

#### GET `/api/answers`
Get user's answers (optional query: `?moduleId=1`).
- Users can only see their own answers
- Admins can see any user's answers (use `?userId=...`)

#### POST `/api/answers`
Submit an answer.

**Request Body:**
```json
{
  "moduleId": 1,
  "questionId": 1,
  "answer": "string or number"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Answer submitted successfully",
  "answer": {
    "userId": "ObjectId",
    "moduleId": 1,
    "questionId": 1,
    "answer": "string",
    "isCorrect": true
  }
}
```

## Database Connection

The database connection is handled in `src/lib/db.ts`:
- Uses connection caching for development
- Automatically connects on first API route call
- Handles reconnection automatically

## Security Features

1. **Password Hashing**: All passwords are hashed using bcryptjs before storage
2. **JWT Tokens**: Secure token-based authentication
3. **HTTP-only Cookies**: Tokens stored in secure cookies
4. **Role-based Access**: Admin routes protected with middleware
5. **Input Validation**: All endpoints validate input data
6. **Error Handling**: Comprehensive error handling and logging

## Migration Scripts

### `migrate-data.ts`
Migrates existing JSON data from `data/app-data.json` to MongoDB.
```bash
npm run migrate
```

### `create-admin.ts`
Interactive script to create an admin user.
```bash
npm run create-admin
```

## Environment Variables

Required environment variables (see `.env.example`):
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `WEB3FORMS_ACCESS_KEY` - Email service key (optional)
- `NODE_ENV` - Environment (development/production)
- `NEXT_PUBLIC_APP_URL` - Application URL

## Error Handling

All API routes follow a consistent error response format:
```json
{
  "error": "Error message",
  "details": "Additional error details (optional)"
}
```

Status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (authentication required)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `500` - Internal Server Error
