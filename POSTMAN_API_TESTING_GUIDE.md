# 📬 Postman API Testing Guide - JWT Role-Based Access Control

## Base URL: `http://localhost:8083`

---

## 🔐 STEP 1: REGISTER USERS (OWNER and CUSTOMER)

### 1.1 Send OTP for OWNER Registration
```
POST http://localhost:8083/auth/send-otp
Content-Type: application/json
```
**Body (raw JSON):**
```json
{
  "email": "owner@test.com"
}
```
**Expected Response:** `200 OK` - `"OTP sent"`

> 📝 **Note:** Check the backend console for OTP (printed as: `OTP for owner@test.com: 123456`)

---

### 1.2 Register OWNER
```
POST http://localhost:8083/auth/register
Content-Type: application/json
```
**Body (raw JSON):**
```json
{
  "username": "owner1",
  "email": "owner@test.com",
  "password": "Owner@123",
  "role": "OWNER",
  "otp": "123456"
}
```
**Expected Response:** `201 Created` - `"User registered successfully"`

---

### 1.3 Send OTP for CUSTOMER Registration
```
POST http://localhost:8083/auth/send-otp
Content-Type: application/json
```
**Body (raw JSON):**
```json
{
  "email": "customer@test.com"
}
```

---

### 1.4 Register CUSTOMER
```
POST http://localhost:8083/auth/register
Content-Type: application/json
```
**Body (raw JSON):**
```json
{
  "username": "customer1",
  "email": "customer@test.com",
  "password": "Customer@123",
  "role": "CUSTOMER",
  "otp": "123456"
}
```
**Expected Response:** `201 Created` - `"User registered successfully"`

---

## 🔑 STEP 2: LOGIN AND GET JWT TOKENS

### 2.1 Login as OWNER
```
POST http://localhost:8083/auth/login
Content-Type: application/json
```
**Body (raw JSON):**
```json
{
  "username": "owner1",
  "password": "Owner@123"
}
```
**Expected Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJvd25lcjEiLCJyb2xlIjoiT1dORVIi...",
  "role": "OWNER"
}
```
⚠️ **SAVE THIS TOKEN AS: `OWNER_TOKEN`**

---

### 2.2 Login as CUSTOMER
```
POST http://localhost:8083/auth/login
Content-Type: application/json
```
**Body (raw JSON):**
```json
{
  "username": "customer1",
  "password": "Customer@123"
}
```
**Expected Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJjdXN0b21lcjEiLCJyb2xlIjoiQ1VTVE9NRVIi...",
  "role": "CUSTOMER"
}
```
⚠️ **SAVE THIS TOKEN AS: `CUSTOMER_TOKEN`**

---

## 🔧 How to Add Authorization Header in Postman

### Method 1: Using Authorization Tab (Recommended)
1. Go to **Authorization** tab
2. Type: Select **Bearer Token**
3. Token: Paste your token (without "Bearer" prefix)

### Method 2: Using Headers Tab
| Key | Value |
|-----|-------|
| Authorization | Bearer eyJhbGciOiJIUzI1NiJ9... |
| Content-Type | application/json |

> ⚠️ **Important:** One space between `Bearer` and the token. No quotes.

---

## 👨‍🍳 STEP 3: TEST OWNER APIs (Use OWNER_TOKEN)

### 3.1 Create Restaurant
```
POST http://localhost:8083/owner/restaurant
Authorization: Bearer <OWNER_TOKEN>
Content-Type: application/json
```
**Body (raw JSON):**
```json
{
  "name": "Pizza Paradise",
  "description": "Best Italian Pizza in town",
  "address": "123 Main Street",
  "city": "Mumbai",
  "cuisine": "Italian",
  "phoneNumber": "9876543210"
}
```
**Expected Response:** `201 Created`
```json
{
  "id": 1,
  "name": "Pizza Paradise",
  "description": "Best Italian Pizza in town",
  "city": "Mumbai",
  "cuisine": "Italian",
  "rating": 0,
  "active": true,
  "ownerId": 1
}
```

---

### 3.2 Get My Restaurants (Owner's restaurants)
```
GET http://localhost:8083/owner/restaurants
Authorization: Bearer <OWNER_TOKEN>
```
**Expected Response:** `200 OK` - List of restaurants owned by this owner

