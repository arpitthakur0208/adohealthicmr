# Complete API Documentation

## Base URL
All API endpoints are prefixed with `/api`

---

## Authentication APIs

### POST `/api/auth/register`
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
    "role": "user | admin"
  }
}
```

---

### POST `/api/auth/login`
Login with username and password. Supports two roles: `admin` and `user`.

**Request Body:**
```json
{
  "username": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Admin login successful" | "User login successful",
  "user": {
    "id": "ObjectId",
    "username": "string",
    "email": "string",
    "role": "admin" | "user"
  },
  "permissions": {
    "canManageModules": boolean,
    "canManageQuestions": boolean,
    "canSubmitAnswers": boolean,
    "canViewAllAnswers": boolean,
    "canDeleteData": boolean,
    "isAdmin": boolean,
    "isUser": boolean
  }
}
```

---

### POST `/api/auth/logout`
Logout current user (clears authentication cookie).

**Response:**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

### GET `/api/auth/me`
Get current authenticated user information.

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "ObjectId",
    "username": "string",
    "email": "string",
    "role": "admin" | "user",
    "createdAt": "ISO Date"
  }
}
```

---

## Module APIs

### GET `/api/modules`
Get all modules (Public).

**Response:**
```json
{
  "success": true,
  "modules": [
    {
      "_id": "ObjectId",
      "id": 1,
      "title": "string",
      "description": "string",
      "color": "string",
      "createdAt": "ISO Date",
      "updatedAt": "ISO Date"
    }
  ]
}
```

---

### GET `/api/modules/[id]`
Get single module by ID (Public).

**Response:**
```json
{
  "success": true,
  "module": { ... }
}
```

---

### POST `/api/modules`
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

**Response:**
```json
{
  "success": true,
  "message": "Module created successfully",
  "module": { ... }
}
```

---

### PUT `/api/modules/[id]`
Update a module (Admin only).

**Request Body:**
```json
{
  "title": "string",
  "description": "string",
  "color": "string"
}
```

---

### DELETE `/api/modules/[id]`
Delete a module (Admin only).

---

## Question APIs

### GET `/api/questions`
Get all questions (Public). Optional query parameters:
- `?moduleId=1` - Filter by module ID

**Response:**
```json
{
  "success": true,
  "questions": [
    {
      "_id": "ObjectId",
      "id": 1,
      "moduleId": 1,
      "question": "string",
      "options": ["string", "string", ...],
      "correctAnswer": 1,
      "createdAt": "ISO Date",
      "updatedAt": "ISO Date"
    }
  ]
}
```

---

### GET `/api/questions/[id]?moduleId=1`
Get single question by ID and moduleId (Public).

**Response:**
```json
{
  "success": true,
  "question": { ... }
}
```

---

### POST `/api/questions`
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

---

### PUT `/api/questions/[id]?moduleId=1`
Update a question (Admin only).

**Request Body:**
```json
{
  "question": "string",
  "options": ["string", "string", ...],
  "correctAnswer": 1
}
```

---

### DELETE `/api/questions/[id]?moduleId=1`
Delete a question (Admin only).

---

## Answer APIs

### GET `/api/answers`
Get user's answers (Authenticated). Optional query parameters:
- `?moduleId=1` - Filter by module ID
- `?userId=ObjectId` - Filter by user ID (Admin only)

**Response:**
```json
{
  "success": true,
  "answers": [
    {
      "_id": "ObjectId",
      "userId": "ObjectId",
      "moduleId": 1,
      "questionId": 1,
      "answer": "string",
      "isCorrect": true,
      "submittedAt": "ISO Date",
      "createdAt": "ISO Date",
      "updatedAt": "ISO Date"
    }
  ]
}
```

---

### POST `/api/answers`
Submit an answer (Authenticated).

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

---

## Video APIs

### GET `/api/videos`
Get all videos (Authenticated). Optional query parameters:
- `?moduleId=1` - Filter by module ID
- `?videoType=english` - Filter by video type (english, punjabi, hindi, activity)

**Response:**
```json
{
  "success": true,
  "videos": [
    {
      "_id": "ObjectId",
      "moduleId": 1,
      "videoType": "english",
      "videoId": 1,
      "preview": "string",
      "fileName": "string",
      "fileSize": 12345,
      "fileUrl": "string (optional)",
      "uploadedBy": {
        "_id": "ObjectId",
        "username": "string"
      },
      "createdAt": "ISO Date",
      "updatedAt": "ISO Date"
    }
  ]
}
```

---

### GET `/api/videos/[id]?moduleId=1&videoType=english`
Get single video by ID (Authenticated).

---

### POST `/api/videos`
Create a new video (Admin only).

**Request Body:**
```json
{
  "moduleId": 1,
  "videoType": "english" | "punjabi" | "hindi" | "activity",
  "videoId": 1,
  "preview": "string",
  "fileName": "string",
  "fileSize": 12345,
  "fileUrl": "string (optional)"
}
```

---

### PUT `/api/videos/[id]?moduleId=1&videoType=english`
Update a video (Admin only).

**Request Body:**
```json
{
  "preview": "string",
  "fileName": "string",
  "fileSize": 12345,
  "fileUrl": "string"
}
```

---

