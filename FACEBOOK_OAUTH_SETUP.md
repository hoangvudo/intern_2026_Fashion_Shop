# Facebook OAuth2 Login - Setup Guide

## 🚀 Overview
This document explains how to set up Facebook OAuth2 login for the Fashion Shop application.

## 📋 Prerequisites
- Facebook Developer Account
- Localhost environment (or deployed server URL)

## 🔧 Setup Steps

### Step 1: Create Facebook App

1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Click "My Apps" → "Create App"
3. Choose app type: **Consumer**
4. Fill in app details:
   - App Name: `Fashion Shop` (or your app name)
   - App Contact Email: your email
   - App Purpose: Select appropriate category

### Step 2: Get App ID and App Secret

1. In your app dashboard, go to **Settings** → **Basic**
2. Copy your **App ID** and **App Secret**
3. Keep these credentials safe (never expose in production code)

### Step 3: Configure OAuth Redirect URI

1. In app dashboard, go to **Settings** → **Basic**
2. Add Platform:
   - Select **Website**
   - Site URL: `http://localhost:3000` (for development)

3. Go to **Products** → Add **Facebook Login**

4. In Facebook Login settings, go to **Settings**:
   - Valid OAuth Redirect URIs: Add these URIs:
     ```
     http://localhost:8080/api/auth/oauth2/facebook/callback
     http://localhost:3000/oauth2/callback
     ```

5. Go to **Settings** → **Basic**:
   - App Domains: `localhost`

### Step 4: Update Backend Configuration

Update `BE/src/main/resources/application.yml`:

```yaml
oauth2:
  google:
    client-id: YOUR_GOOGLE_CLIENT_ID
    client-secret: YOUR_GOOGLE_CLIENT_SECRET
    redirect-uri: http://localhost:8080/api/auth/oauth2/google/callback
  facebook:
    client-id: YOUR_FACEBOOK_APP_ID
    client-secret: YOUR_FACEBOOK_APP_SECRET
    redirect-uri: http://localhost:8080/api/auth/oauth2/facebook/callback
```

### Step 5: Update Frontend Configuration

Update Facebook login URLs in:

**`FE/src/pages/Login.jsx`**:
```javascript
const handleFacebookLogin = () => {
  window.location.href =
    "https://www.facebook.com/v18.0/dialog/oauth" +
    "?client_id=YOUR_FACEBOOK_APP_ID" +  // Replace with your App ID
    "&redirect_uri=http://localhost:8080/api/auth/oauth2/facebook/callback" +
    "&response_type=code" +
    "&scope=email%20public_profile"
}
```

**`FE/src/pages/Register.jsx`**:
```javascript
const handleFacebookRegister = () => {
  window.location.href =
    "https://www.facebook.com/v18.0/dialog/oauth" +
    "?client_id=YOUR_FACEBOOK_APP_ID" +  // Replace with your App ID
    "&redirect_uri=http://localhost:8080/api/auth/oauth2/facebook/callback" +
    "&response_type=code" +
    "&scope=email%20public_profile"
}
```

## 📝 OAuth2 Flow

### Facebook Login Flow:

1. **User clicks Facebook Login button**
   ```
   Frontend: Login.jsx or Register.jsx
   ↓
   Redirect to: https://www.facebook.com/v18.0/dialog/oauth?client_id=...&redirect_uri=...
   ```

2. **Facebook shows login dialog**
   ```
   User logs in to Facebook (or confirms if already logged in)
   ↓
   User grants permissions (email, public profile)
   ```

3. **Facebook redirects back to backend**
   ```
   GET /api/auth/oauth2/facebook/callback?code=...
   ↓
   Backend (OAuth2Controller.facebookCallback)
   ```

4. **Backend exchanges code for access token**
   ```
   POST https://graph.instagram.com/oauth/access_token
   Params: code, client_id, client_secret, redirect_uri
   ↓
   Response: { access_token: "...", token_type: "bearer" }
   ```