---

### 3.3 Add Menu Item to Restaurant
```
POST http://localhost:8083/owner/menu
Authorization: Bearer <OWNER_TOKEN>
Content-Type: application/json
```
**Body (raw JSON):**
```json
{
  "restaurantId": 1,
  "name": "Margherita Pizza",
  "description": "Classic cheese pizza with tomato sauce and fresh basil",
  "price": 350.00,
  "category": "Pizza",
  "available": true
}
```
**Expected Response:** `201 Created`

---

### 3.4 Get Menu Items for Restaurant (Owner view - includes unavailable)
```
GET http://localhost:8083/owner/menu/1
Authorization: Bearer <OWNER_TOKEN>
```
**Expected Response:** `200 OK` - List of all menu items

---

## 🛒 STEP 4: TEST CUSTOMER APIs (Use CUSTOMER_TOKEN)

### 4.1 Get All Restaurants
```
GET http://localhost:8083/customer/restaurants
Authorization: Bearer <CUSTOMER_TOKEN>
```
**Expected Response:** `200 OK` - List of all active restaurants

---

### 4.2 Search Restaurants (by name, location, cuisine)
```
GET http://localhost:8083/customer/restaurants/search?name=Pizza
Authorization: Bearer <CUSTOMER_TOKEN>
```
**Other Examples:**
```
GET http://localhost:8083/customer/restaurants/search?cuisine=Italian
GET http://localhost:8083/customer/restaurants/search?location=Mumbai
GET http://localhost:8083/customer/restaurants/search?name=Pizza&cuisine=Italian
```
**Expected Response:** `200 OK` - Filtered list of restaurants

---

### 4.3 Get Restaurant Details with Foods
```
GET http://localhost:8083/customer/restaurants/1/details
Authorization: Bearer <CUSTOMER_TOKEN>
```
**Expected Response:** `200 OK`
```json
{
  "id": 1,
  "name": "Pizza Paradise",
  "cuisine": "Italian",
  "rating": 0,
  "foods": [
    {
      "id": 1,
      "name": "Margherita Pizza",
      "price": 350.00,
      "category": "Pizza"
    }
  ]
}
```

---

### 4.4 Get Menu for Restaurant (Customer view - only available items)
```
GET http://localhost:8083/customer/menu/1
Authorization: Bearer <CUSTOMER_TOKEN>
```
**Expected Response:** `200 OK` - List of available menu items

---

### 4.5 Get Filter Options (for dropdowns)
```
GET http://localhost:8083/customer/restaurants/filters
Authorization: Bearer <CUSTOMER_TOKEN>
```
**Expected Response:** `200 OK`
```json
{
  "cuisines": ["Italian", "Indian", "Chinese"],
  "locations": ["Mumbai", "Delhi"],
  "cities": ["Mumbai", "Delhi"]
}
```

---

### 4.6 Get Top Rated Restaurants
```
GET http://localhost:8083/customer/restaurants/top-rated
Authorization: Bearer <CUSTOMER_TOKEN>
```

---

## ❌ STEP 5: VERIFY ROLE-BASED ACCESS CONTROL (CRITICAL TESTS!)

### TEST 5.1: CUSTOMER tries to access OWNER API → Should get 403
```
POST http://localhost:8083/owner/restaurant
Authorization: Bearer <CUSTOMER_TOKEN>
Content-Type: application/json
```
**Body:**
```json
{
  "name": "Unauthorized Restaurant"
}
```
**Expected Response:** `403 Forbidden`
```json
{
  "error": "Forbidden",
  "message": "Access Denied"
}
```
✅ **This proves CUSTOMER cannot access OWNER endpoints!**

---

### TEST 5.2: OWNER tries to access CUSTOMER API → Should get 403
```
GET http://localhost:8083/customer/restaurants
Authorization: Bearer <OWNER_TOKEN>
```
**Expected Response:** `403 Forbidden`

✅ **This proves OWNER cannot access CUSTOMER endpoints!**

---

### TEST 5.3: No Token Provided → Should get 403
```
GET http://localhost:8083/customer/restaurants
(No Authorization header)
```
**Expected Response:** `403 Forbidden`

✅ **This proves authentication is required!**

