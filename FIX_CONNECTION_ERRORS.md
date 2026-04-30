# 🚨 FIXING: ERR_CONNECTION_REFUSED & Redis Issues

## Current Errors
```
❌ ERR_CONNECTION_REFUSED on port 8083
❌ unable to connect to redis
```

## Root Causes
1. Spring Boot application is NOT running
2. Redis is NOT installed/running

---

## ✅ SOLUTION - Step by Step

### STEP 1: Install Redis (Choose ONE option)

#### **Option A: Memurai (Recommended for Windows)**
```
1. Download: https://www.memurai.com/get-memurai
2. Install Memurai (it's free)
3. It automatically runs on port 6379
4. Done!
```

#### **Option B: Portable Redis**
```
1. Download: https://github.com/tporadowski/redis/releases/download/v5.0.14.1/Redis-x64-5.0.14.1.zip
2. Extract to C:\Redis
3. Run: C:\Redis\redis-server.exe
4. Keep the window open
```

#### **Option C: WSL + Redis**
```powershell
wsl --install
wsl
sudo apt-get update
sudo apt-get install redis-server -y
redis-server --daemonize yes
```

### STEP 2: Verify Redis is Running

```powershell
# Open PowerShell and test:
Test-NetConnection -ComputerName localhost -Port 6379

# Should show: TcpTestSucceeded : True
```

### STEP 3: Start Spring Boot Application

```powershell
cd "c:\Users\geetanjalipandey\OneDrive - Nagarro\Desktop\CAPSTONE"
.\mvnw.cmd spring-boot:run
```

Wait for:
```
Started CapstoneApplication in X seconds
```

### STEP 4: Verify Application is Running

Open browser: http://localhost:8083/actuator/health

Should show: `{"status":"UP"}`

---

## 🔧 Alternative: Run Without Redis (Testing Only)

If you can't install Redis right now, temporarily modify `AuthController.java`:

### Comment out Redis code:

```java
@PostMapping("/send-otp")
public ResponseEntity<String> sendOtp(@RequestBody Map<String, String> request) {
    String email = request.get("email");
    String otp = String.valueOf((int)(Math.random() * 900000) + 100000);
    
    // TEMPORARILY DISABLED: redisTemplate.opsForValue().set(email, otp, 5, TimeUnit.MINUTES);
    
    System.out.println("OTP for " + email + ": " + otp);
    
    return ResponseEntity.ok("OTP sent: " + otp);  // Show OTP for testing
}

@PostMapping("/register")
public ResponseEntity<String> register(@Valid @RequestBody RegisterRequestDTO request) {
    // TEMPORARILY DISABLED: OTP validation
    // String storedOtp = redisTemplate.opsForValue().get(request.getEmail());
    // if (storedOtp == null || !storedOtp.equals(request.getOtp())) {
    //     return ResponseEntity.badRequest().body("Invalid or expired OTP");
    // }
    
    authService.register(request);
    redisTemplate.delete(request.getEmail());  // Safe to keep
    
    return ResponseEntity.ok("User registered successfully");
}
```

Then restart the application.

---

## ✅ Complete Checklist

- [ ] Redis installed and running on port 6379
- [ ] Spring Boot application running on port 8083
- [ ] Frontend can connect to http://localhost:8083
- [ ] OTP endpoints responding: `/auth/send-otp`
- [ ] Registration working: `/auth/register`

---

## 🧪 Test After Starting

### Test in PowerShell:
```powershell
# Test if app is running
Invoke-WebRequest -Uri "http://localhost:8083/actuator/health"

# Test send OTP
$body = @{ email = "test@example.com" } | ConvertTo-Json
Invoke-WebRequest -Uri "http://localhost:8083/auth/send-otp" -Method POST -ContentType "application/json" -Body $body
```

---

## 📞 Quick Help

### Check what's running:
```powershell
# Check if Redis is running
Test-NetConnection localhost -Port 6379

# Check if Spring Boot is running
Test-NetConnection localhost -Port 8083
```

### View application logs:
```powershell
# When running mvnw spring-boot:run, check console for errors
```

---

## 🎯 Most Common Fix

**Just install Memurai:**
1. Go to https://www.memurai.com/get-memurai
2. Download and install
3. It runs automatically
4. Restart Spring Boot application
5. Done!

