# 🏥 ADO Health ICMR - Complete Site Features & Working Documentation

## 📋 Table of Contents

1. [Overview](#overview)
2. [Main Features](#main-features)
3. [User Roles & Permissions](#user-roles--permissions)
4. [Frontend Features](#frontend-features)
5. [Backend API System](#backend-api-system)
6. [Database Structure](#database-structure)
7. [Authentication System](#authentication-system)
8. [User Flows](#user-flows)
9. [Admin Features](#admin-features)
10. [Technical Stack](#technical-stack)
11. [How Everything Works Together](#how-everything-works-together)

---

## 🎯 Overview

**ADO Health ICMR** is a comprehensive web application designed for health education and assessment, specifically focused on Non-Communicable Diseases (NCDs). The platform provides interactive learning modules, quizzes, video content, and progress tracking for users while offering complete content management capabilities for administrators.

### Purpose
- Educate users about NCDs (Non-Communicable Diseases)
- Assess knowledge through interactive quizzes
- Track learning progress and performance
- Provide multimedia educational content (videos)
- Enable administrators to manage all content and users

---

## ✨ Main Features

### 1. **Educational Modules System**
- Multiple learning modules covering different NCD topics
- Each module contains:
  - Title and description
  - Color-coded visual identification
  - Associated questions and quizzes
  - Related video content
  - Progress tracking

### 2. **Interactive Quiz System**
- Multiple-choice questions for each module
- Real-time answer submission
- Immediate feedback on answers
- Score calculation and accuracy tracking
- Answer history and review

### 3. **Video Content Management**
- Support for multiple video types:
  - English videos
  - Punjabi videos
  - Hindi videos
  - Activity videos
- Video organization by module
- Video metadata tracking (title, description, URL, type)

### 4. **User Authentication & Authorization**
- Secure user registration
- Login/logout functionality
- Role-based access control (Admin/User)
- Session management with JWT tokens
- OTP-based email verification (optional)

### 5. **Progress Tracking & Statistics**
- Individual user progress tracking
- Module completion status
- Answer accuracy rates
- Overall performance statistics
- Admin dashboard with comprehensive analytics

### 6. **Content Management (Admin)**
- Create, edit, and delete modules
- Manage questions and answers
- Upload and manage videos
- User management
- Bulk operations for efficient content updates

### 7. **Email Integration**
- Email notifications for OTP verification
- Answer submission email reports
- Web3Forms integration for email delivery

---

## 👥 User Roles & Permissions

### **Regular User**
- ✅ View all modules
- ✅ Take quizzes and submit answers
- ✅ View own progress and statistics
- ✅ Watch educational videos
- ✅ View own answer history
- ❌ Cannot create/edit/delete content
- ❌ Cannot access admin features
- ❌ Cannot view other users' data

### **Admin User**
- ✅ All regular user permissions
- ✅ Create, edit, and delete modules
- ✅ Manage questions and answers
- ✅ Upload and manage videos
- ✅ View all users and their data
- ✅ Access comprehensive statistics
- ✅ Perform bulk operations
- ✅ Manage user accounts
- ✅ View login history

---

## 🎨 Frontend Features

### **Home Page Components**

#### 1. **Header Component**
- Navigation bar with ICMR logo
- User authentication status display
- Login/Logout buttons
- Admin panel access (for admins)
- Modules navigation link
- Login history link (for admins)

#### 2. **Hero Section**
- Main banner with health education messaging
- Call-to-action buttons
- Visual appeal with images

#### 3. **Statistics Section**
- Display key statistics:
  - Total modules
  - Total questions
  - Total users (admin only)
  - Overall completion rates

#### 4. **Risk Factors Section**
- Educational content about NCD risk factors
- Visual presentation of health information

#### 5. **Image Section**
- Display educational images
- Image upload functionality (admin only)
- Image removal (admin only)

#### 6. **Modules Display**
- Grid/list view of all available modules
- Color-coded module cards
- Module selection and navigation
- Progress indicators

#### 7. **Quiz Interface**
- Question display with multiple-choice options
- Answer selection
- Submit button
- Progress indicator
- Results display

#### 8. **Footer**
- Site information
- Links and credits

### **Interactive Features**

#### **Module Selection**
- Users can browse and select modules
- Visual module cards with colors
- Click to start learning/quiz

#### **Quiz Taking**
- Step-by-step question navigation
- Multiple-choice answer selection
- Submit answers individually or in bulk
- View results immediately

#### **Progress Tracking**
- Visual progress indicators
- Completion percentages
- Score displays
- Answer accuracy rates

#### **Admin Dashboard** (Admin Only)
- Content management interface
- User management panel
- Statistics overview
- Bulk operation tools

---

## 🔌 Backend API System

### **Complete API Endpoints (29 Total)**

#### **🔐 Authentication APIs (7 endpoints)**

1. **POST `/api/auth/register`**
   - Register a new user
   - Input: username, password, email, role (optional)
   - Output: User object, JWT token
   - Features: Password hashing, validation

2. **POST `/api/auth/login`**
   - User/Admin login
   - Input: username, password
   - Output: User object, JWT token (HTTP-only cookie)
   - Features: Role-based login, session creation

3. **POST `/api/auth/logout`**
   - Logout current user
   - Output: Success message
   - Features: Cookie clearing, session termination

4. **GET `/api/auth/me`**
   - Get current authenticated user
   - Output: User object (without password)
   - Features: Token validation, user verification

5. **POST `/api/auth/request-otp`**
   - Request OTP for email verification
   - Input: email
   - Output: Success message
   - Features: OTP generation, email sending

6. **POST `/api/auth/verify-otp`**
   - Verify OTP code
   - Input: email, otp
   - Output: Verification result
   - Features: OTP validation, expiration check

7. **GET `/api/auth/login-history`**
   - Get user login history (Admin only)
   - Output: Array of login records
   - Features: Timestamp tracking, IP logging

#### **📚 Module APIs (5 endpoints)**

1. **GET `/api/modules`**
   - Get all modules
   - Query params: None
   - Output: Array of module objects
   - Access: Public

2. **GET `/api/modules/[id]`**
   - Get single module by ID
   - Output: Module object
   - Access: Public

3. **POST `/api/modules`**
   - Create new module
   - Input: title, description, color
   - Output: Created module
   - Access: Admin only

4. **PUT `/api/modules/[id]`**
   - Update existing module
   - Input: title, description, color
   - Output: Updated module
   - Access: Admin only

5. **DELETE `/api/modules/[id]`**
   - Delete module
   - Output: Success message
   - Access: Admin only

#### **❓ Question APIs (5 endpoints)**

1. **GET `/api/questions`**
   - Get all questions
   - Query params: `moduleId` (optional filter)
   - Output: Array of question objects
   - Access: Public

2. **GET `/api/questions/[id]`**
   - Get single question by ID
   - Output: Question object
   - Access: Public

3. **POST `/api/questions`**
   - Create new question
   - Input: question, options, correctAnswer, moduleId
   - Output: Created question
   - Access: Admin only

4. **PUT `/api/questions/[id]`**
   - Update existing question
   - Input: question, options, correctAnswer
   - Output: Updated question
   - Access: Admin only

5. **DELETE `/api/questions/[id]`**
   - Delete question
   - Output: Success message
   - Access: Admin only

#### **✅ Answer APIs (2 endpoints)**

1. **GET `/api/answers`**
   - Get user's answers
   - Query params: `moduleId` (optional filter), `userId` (admin only)
   - Output: Array of answer objects
   - Access: Authenticated users (own data) or Admin (all data)

2. **POST `/api/answers`**
   - Submit answer
   - Input: questionId, selectedAnswer, moduleId
   - Output: Created answer with correctness status
   - Access: Authenticated users

#### **🎥 Video APIs (5 endpoints)**

1. **GET `/api/videos`**
   - Get all videos
   - Query params: `moduleId`, `type` (optional filters)
   - Output: Array of video objects
   - Access: Public

2. **GET `/api/videos/[id]`**
   - Get single video by ID
   - Output: Video object
   - Access: Public

3. **POST `/api/videos`**
   - Create new video
   - Input: title, description, url, type, moduleId
   - Output: Created video
   - Access: Admin only

4. **PUT `/api/videos/[id]`**
   - Update existing video
   - Input: title, description, url, type
   - Output: Updated video
   - Access: Admin only

5. **DELETE `/api/videos/[id]`**
   - Delete video
   - Output: Success message
   - Access: Admin only

#### **👥 User Management APIs (4 endpoints)**

1. **GET `/api/users`**
   - Get all users
   - Query params: `role`, `search` (optional filters)
   - Output: Array of user objects (without passwords)
   - Access: Admin only

2. **GET `/api/users/[id]`**
   - Get single user by ID
   - Output: User object (without password)
   - Access: Users (own profile) or Admin (any profile)

3. **PUT `/api/users/[id]`**
   - Update user information
   - Input: username, email, role (admin only)
   - Output: Updated user
   - Access: Users (own profile) or Admin (any profile)

4. **DELETE `/api/users/[id]`**
   - Delete user account
   - Output: Success message
   - Access: Admin only

#### **📊 Statistics API (1 endpoint)**

1. **GET `/api/statistics`**
   - Get comprehensive statistics
   - Query params: `moduleId` (optional filter)
   - Output: Statistics object with:
     - Total modules, questions, users, videos
     - Answer statistics (total, correct, accuracy rate)
     - Module-specific statistics
     - User-specific statistics (for regular users)
   - Access: Authenticated users (role-based data)

#### **🔄 Bulk Operations API (1 endpoint)**

1. **POST `/api/bulk`**
   - Perform bulk operations
   - Input: Operation type, data array
   - Operations supported:
     - Bulk create modules
     - Bulk create questions
     - Bulk create videos
     - Bulk update questions
     - Bulk delete (modules, questions, videos)
   - Output: Operation results
   - Access: Admin only

#### **📦 Legacy Data APIs (2 endpoints)**

1. **GET `/api/data/load`**
   - Load all data (backward compatibility)
   - Output: Complete data object (modules + questions)
   - Access: Public

2. **POST `/api/data/save`**
   - Save all data (backward compatibility)
   - Input: Complete data object
   - Output: Success message
   - Access: Admin only

#### **📧 Email API (1 endpoint)**

1. **POST `/api/send-email`**
   - Send email with answers
   - Input: answers data, recipient email
   - Output: Success message
   - Access: Authenticated users
   - Features: Web3Forms integration

#### **🏥 Health Check API (1 endpoint)**

1. **GET `/api/health`**
   - Check API health status
   - Output: Health status object
   - Access: Public

---

## 🗄️ Database Structure

### **MongoDB Collections**

#### **1. Users Collection**
```typescript
{
  _id: ObjectId,
  username: string (unique, required),
  email: string (unique, optional),
  password: string (hashed, required),
  role: "user" | "admin" (default: "user"),
  createdAt: Date,
  updatedAt: Date
}
```

#### **2. Modules Collection**
```typescript
{
  _id: ObjectId,
  moduleId: number (unique, required),
  title: string (required),
  description: string,
  color: string,
  createdAt: Date,
  updatedAt: Date
}
```

#### **3. Questions Collection**
```typescript
{
  _id: ObjectId,
  questionId: number (unique, required),
  moduleId: number (required, references Module),
  question: string (required),
  options: string[] (required, min 2),
  correctAnswer: number (required, index of correct option),
  createdAt: Date,
  updatedAt: Date
}
```

#### **4. Answers Collection**
```typescript
{
  _id: ObjectId,
  userId: ObjectId (required, references User),
  questionId: number (required, references Question),
  moduleId: number (required),
  selectedAnswer: number (required),
  isCorrect: boolean (required),
  submittedAt: Date (default: now)
}
```

#### **5. Videos Collection**
```typescript
{
  _id: ObjectId,
  title: string (required),
  description: string,
  url: string (required),
  type: "english" | "punjabi" | "hindi" | "activity" (required),
  moduleId: number (optional, references Module),
  uploadedBy: ObjectId (references User),
  createdAt: Date,
  updatedAt: Date
}
```

#### **6. OTP Collection**
```typescript
{
  _id: ObjectId,
  email: string (required),
  otp: string (required),
  expiresAt: Date (required),
  createdAt: Date
}
```

#### **7. LoginHistory Collection**
```typescript
{
  _id: ObjectId,
  userId: ObjectId (required, references User),
  ipAddress: string,
  userAgent: string,
  loginAt: Date (default: now)
}
```

---

## 🔐 Authentication System

### **JWT-Based Authentication**

#### **Token Generation**
- Uses `jsonwebtoken` library
- Secret key from `JWT_SECRET` environment variable
- Token expiration: 7 days
- Token stored in HTTP-only cookies (secure)

#### **Password Security**
- Passwords hashed using `bcryptjs`
- Salt rounds: 10
- Never stored in plain text
- Never exposed in API responses

#### **Session Management**
- Tokens stored in HTTP-only cookies
- Automatic token validation on protected routes
- Token refresh on activity
- Secure cookie settings in production

#### **Role-Based Access Control**
- Two roles: `user` and `admin`
- Role checked on every protected endpoint
- Admin middleware for admin-only routes
- User can only access own data (unless admin)

#### **OTP Email Verification (Optional)**
- OTP generation with expiration (10 minutes)
- Email delivery via Web3Forms
- OTP validation before account activation
- Automatic cleanup of expired OTPs

---

## 🔄 User Flows

### **1. New User Registration Flow**

```
1. User clicks "Register"
2. Fill registration form (username, password, email)
3. Submit → POST /api/auth/register
4. Backend validates input
5. Password hashed with bcrypt
6. User created in database
7. JWT token generated
8. Token stored in HTTP-only cookie
9. User redirected to home page
10. User can now access protected features
```

### **2. User Login Flow**

```
1. User clicks "Login"
2. Enter username and password
3. Submit → POST /api/auth/login
4. Backend validates credentials
5. Password verified against hash
6. User role retrieved
7. JWT token generated
8. Token stored in HTTP-only cookie
9. Login history recorded
10. User redirected based on role
```

### **3. Taking a Quiz Flow**

```
1. User selects a module
2. Frontend fetches questions → GET /api/questions?moduleId=X
3. Questions displayed one by one
4. User selects answer
5. User clicks "Submit Answer"
6. Frontend sends → POST /api/answers
7. Backend validates answer
8. Correctness calculated
9. Answer saved to database
10. Result displayed to user
11. Progress updated
```

### **4. Admin Creating Content Flow**

```
1. Admin logs in
2. Admin navigates to admin panel
3. Admin clicks "Create Module"
4. Fill module form (title, description, color)
5. Submit → POST /api/modules
6. Backend validates admin role
7. Module created in database
8. Admin can now add questions to module
9. Admin creates questions → POST /api/questions
10. Questions linked to module
```

### **5. Viewing Statistics Flow**

```
1. User/Admin navigates to statistics
2. Frontend requests → GET /api/statistics
3. Backend checks user role
4. If admin: Returns all statistics
5. If user: Returns only user's statistics
6. Statistics calculated:
   - Total modules, questions, users
   - Answer accuracy rates
   - Module completion status
7. Data displayed in dashboard
```

---

## 🛠️ Admin Features

### **Content Management**

#### **Module Management**
- Create new modules with custom colors
- Edit existing modules
- Delete modules (cascades to questions)
- View all modules in list/grid

#### **Question Management**
- Create questions with multiple-choice options
- Set correct answers
- Link questions to modules
- Edit existing questions
- Delete questions
- Bulk operations for efficiency

#### **Video Management**
- Upload video metadata
- Organize videos by module
- Categorize by type (English, Punjabi, Hindi, Activity)
- Edit video information
- Delete videos

### **User Management**

#### **User Administration**
- View all registered users
- Search and filter users
- View user profiles
- Edit user information
- Change user roles
- Delete user accounts
- View user login history

### **Analytics & Statistics**

#### **Comprehensive Statistics**
- Total modules count
- Total questions count
- Total users count
- Total videos count
- Overall answer accuracy rates
- Module-specific statistics
- User-specific performance
- Completion rates

### **Bulk Operations**

#### **Efficient Content Updates**
- Bulk create modules
- Bulk create questions
- Bulk create videos
- Bulk update questions
- Bulk delete operations
- Import/export functionality

---

## 💻 Technical Stack

### **Frontend**
- **Framework**: Next.js 14.2.5 (React 18.3.1)
- **Language**: TypeScript 5.5.4
- **Styling**: Tailwind CSS 3.4.7
- **State Management**: React Hooks (useState, useEffect)
- **API Communication**: Fetch API
- **Image Handling**: Next.js Image component

### **Backend**
- **Runtime**: Node.js
- **Framework**: Next.js API Routes
- **Language**: TypeScript
- **Database**: MongoDB 8.3.1 (via Mongoose)
- **Authentication**: JWT (jsonwebtoken 9.0.2)
- **Password Hashing**: bcryptjs 2.4.3
- **Email**: Web3Forms integration

### **Database**
- **Type**: MongoDB (MongoDB Atlas for production)
- **ODM**: Mongoose 8.3.1
- **Connection**: Connection pooling with caching

### **Deployment**
- **Platform**: Vercel
- **Build Tool**: Next.js built-in
- **Environment**: Production-ready configuration

### **Development Tools**
- **Package Manager**: npm
- **Type Checking**: TypeScript
- **Linting**: ESLint with Next.js config
- **Script Runner**: tsx for TypeScript scripts

---

## 🔗 How Everything Works Together

### **Architecture Overview**

```
┌─────────────────┐
│   User Browser  │
└────────┬────────┘
         │
         │ HTTP Requests
         ▼
┌─────────────────┐
│  Next.js Frontend│
│  (React/TypeScript)│
└────────┬────────┘
         │
         │ API Calls
         ▼
┌─────────────────┐
│  Next.js API    │
│  Routes (Backend)│
└────────┬────────┘
         │
         │ Database Queries
         ▼
┌─────────────────┐
│   MongoDB       │
│   (via Mongoose)│
└─────────────────┘
```

### **Request Flow Example: Taking a Quiz**

1. **User Action**: User selects answer and clicks submit
2. **Frontend**: Captures answer, prepares API request
3. **API Call**: `POST /api/answers` with answer data
4. **Authentication**: Middleware validates JWT token from cookie
5. **Authorization**: Checks if user can submit answers
6. **Validation**: Validates input data (questionId, selectedAnswer)
7. **Database Query**: Fetches question to get correct answer
8. **Processing**: Compares selected answer with correct answer
9. **Database Write**: Saves answer with correctness status
10. **Response**: Returns answer object with isCorrect flag
11. **Frontend Update**: Displays result, updates progress

### **Data Flow: Module Display**

1. **Page Load**: User visits home page
2. **API Call**: `GET /api/modules`
3. **Database Query**: Fetches all modules from MongoDB
4. **Response**: Returns array of module objects
5. **Frontend Render**: Displays modules in grid/list
6. **User Interaction**: User clicks module
7. **Navigation**: Loads questions for that module
8. **API Call**: `GET /api/questions?moduleId=X`
9. **Quiz Display**: Shows questions one by one

### **Security Flow: Protected Route**

1. **User Request**: Accesses protected endpoint
2. **Middleware Check**: Extracts JWT from cookie
3. **Token Validation**: Verifies token signature and expiration
4. **User Lookup**: Fetches user from database using token payload
5. **Role Check**: Validates user role for requested action
6. **Authorization**: Grants or denies access
7. **Request Processing**: If authorized, processes request
8. **Response**: Returns data or error message

### **Admin Flow: Creating Content**

1. **Admin Login**: Admin authenticates
2. **Role Verification**: System recognizes admin role
3. **Admin Panel Access**: Admin navigates to management panel
4. **Content Creation**: Admin fills form (e.g., new module)
5. **API Call**: `POST /api/modules` with admin token
6. **Admin Check**: Middleware verifies admin role
7. **Validation**: Validates module data
8. **Database Write**: Creates module in MongoDB
9. **Response**: Returns created module
10. **UI Update**: Admin sees new module in list

---

## 📊 Key Features Summary

### **For Regular Users**
✅ Browse educational modules  
✅ Take interactive quizzes  
✅ Watch educational videos  
✅ Track personal progress  
✅ View own statistics  
✅ Submit answers and get feedback  
✅ Review answer history  

### **For Administrators**
✅ All regular user features  
✅ Create and manage modules  
✅ Create and manage questions  
✅ Upload and manage videos  
✅ View all users  
✅ Manage user accounts  
✅ View comprehensive statistics  
✅ Perform bulk operations  
✅ Track login history  
✅ Export/import data  

---

## 🔒 Security Features

- ✅ JWT-based authentication
- ✅ HTTP-only cookies for token storage
- ✅ Password hashing with bcrypt
- ✅ Role-based access control
- ✅ Input validation on all endpoints
- ✅ SQL injection prevention (MongoDB)
- ✅ XSS protection (React)
- ✅ CSRF protection (SameSite cookies)
- ✅ Secure environment variables
- ✅ Token expiration (7 days)

---

## 📈 Performance Features

- ✅ Database connection pooling
- ✅ Cached database connections
- ✅ Efficient MongoDB queries
- ✅ Optimized API responses
- ✅ Next.js automatic code splitting
- ✅ Image optimization (Next.js Image)
- ✅ Server-side rendering where appropriate
- ✅ Client-side caching

---

## 🎓 Educational Content

### **Module Topics**
The platform covers various NCD (Non-Communicable Diseases) topics including:
- Heart disease
- Stroke
- Diabetes
- Cancer
- Risk factors (diet, exercise, smoking, etc.)
- Prevention strategies
- Early detection methods

### **Question Types**
- Multiple-choice questions
- Single correct answer
- Educational explanations
- Module-specific content

### **Video Content**
- Educational videos in multiple languages
- Activity demonstration videos
- Module-specific video content
- Organized by type and module

---

## 🚀 Deployment & Production

### **Environment Variables Required**
- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT tokens
- `NODE_ENV`: Environment (production/development)
- `WEB3FORMS_ACCESS_KEY`: Email service key (optional)
- `NEXT_PUBLIC_APP_URL`: Application URL

### **Production Features**
- ✅ Optimized builds
- ✅ Error handling
- ✅ Logging
- ✅ Health check endpoints
- ✅ Database connection management
- ✅ Secure cookie settings

---

## 📝 Notes

- All API endpoints return consistent JSON responses
- Error messages are user-friendly
- All timestamps are in UTC
- Database uses ObjectId for unique identifiers
- Frontend uses numeric IDs for compatibility
- All passwords are hashed before storage
- Tokens are automatically refreshed
- Session persists across page reloads

---

## 🔄 Future Enhancements (Potential)

- Real-time notifications
- Advanced analytics dashboard
- Certificate generation for completion
- Social sharing features
- Mobile app version
- Offline mode support
- Multi-language support
- Advanced reporting
- Video streaming integration
- Discussion forums

---

**Last Updated**: January 2026  
**Version**: 1.0.0  
**Status**: Production Ready ✅