---

### TEST 5.4: Invalid Token → Should get 403
```
GET http://localhost:8083/customer/restaurants
Authorization: Bearer invalid-token-12345
```
**Expected Response:** `403 Forbidden`

✅ **This proves token validation works!**

---

### TEST 5.5: Expired Token → Should get 403
(Use an old token after 24 hours)

**Expected Response:** `403 Forbidden`

✅ **This proves token expiration works!**

---

## 📋 API ENDPOINTS SUMMARY TABLE

| Endpoint | Method | Access | Description |
|----------|--------|--------|-------------|
| `/auth/send-otp` | POST | Public | Send OTP to email |
| `/auth/register` | POST | Public | Register new user |
| `/auth/login` | POST | Public | Login and get JWT token |
| `/auth/forgot-password` | POST | Public | Request password reset OTP |
| `/auth/reset-password` | POST | Public | Reset password with OTP |
| `/owner/restaurant` | POST | **OWNER** | Create new restaurant |
| `/owner/restaurants` | GET | **OWNER** | Get owner's restaurants |
| `/owner/menu` | POST | **OWNER** | Add menu item |
| `/owner/menu/{restaurantId}` | GET | **OWNER** | Get all menu items |
| `/customer/restaurants` | GET | **CUSTOMER** | Get all restaurants |
| `/customer/restaurants/search` | GET | **CUSTOMER** | Search restaurants |
| `/customer/restaurants/{id}/details` | GET | **CUSTOMER** | Get restaurant with foods |
| `/customer/menu/{restaurantId}` | GET | **CUSTOMER** | Get available menu items |
| `/customer/restaurants/filters` | GET | **CUSTOMER** | Get filter options |
| `/customer/restaurants/top-rated` | GET | **CUSTOMER** | Get top rated restaurants |

---

## ✅ ROLE-BASED ACCESS VERIFICATION CHECKLIST

| Test Case | Expected Result | Status |
|-----------|-----------------|--------|
| OWNER token on `/owner/*` endpoints | ✅ 200/201 Success | ⬜ |
| CUSTOMER token on `/customer/*` endpoints | ✅ 200 Success | ⬜ |
| CUSTOMER token on `/owner/*` endpoints | ❌ 403 Forbidden | ⬜ |
| OWNER token on `/customer/*` endpoints | ❌ 403 Forbidden | ⬜ |
| No token on protected routes | ❌ 403 Forbidden | ⬜ |
| Invalid/malformed token | ❌ 403 Forbidden | ⬜ |
| Expired token (after 24h) | ❌ 403 Forbidden | ⬜ |

---

## 🔧 POSTMAN ENVIRONMENT SETUP (Optional)

Create environment variables for easier testing:

1. Go to **Environments** → **Create New**
2. Add these variables:

| Variable | Initial Value |
|----------|---------------|
| `BASE_URL` | `http://localhost:8083` |
| `OWNER_TOKEN` | (paste after login) |
| `CUSTOMER_TOKEN` | (paste after login) |

3. Use in requests:
   - URL: `{{BASE_URL}}/auth/login`
   - Authorization: `Bearer {{OWNER_TOKEN}}`

---

## 🚨 COMMON ERRORS AND SOLUTIONS

| Error | Cause | Solution |
|-------|-------|----------|
| `Invalid character in header` | Token has quotes or newlines | Copy token without quotes, single line |
| `403 Forbidden` | Wrong role or no token | Use correct token for the endpoint |
| `401 Unauthorized` | Invalid credentials | Check username/password |
| `500 Internal Server Error` | Server-side error | Check backend logs |
| `Connection refused` | Backend not running | Start backend with `mvn spring-boot:run` |

---

## 📝 NOTES

- JWT tokens expire after **24 hours**
- Passwords must have: 8+ chars, 1 uppercase, 1 lowercase, 1 digit, 1 special char
- OTP expires after **5 minutes**
- All `/auth/**` endpoints are **public** (no token needed)
- All `/owner/**` endpoints require **OWNER** role
- All `/customer/**` endpoints require **CUSTOMER** role

---

**Created:** April 30, 2026  
**Backend:** Spring Boot 3.3.4 with JWT Authentication  
**Security:** Role-Based Access Control (RBAC)

