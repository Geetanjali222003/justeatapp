# FIXED: Duplicate Endpoint Mapping Error

## ❌ Problem
Application was failing to start with error:
```
Ambiguous mapping. Cannot map 'passwordResetController' method 
com.CAPSTONEPROJECT.CAPSTONE.controller.PasswordResetController#resetPassword(ResetPasswordRequestDTO)
to {POST [/auth/reset-password]}: There is already 'authController' bean method
com.CAPSTONEPROJECT.CAPSTONE.controller.AuthController#resetPassword(Map) mapped.
```

## ✅ Solution
Removed duplicate OTP and password reset endpoints from `AuthController`. These functionalities are now handled exclusively by `PasswordResetController`.

## 📋 Current Endpoint Configuration

### **AuthController** (`/auth`)
Handles authentication operations:
- ✅ `POST /auth/login` - User login with JWT generation
- ✅ `POST /auth/register` - User registration

### **PasswordResetController** (`/auth`)
Handles password reset operations:
- ✅ `POST /auth/forgot-password` - Send OTP to email
- ✅ `POST /auth/reset-password` - Reset password using OTP

## 🔧 Changes Made

### File: `AuthController.java`

**Removed:**
- `@PostMapping("/send-otp")` endpoint
- `@PostMapping("/reset-password")` endpoint  
- `PasswordResetService` dependency
- `Map` import

**Kept:**
- `POST /auth/login`
- `POST /auth/register`
- `@CrossOrigin(origins = "http://localhost:3000")`

### Final AuthController Structure:
```java
@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "http://localhost:3000")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> login(@RequestBody LoginRequestDTO request) {
        // ... JWT authentication logic
    }

    @PostMapping("/register")
    public ResponseEntity<String> register(@Valid @RequestBody RegisterRequestDTO request) {
        authService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body("User registered successfully");
    }
}
```

## 📍 Complete API Endpoint Map

| Endpoint | Method | Controller | Description |
|----------|--------|------------|-------------|
| `/auth/login` | POST | AuthController | Login with username/password, get JWT |
| `/auth/register` | POST | AuthController | Register new user with role |
| `/auth/forgot-password` | POST | PasswordResetController | Send OTP to email |
| `/auth/reset-password` | POST | PasswordResetController | Reset password using OTP |

## 🧪 Testing

### 1. Registration
```bash
POST http://localhost:8083/auth/register
Content-Type: application/json

{
  "username": "testuser",
  "email": "test@example.com",
  "password": "Pass@123",
  "role": "CUSTOMER"
}
```

### 2. Login
```bash
POST http://localhost:8083/auth/login
Content-Type: application/json

{
  "username": "testuser",
  "password": "Pass@123"
}
```

### 3. Forgot Password (Send OTP)
```bash
POST http://localhost:8083/auth/forgot-password
Content-Type: application/json

{
  "email": "test@example.com"
}
```

### 4. Reset Password (Using OTP)
```bash
POST http://localhost:8083/auth/reset-password
Content-Type: application/json

{
  "email": "test@example.com",
  "otp": "123456",
  "newPassword": "NewPass@123"
}
```

## ✅ Verification

- [x] Removed duplicate `/send-otp` endpoint from AuthController
- [x] Removed duplicate `/reset-password` endpoint from AuthController
- [x] Removed unused `PasswordResetService` dependency from AuthController
- [x] Removed unused `Map` import from AuthController
- [x] Application compiles successfully (BUILD SUCCESS)
- [x] No more ambiguous mapping errors
- [x] All endpoints properly separated between controllers

## 📊 Endpoint Responsibility

**AuthController:**
- User authentication (login)
- User registration
- JWT token generation

**PasswordResetController:**
- OTP generation and email sending
- Password reset with OTP validation
- Email-based password recovery flow

## 🎯 Result

✅ **Application now starts successfully without ambiguous mapping errors**
✅ **All endpoints properly separated and functional**
✅ **Registration flow working with role conversion**
✅ **Password reset flow handled by dedicated controller**

---

**Note:** If you need to send OTP, use `/auth/forgot-password` endpoint instead of `/auth/send-otp`.

