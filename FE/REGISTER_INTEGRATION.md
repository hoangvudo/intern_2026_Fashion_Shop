# Register Page - Backend Integration

## ✅ Backend DTO Verification

### RegisterRequest.java
```java
{
  fullName: String,      // ✅ Matches frontend
  email: String,         // ✅ Matches frontend  
  phone: String,         // ✅ Matches frontend (NOT phoneNumber)
  password: String,      // ✅ Matches frontend
  confirmPassword: String // ✅ Matches frontend
}
```

## Frontend Implementation

### Form Fields
- **fullName**: Text input with validation (2-50 chars, letters only)
- **email**: Email input with format validation
- **phone**: Phone input with Vietnamese format (0123456789 or +84...)
- **password**: Password input with strength meter
- **confirmPassword**: Password confirmation with match validation
- **agreeToTerms**: Checkbox (frontend only, not sent to backend)

### Validation Rules (Yup Schema)
```javascript
fullName: 
  - Required
  - Min 2 chars, Max 50 chars
  - Only letters and spaces
  
email:
  - Required
  - Valid email format
  
phone:
  - Required
  - Vietnamese format: 0xxxxxxxxx or +84xxxxxxxxx
  
password:
  - Required
  - Min 6 chars (matches backend)
  - Must contain: uppercase, lowercase, number
  
confirmPassword:
  - Required
  - Must match password
  
agreeToTerms:
  - Must be true (checked)
```

### Password Strength Meter
- **Weak (33%)**: < 3 criteria met → Red
- **Medium (66%)**: 3-4 criteria met → Yellow
- **Strong (100%)**: 5+ criteria met → Green

Criteria:
1. Length >= 8
2. Length >= 12
3. Contains lowercase
4. Contains uppercase
5. Contains numbers
6. Contains special chars

### API Integration

#### Register Endpoint
```javascript
POST /auth/register
Body: {
  fullName: string,
  email: string,
  phone: string,
  password: string,
  confirmPassword: string
}

Response: {
  message: "Registration successful"
}
```

#### Flow
1. User fills form
2. Frontend validates with Yup schema
3. Remove `agreeToTerms` before sending
4. Send to backend `/auth/register`
5. On success: Navigate to `/verify-email` with email
6. On error: Show toast notification

### OAuth Integration
- Google OAuth: Redirects to `http://localhost:8080/oauth2/authorization/google`
- Facebook OAuth: Not yet implemented

## Features
✅ Real-time password strength indicator
✅ Show/hide password toggle
✅ Form validation with error messages
✅ Loading state during submission
✅ Toast notifications for success/error
✅ Responsive design
✅ Material Design 3 styling
✅ Backend DTO compatibility verified
