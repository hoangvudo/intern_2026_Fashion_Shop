# Login Page - Backend Integration

## ✅ Backend DTO Verification

### LoginRequest.java
```java
{
  email: String,
  password: String
}
```

### LoginResponse.java
```java
{
  accessToken: String,   // JWT token - expires in 15 minutes
  refreshToken: String   // Refresh token - expires in 7 days
}
```

## ⚠️ Important Changes Made

### 1. Password Validation
- **Changed**: Min password length from 8 → 6 characters
- **Reason**: Backend requires minimum 6 characters
- **File**: `loginSchema.js`

### 2. Login Response Handling
- **Backend returns**: Only `accessToken` and `refreshToken`
- **No user object** in response
- **Frontend**: Stores tokens, user info will be decoded from JWT or fetched separately

### 3. API Call Structure
```javascript
// Before (WRONG)
authService.login(data) // sends entire form object

// After (CORRECT)
authService.login(data.email, data.password) // sends email and password separately
```

## Frontend Implementation

### Form Fields
- **email**: Email input with validation
- **password**: Password input with show/hide toggle

### Validation Rules (Yup Schema)
```javascript
email:
  - Required
  - Valid email format
  - Regex pattern validation
  
password:
  - Required
  - Min 6 chars (matches backend requirement)
```

### API Integration

#### Login Endpoint
```javascript
POST /api/auth/login
Body: {
  email: string,
  password: string
}

Response: {
  accessToken: string,
  refreshToken: string
}
```

#### Flow
1. User fills email and password
2. Frontend validates with Yup schema
3. Call `authService.login(email, password)`
4. Backend returns tokens only (no user object)
5. Store tokens in authStore
6. Navigate to home page
7. Show success toast

### Error Handling
- Network errors
- Invalid credentials (401)
- Rate limiting (429)
- Server errors (500)

### OAuth Integration
- Google OAuth: Redirects to `http://localhost:8080/oauth2/authorization/google`
- Facebook OAuth: Not yet implemented

## Features
✅ Email and password validation
✅ Show/hide password toggle
✅ Form validation with error messages
✅ Loading state during submission
✅ Toast notifications for success/error
✅ Responsive design
✅ Material Design 3 styling
✅ Backend DTO compatibility verified
✅ Forgot password link
✅ Register link

## Security Features
- reCAPTCHA indicator
- Rate limiting handled by backend
- JWT token storage in localStorage (via Zustand persist)
- Refresh token rotation
