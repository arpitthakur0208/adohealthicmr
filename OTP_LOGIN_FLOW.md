# OTP Login Flow (In-Memory – No MongoDB Required)

## How It Works

- **Request OTP** (`POST /api/auth/request-otp`): Stores OTP in memory (Map), sends email. No database.
- **Verify OTP** (`POST /api/auth/verify-otp`): Checks OTP from memory, deletes it after use, issues JWT and sets cookie.

## Features

- No MongoDB needed for OTP storage
- OTP expires in **5 minutes**
- One-time use (OTP is deleted after successful verify)
- If MongoDB is available, user role is loaded from DB (admin/user)
- If MongoDB is unavailable, user gets role `user` and `userId` is `otp:email`

## Files

| File | Purpose |
|------|--------|
| `src/app/utils/otp-store.ts` | In-memory Map, `setOTP`, `verifyAndConsumeOTP`, `generateOTP` |
| `src/app/api/auth/request-otp/route.ts` | Uses in-memory store, sends email |
| `src/app/api/auth/verify-otp/route.ts` | Verifies from memory, optional MongoDB for role, issues JWT |
| `backend/lib/auth.ts` | `getCurrentUser` treats `userId` starting with `otp:` as valid without DB |

## Flow

1. User enters email + username → **Request OTP**
2. Backend: `setOTP(email, username)` → store in Map, send email (or log OTP)
3. User enters OTP → **Verify OTP**
4. Backend: `verifyAndConsumeOTP(email, otp)` → if valid, delete OTP
5. If MongoDB connected: load User by email+username → use `_id`, `role`
6. If no User in DB: use `userId = otp:email`, `role = user`
7. Issue JWT, set cookie, return user + permissions

## Limitations (In-Memory)

- Server restart clears all OTPs
- Not suitable for multiple server instances (each has its own Map)
- For production at scale, use **Redis** (same API: set with expiry, get, delete)

## Optional: Switch to Redis Later

Replace `otp-store.ts` with Redis:

```ts
// Example: Redis
await redis.set(`otp:${email}`, JSON.stringify({ otp, username }), 'EX', 300);
const data = await redis.get(`otp:${email}`);
await redis.del(`otp:${email}`);
```

Frontend and route URLs stay the same; only the store implementation changes.
