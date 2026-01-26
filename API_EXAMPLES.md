# API Examples - Login with Roles

## Login API Endpoint

**Endpoint:** `POST /api/auth/login`

**Description:** Login API that supports two roles: `admin` and `user`

### Request

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "adminuser",
    "password": "password123"
  }'
```

### Response Examples

#### Admin Login Success

```json
{
  "success": true,
  "message": "Admin login successful",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "username": "adminuser",
    "email": "admin@example.com",
    "role": "admin"
  },
  "permissions": {
    "canManageModules": true,
    "canManageQuestions": true,
    "canSubmitAnswers": true,
    "canViewAllAnswers": true,
    "canDeleteData": true,
    "isAdmin": true,
    "isUser": false
  }
}
```

#### User Login Success

```json
{
  "success": true,
  "message": "User login successful",
  "user": {
    "id": "507f1f77bcf86cd799439012",
    "username": "regularuser",
    "email": "user@example.com",
    "role": "user"
  },
  "permissions": {
    "canManageModules": false,
    "canManageQuestions": false,
    "canSubmitAnswers": true,
    "canViewAllAnswers": false,
    "canDeleteData": false,
    "isAdmin": false,
    "isUser": true
  }
}
```

#### Error Response (Invalid Credentials)

```json
{
  "error": "Invalid credentials",
  "message": "Username or password is incorrect"
}
```

#### Error Response (Missing Fields)

```json
{
  "error": "Username and password are required",
  "message": "Please provide both username and password"
}
```

## Role Permissions

### Admin Role (`role: "admin"`)
- ✅ Can manage modules (create, update, delete)
- ✅ Can manage questions (create, update, delete)
- ✅ Can submit answers
- ✅ Can view all users' answers
- ✅ Can delete data

### User Role (`role: "user"`)
- ❌ Cannot manage modules
- ❌ Cannot manage questions
- ✅ Can submit answers
- ❌ Cannot view other users' answers
- ❌ Cannot delete data

## Usage Examples

### JavaScript/TypeScript

```typescript
// Login as admin
const loginAdmin = async () => {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username: 'adminuser',
      password: 'password123',
    }),
  });

  const data = await response.json();
  
  if (data.success) {
    console.log('Logged in as:', data.user.role); // 'admin' or 'user'
    console.log('Is admin:', data.permissions.isAdmin);
    console.log('Can manage modules:', data.permissions.canManageModules);
  }
};

// Login as regular user
const loginUser = async () => {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username: 'regularuser',
      password: 'password123',
    }),
  });

  const data = await response.json();
  
  if (data.success) {
    console.log('Logged in as:', data.user.role); // 'user'
    console.log('Can submit answers:', data.permissions.canSubmitAnswers);
  }
};
```

### React Example

```tsx
import { useState } from 'react';

function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (data.success) {
        setUser(data.user);
        
        // Check role and redirect accordingly
        if (data.user.role === 'admin') {
          // Redirect to admin dashboard
          window.location.href = '/admin';
        } else {
          // Redirect to user dashboard
          window.location.href = '/dashboard';
        }
      } else {
        alert(data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('An error occurred during login');
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit">Login</button>
      
      {user && (
        <div>
          <p>Welcome, {user.username}!</p>
          <p>Role: {user.role}</p>
          {user.role === 'admin' && <p>You have admin privileges</p>}
        </div>
      )}
    </form>
  );
}
```

## Testing with Different Roles

### Create Admin User

```bash
npm run create-admin
```

Or via API:

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "adminuser",
    "password": "password123",
    "email": "admin@example.com",
    "role": "admin"
  }'
```

### Create Regular User

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "regularuser",
    "password": "password123",
    "email": "user@example.com",
    "role": "user"
  }'
```

Note: If `role` is not specified during registration, it defaults to `"user"`.
