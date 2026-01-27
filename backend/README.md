# Backend Directory

This directory contains all backend-related code for the ADO Health ICMR application.

## Structure

```
backend/
├── lib/           # Backend utilities and helpers
│   ├── db.ts      # MongoDB connection utility
│   └── auth.ts    # Authentication and authorization utilities
├── models/        # Mongoose database models
│   ├── User.ts    # User model
│   ├── Module.ts  # Module model
│   ├── Question.ts # Question model
│   └── Answer.ts   # Answer model
└── scripts/       # Utility scripts
    ├── migrate-data.ts    # Data migration script
    └── create-admin.ts     # Admin user creation script
```

## Usage

### Database Connection

```typescript
import connectDB from '@/backend/lib/db';

// In your API route
await connectDB();
```

### Models

```typescript
import User from '@/backend/models/User';
import Module from '@/backend/models/Module';
import Question from '@/backend/models/Question';
import Answer from '@/backend/models/Answer';
```

### Authentication

```typescript
import { getCurrentUser, requireAuth, requireAdmin } from '@/backend/lib/auth';

// Get current user
const user = await getCurrentUser(request);

// Protect route (requires authentication)
export const GET = requireAuth(async (request, user) => {
  // Handler code
});

// Protect route (requires admin)
export const POST = requireAdmin(async (request, user) => {
  // Handler code
});
```

## Scripts

### Migrate Data

Import existing data from JSON file to MongoDB:

```bash
npm run migrate
```

### Create Admin User

Create an admin user interactively:

```bash
npm run create-admin
```

## Notes

- All API routes are located in `src/app/api/` (Next.js App Router requirement)
- The backend folder contains reusable backend code that can be imported by API routes
- Models use Mongoose for MongoDB interaction
- Authentication uses JWT tokens stored in HTTP-only cookies
