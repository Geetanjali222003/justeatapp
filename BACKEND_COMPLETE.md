# JustEat Backend Implementation - Complete Summary

## ✅ Database Schema (Normalized)

### Entities Created/Updated:

| Entity | Table | Key Fields |
|--------|-------|------------|
| **User** | `users` | id, username, email, password, role (CUSTOMER/OWNER) |
| **Restaurant** | `restaurants` | id, name, description, address, city, cuisine, phoneNumber, rating, active, ownerId |
| **MenuItem** | `menu_items` | id, name, description, price, category, isVeg, available, restaurantId |
| **Food** | `foods` | id, name, description, cuisine, price, category, isVeg, available, restaurantId |
| **Cart** | `carts` | id, userId |
| **CartItem** | `cart_items` | id, cartId, foodId, quantity, priceAtAdd |
| **Order** | `orders` | id, userId, restaurantId, totalAmount, status, deliveryAddress, specialInstructions |
| **OrderItem** | `order_items` | id, orderId, foodId, quantity, priceAtOrder |
| **Preference** | `preferences` | id, userId, preferredCuisine, isVegOnly, maxPriceRange |
| **PreferenceFood** | `preference_foods` | id, preferenceId, foodId |
| **PreferenceRestaurant** | `preference_restaurants` | id, preferenceId, restaurantId |
| **RestaurantRating** | `restaurant_ratings` | id, restaurantId, userId, rating, review |

---

## ✅ Repositories Created

- `MenuItemRepository` - Menu item CRUD operations
- `OrderRepository` - Order management
- `OrderItemRepository` - Order items management
- `PreferenceRepository` - User preferences
- `PreferenceFoodRepository` - Favorite foods
- `PreferenceRestaurantRepository` - Favorite restaurants
- `RestaurantRatingRepository` - Restaurant reviews/ratings

---

## ✅ Services

| Service | Responsibility |
|---------|---------------|
| `AuthService` | Login/Register with BCrypt password encoding |
| `OtpService` | OTP generation with Redis + in-memory fallback |
| `PasswordResetService` | Password reset with OTP validation |
| `RestaurantService` | Restaurant & menu management |
| `CartService` | Shopping cart operations |
| `OrderService` | Order creation and management |
| `EmailService` | Email sending (OTP, notifications) |

---

## ✅ Security Configuration

### Role-Based Access Control:
```
/auth/**          → Public (login, register, OTP, password reset)
/user/send-otp    → Public
/user/register    → Public  
/swagger-ui/**    → Public
/actuator/**      → Public
/customer/**      → CUSTOMER role only
/owner/**         → OWNER role only
```

### Features:
- JWT Authentication (24-hour expiry)
- BCrypt password encoding
- CORS enabled for `http://localhost:3000`
- Stateless sessions

---

## ✅ API Endpoints

### Authentication (`/auth`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/login` | Login with username/password, returns JWT |
| POST | `/auth/register` | Register new user (OTP validated) |
| POST | `/auth/send-otp` | Send OTP to email |
| POST | `/auth/forgot-password` | Send password reset OTP |
| POST | `/auth/reset-password` | Reset password with OTP |

### Owner (`/owner`) - Requires OWNER role
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/owner/restaurant` | Create new restaurant |
| GET | `/owner/restaurants` | Get owner's restaurants |
| POST | `/owner/menu` | Add menu item |
| GET | `/owner/menu/{restaurantId}` | Get menu items |

### Customer (`/customer`) - Requires CUSTOMER role
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/customer/restaurants` | Get all restaurants |
| GET | `/customer/restaurant/{id}` | Get restaurant by ID |
| GET | `/customer/menu/{restaurantId}` | Get menu items |

---

## ✅ Password Reset Flow

1. User enters email → `POST /auth/forgot-password`
2. OTP generated and sent via email (5-min expiry)
3. User enters OTP + new password → `POST /auth/reset-password`
4. Password validated (complexity rules) and updated

### Password Requirements:
- Minimum 8 characters
- At least 1 uppercase letter
- At least 1 lowercase letter  
- At least 1 digit
- At least 1 special character (@$!%*?&)

---

## ✅ OTP Storage

**Primary:** Redis (`spring.redis.host=localhost:6379`)
**Fallback:** In-memory ConcurrentHashMap (when Redis unavailable)

---

## 🚀 How to Run

### Backend:
```bash
cd CAPSTONE
./mvnw spring-boot:run
```
Server runs on: `http://localhost:8083`

### Frontend:
```bash
cd frontend
npm install
npm start
```
React runs on: `http://localhost:3000`

---

## 📝 Test API with Postman

### 1. Send OTP
```
POST http://localhost:8083/auth/send-otp
Body: { "email": "test@example.com" }
```

### 2. Register
```
POST http://localhost:8083/auth/register
Body: {
  "username": "testuser",
  "email": "test@example.com",
  "password": "MyPass@123",
  "role": "CUSTOMER",
  "otp": "123456"
}
```

### 3. Login
```
POST http://localhost:8083/auth/login
Body: {
  "username": "testuser",
  "password": "MyPass@123"
}
Response: { "token": "eyJ...", "role": "CUSTOMER" }
```

### 4. Access Protected Endpoints
Add header: `Authorization: Bearer <token>`

```
GET http://localhost:8083/customer/restaurants
```

---

## ✅ Security Rules Enforced

1. **Customer cannot access owner APIs** - Returns 403 Forbidden
2. **Owner cannot place orders as customer** - Role check enforced
3. **Only registered users can login** - 401 for invalid credentials
4. **OTP required for registration** - Prevents fake registrations
5. **Password complexity enforced** - During registration & reset

---

## Files Created/Modified

### New Files:
- `entity/MenuItem.java` - Menu item entity
- `repository/MenuItemRepository.java` - Menu item data access
- `repository/OrderRepository.java` - Order data access
- `repository/OrderItemRepository.java` - Order item data access
- `repository/PreferenceRepository.java` - User preference data access
- `repository/PreferenceFoodRepository.java` - Favorite foods data access
- `repository/PreferenceRestaurantRepository.java` - Favorite restaurants data access
- `repository/RestaurantRatingRepository.java` - Restaurant ratings data access
- `service/PasswordResetService.java` - Password reset logic

### Modified Files:
- `entity/Restaurant.java` - Added rating, active, createdAt fields
- `config/SecurityConfig.java` - Added actuator endpoints to permitAll

