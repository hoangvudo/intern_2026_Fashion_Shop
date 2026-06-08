# Zero Fashion - Frontend

Frontend application cho Zero Fashion được xây dựng với Vite + React + Framer Motion.

## 🚀 Công nghệ sử dụng

- **Vite** - Build tool nhanh và hiện đại
- **React 18** - Thư viện UI
- **React Router DOM** - Routing với AnimatePresence
- **Axios** - HTTP client với interceptors
- **Zustand** - State management (auth store)
- **React Hook Form** - Form management
- **Yup** - Schema validation
- **Framer Motion** - Animations & transitions
- **React Hot Toast** - Toast notifications
- **Tailwind CSS** - Utility-first CSS (via CDN)
- **ESLint** - Code linting

## 📦 Cài đặt

```bash
npm install
```

## 🎬 Chạy development server

```bash
npm run dev
```

Server sẽ chạy tại `http://localhost:3000`

## 🏗️ Build production

```bash
npm run build
```

## 👀 Preview production build

```bash
npm run preview
```

## 📁 Cấu trúc thư mục

```
src/
├── components/          # Reusable components
│   ├── TopNav.jsx      # Navigation bar
│   ├── Footer.jsx      # Footer
│   └── AnimatedPage.jsx # Page transition wrapper
├── pages/              # Page components
│   ├── Home.jsx
│   ├── Login.jsx       # Login form với animations
│   ├── Register.jsx    # Register form với animations
│   └── VerifyEmail.jsx # Email verification page
├── services/           # API services
│   ├── api.js         # Axios instance với interceptors
│   └── authService.js # Authentication API calls
├── store/             # Zustand stores
│   └── authStore.js   # Auth state management
├── schemas/           # Yup validation schemas
│   ├── loginSchema.js
│   └── registerSchema.js
├── hooks/             # Custom hooks
│   └── useCountdown.js # Countdown timer hook
├── utils/             # Utility functions
│   └── passwordStrength.js # Password strength calculator
├── assets/            # Static assets
│   └── logo.jpg
├── App.jsx            # Main app với AnimatePresence
├── App.css
├── main.jsx           # Entry point
└── index.css
```

## ✨ Tính năng

### 🔐 Authentication
- ✅ Login với email/password
- ✅ Register với validation đầy đủ
- ✅ Email verification flow
- ✅ JWT token management (access + refresh)
- ✅ Auto refresh token khi expired
- ✅ Persistent auth state với Zustand
- ✅ Protected routes
- ✅ OAuth placeholders (Google/Facebook)

### 📝 Form Features
- ✅ React Hook Form integration
- ✅ Yup schema validation
- ✅ Real-time validation (onBlur)
- ✅ Password strength meter
- ✅ Email availability check (debounced)
- ✅ Toggle show/hide password
- ✅ Inline error messages
- ✅ Loading states với spinners

### 🎨 Animations (Framer Motion)
- ✅ Page transitions (fade + slide)
- ✅ Form field stagger animations
- ✅ Button hover & tap effects
- ✅ Error message animations
- ✅ Smooth loading states
- ✅ Social button interactions

### 🔔 Notifications
- ✅ Toast notifications (success/error/loading)
- ✅ Contextual error messages
- ✅ Status code handling (401, 403, 429)

### ⏱️ Email Verification
- ✅ Countdown timer (60s)
- ✅ Resend email functionality
- ✅ Disabled state during countdown
- ✅ Deep link handling ready

## 🎭 Framer Motion Animations

### Page Transitions
```javascript
// Fade in/out với slide effect
initial: { opacity: 0, y: 20 }
animate: { opacity: 1, y: 0 }
exit: { opacity: 0, y: -20 }
```

### Form Animations
- **Stagger effect**: Các field xuất hiện lần lượt
- **Hover effects**: Scale + lift trên buttons
- **Tap effects**: Scale down khi click
- **Error animations**: Fade in từ trên xuống

### Button Interactions
```javascript
whileHover={{ scale: 1.02, y: -2 }}
whileTap={{ scale: 0.98 }}
```

## 🔒 Security Features

- **Access Token**: Lưu trong memory (Zustand state)
- **Refresh Token**: Persist trong localStorage
- **Auto Refresh**: Tự động làm mới token khi hết hạn
- **httpOnly Cookie Support**: Ready cho backend implementation
- **CSRF Protection**: Ready với withCredentials
- **XSS Protection**: No eval, sanitized inputs

## 🌐 API Integration

### Base URL
```javascript
baseURL: '/api'  // Proxy to http://localhost:8080
```

### Endpoints
- `POST /auth/login` - Login
- `POST /auth/register` - Register
- `POST /auth/refresh` - Refresh token
- `POST /auth/logout` - Logout
- `POST /auth/check-email` - Check email availability
- `POST /auth/resend-verification` - Resend verification email
- `POST /auth/google` - Google OAuth
- `POST /auth/facebook` - Facebook OAuth

## 🎨 Styling

Project sử dụng **Tailwind CSS** qua CDN với custom configuration:
- Material Design 3 color system
- Custom spacing scale
- Typography system (Manrope + Hanken Grotesk)
- Dark mode support
- Responsive breakpoints

## 🔧 Configuration

### Vite Proxy
```javascript
server: {
  port: 3000,
  proxy: {
    '/api': {
      target: 'http://localhost:8080',
      changeOrigin: true,
      secure: false,
    }
  }
}
```

### Environment Variables
Tạo file `.env` nếu cần:
```env
VITE_API_URL=http://localhost:8080
VITE_GOOGLE_CLIENT_ID=your_google_client_id
VITE_FACEBOOK_APP_ID=your_facebook_app_id
```

## 🧪 Testing

```bash
# Run tests (khi có)
npm run test
```

## 📱 Responsive Design

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

Tất cả components đều responsive và mobile-first.

## 🚀 Deployment

### Build
```bash
npm run build
```

### Preview
```bash
npm run preview
```

### Deploy to Vercel/Netlify
```bash
# Vercel
vercel

# Netlify
netlify deploy --prod
```

## 📄 License

© 2024 Zero Fashion. All rights reserved.

## 👥 Contributors

- Development Team - Zero Fashion

## 🐛 Bug Reports

Vui lòng báo cáo bugs qua [GitHub Issues](https://github.com/your-repo/issues)

## 📞 Support

Email: support@zerofashion.com