### DELETE `/api/videos/[id]?moduleId=1&videoType=english`
Delete a video (Admin only).

---

## User Management APIs

### GET `/api/users`
Get all users (Admin only). Optional query parameters:
- `?role=admin` - Filter by role
- `?search=keyword` - Search by username or email

**Response:**
```json
{
  "success": true,
  "users": [
    {
      "_id": "ObjectId",
      "username": "string",
      "email": "string",
      "role": "admin" | "user",
      "createdAt": "ISO Date",
      "updatedAt": "ISO Date"
    }
  ],
  "count": 10
}
```

---

### GET `/api/users/[id]`
Get single user by ID (Users can view own profile, Admins can view any).

---

### PUT `/api/users/[id]`
Update user (Users can update own profile, Admins can update any).

**Request Body:**
```json
{
  "username": "string (optional)",
  "email": "string (optional)",
  "role": "admin | user (optional, admin only)",
  "password": "string (optional)"
}
```

---

### DELETE `/api/users/[id]`
Delete a user (Admin only). Admins cannot delete themselves.

---

## Statistics API

### GET `/api/statistics`
Get application statistics (Authenticated). Optional query parameter:
- `?moduleId=1` - Filter by module ID

**Response (Admin):**
```json
{
  "success": true,
  "statistics": {
    "overview": {
      "totalModules": 7,
      "totalQuestions": 70,
      "totalUsers": 50,
      "totalVideos": 28
    },
    "answers": {
      "totalAnswers": 500,
      "correctAnswers": 350,
      "incorrectAnswers": 150,
      "accuracyRate": "70.00",
      "uniqueUsersAnswered": 45
    },
    "modules": [
      {
        "moduleId": 1,
        "moduleTitle": "Module 1",
        "questionsCount": 10,
        "videosCount": 4,
        "totalAnswers": 50,
        "correctAnswers": 35,
        "accuracyRate": "70.00"
      }
    ]
  }
}
```

**Response (User):**
```json
{
  "success": true,
  "statistics": {
    "overview": {
      "totalModules": 7,
      "totalQuestions": 70,
      "totalVideos": 28
    },
    "answers": {
      "totalAnswers": 20,
      "correctAnswers": 15,
      "incorrectAnswers": 5,
      "accuracyRate": "75.00"
    },
    "modules": [ ... ]
  }
}
```

---

## Bulk Operations API

### POST `/api/bulk`
Perform bulk operations (Admin only).

**Request Body:**
```json
{
  "operation": "create" | "update" | "delete",
  "resource": "modules" | "questions" | "videos",
  "data": [
    // Array of objects to create/update/delete
  ]
}
```

**Example - Bulk Create Modules:**
```json
{
  "operation": "create",
  "resource": "modules",
  "data": [
    {
      "id": 1,
      "title": "Module 1",
      "description": "Description",
      "color": "blue"
    },
    {
      "id": 2,
      "title": "Module 2",
      "description": "Description",
      "color": "green"
    }
  ]
}
```

**Example - Bulk Delete Questions:**
```json
{
  "operation": "delete",
  "resource": "questions",
  "data": [
    { "id": 1, "moduleId": 1 },
    { "id": 2, "moduleId": 1 }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Bulk create operation completed",
  "result": {
    "created": 2,
    "modules": [ ... ]
  }
}
```

---

## Legacy Data APIs

### GET `/api/data/load`
Load all data (backward compatibility - Public).

**Response:**
```json
{
  "modules": [ ... ],
  "questions": {
    "1": [ ... ],
    "2": [ ... ]
  },
  "answers": {},
  "lastUpdated": "ISO Date"
}
```

---

### POST `/api/data/save`
Save all data (backward compatibility - Admin only).

**Request Body:**
```json
{
  "modules": [ ... ],
  "questions": { ... },
  "answers": { ... }
}
```

---

## Email API

### POST `/api/send-email`
Send email with form answers (Public).

**Request Body:**
```json
{
  "to": "email@example.com",
  "subject": "string",
  "body": "string (optional)",
  "answers": {
    "question1": "answer1",
    "question2": "answer2"
  }
}
```

---

## Error Responses

All endpoints return consistent error responses:

```json
{
  "error": "Error message",
  "message": "Detailed error message (optional)",
  "details": "Additional error details (optional)"
}
```

**Status Codes:**
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (authentication required)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `500` - Internal Server Error

---

## Authentication

Most endpoints require authentication via JWT token stored in HTTP-only cookie. The token is automatically set after login.

For API clients, you can also send the token in the Authorization header:
```
Authorization: Bearer <token>
```

---

## Role-Based Access Control

### Admin Role
- Full access to all endpoints
- Can manage modules, questions, videos
- Can view all users and their answers
- Can perform bulk operations

### User Role
- Can view modules and questions
- Can submit answers
- Can view own profile and answers
- Cannot manage content or view other users' data

---

## Rate Limiting

Currently, there are no rate limits implemented. Consider adding rate limiting for production use.

---

## Notes

1. All timestamps are in ISO 8601 format
2. ObjectId fields are MongoDB ObjectIds (strings)
3. Video file uploads should be handled separately (consider using cloud storage)
4. Password fields are never returned in API responses
5. All admin endpoints validate the user's role before allowing access