5. **Backend fetches user profile**
   ```
   GET https://graph.facebook.com/me?fields=id,name,email,picture&access_token=...
   ↓
   Response: { id: "...", email: "...", name: "...", picture: {...} }
   ```

6. **Backend creates/updates user in database**
   ```
   User record created with:
   - email
   - fullName
   - passwordHash: "[oauth2-facebook]" (OAuth users don't use password)
   - isVerified: true (Facebook email is verified)
   - role: "USER"
   ```

7. **Backend returns JWT tokens**
   ```
   Redirect to: http://localhost:3000/oauth2/callback?accessToken=...&refreshToken=...
   ↓
   Frontend stores tokens in authStore
   ```

## 🔐 Security Considerations

### 1. Never expose secrets in client code
- App Secret should ONLY be on backend
- Frontend should never contain App Secret

### 2. HTTPS in production
- Use HTTPS URLs in production
- Update redirect URIs in Facebook Developer Console

### 3. Scope limitations
- Current scope: `email public_profile`
- These scopes are read-only and safe
- Don't request unnecessary permissions

### 4. Token security
- JWT tokens have expiration times
- Refresh tokens are stored in DB with user association
- Each token is bound to the user who created it

## 🧪 Testing

### Local Testing:
1. Start backend: `mvn spring-boot:run` (from BE directory)
2. Start frontend: `npm run dev` (from FE directory)
3. Go to http://localhost:3000/login
4. Click "Facebook" button
5. Login with your Facebook account
6. Should redirect back and show logged in state

### Common Issues:

**Issue: "Invalid OAuth redirect URI"**
- Solution: Check that redirect URI matches exactly in Facebook Dev Console
- Include protocol (http/https) and trailing slash

**Issue: "Email permission denied"**
- Solution: User didn't grant email permission in Facebook dialog
- User must be logged in to see permission prompt

**Issue: "App not set up properly"**
- Solution: Make sure Facebook Login product is added to app
- Check Settings → Basic → App Domains includes localhost

## 🚀 Production Deployment

1. Create separate Facebook App for production
2. Update Backend config:
   ```yaml
   oauth2:
     facebook:
       client-id: YOUR_PROD_APP_ID
       client-secret: YOUR_PROD_APP_SECRET
       redirect-uri: https://yourdomain.com/api/auth/oauth2/facebook/callback
   ```

3. Update Frontend config:
   ```javascript
   const handleFacebookLogin = () => {
     window.location.href =
       "https://www.facebook.com/v18.0/dialog/oauth" +
       "?client_id=YOUR_PROD_APP_ID" +
       "&redirect_uri=https://yourdomain.com/api/auth/oauth2/facebook/callback" +
       "&response_type=code" +
       "&scope=email%20public_profile"
   }
   ```

4. In Facebook Developer Console:
   - Update Valid OAuth Redirect URIs
   - Update App Domains
   - Verify business requirements

## 📚 Files Modified

### Backend:
- `BE/src/main/resources/application.yml` - Added Facebook OAuth2 config
- `BE/src/main/java/com/fashion/backend/dto/FacebookUserInfo.java` - New DTO for Facebook profile
- `BE/src/main/java/com/fashion/backend/service/OAuth2Service.java` - Added Facebook methods
- `BE/src/main/java/com/fashion/backend/controller/OAuth2Controller.java` - Added Facebook callback endpoint

### Frontend:
- `FE/src/pages/Login.jsx` - Added Facebook login handler
- `FE/src/pages/Register.jsx` - Added Facebook register handler

## 🔗 Useful Links
- [Facebook Login Documentation](https://developers.facebook.com/docs/facebook-login)
- [Facebook Graph API](https://developers.facebook.com/docs/graph-api)
- [Facebook Permissions](https://developers.facebook.com/docs/facebook-login/permissions)
