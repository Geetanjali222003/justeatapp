# Restaurant Search Feature - Implementation Complete ✅

## Overview
Implemented optimized restaurant search functionality allowing customers to search by **name**, **location**, and **cuisine** with clean and optimized JPA queries.

---

## Part 1: Entity Relations ✅

### Restaurant Entity
```java
@Entity
public class Restaurant {
    @Id @GeneratedValue
    private Long id;
    private String name;
    private String location;
    private String city;
    private String cuisine;
    private BigDecimal rating;
    private Boolean active;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_id")
    private User owner;
    
    @OneToMany(mappedBy = "restaurant", cascade = CascadeType.ALL)
    private List<Food> foods;
}
```

### Food Entity
```java
@Entity
public class Food {
    @Id @GeneratedValue
    private Long id;
    private String name;
    private String cuisine;
    private BigDecimal price;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "restaurant_id")
    private Restaurant restaurant;
}
```

---

## Part 2: Repository - Optimized Query ✅

```java
@Query("""
    SELECT DISTINCT r FROM Restaurant r
    LEFT JOIN r.foods f
    WHERE r.active = true
    AND (:name IS NULL OR LOWER(r.name) LIKE LOWER(CONCAT('%', :name, '%')))
    AND (:location IS NULL OR LOWER(r.location) LIKE LOWER(CONCAT('%', :location, '%')) 
         OR LOWER(r.city) LIKE LOWER(CONCAT('%', :location, '%')))
    AND (:cuisine IS NULL OR LOWER(r.cuisine) LIKE LOWER(CONCAT('%', :cuisine, '%'))
         OR LOWER(f.cuisine) LIKE LOWER(CONCAT('%', :cuisine, '%')))
    ORDER BY r.rating DESC
    """)
List<Restaurant> searchRestaurants(
    @Param("name") String name,
    @Param("location") String location,
    @Param("cuisine") String cuisine
);
```

### Query Features:
- ✅ Uses `DISTINCT` to avoid duplicates from JOIN
- ✅ Case-insensitive search (`LOWER()`)
- ✅ Partial matching (`LIKE '%...%'`)
- ✅ All parameters optional (null handling)
- ✅ Searches cuisine in both restaurant AND foods
- ✅ Results ordered by rating (highest first)

---

## Part 3: Service Layer ✅

```java
public List<RestaurantResponseDTO> search(String name, String location, String cuisine) {
    // Normalize empty strings to null
    String normalizedName = (name != null && !name.trim().isEmpty()) ? name.trim() : null;
    String normalizedLocation = (location != null && !location.trim().isEmpty()) ? location.trim() : null;
    String normalizedCuisine = (cuisine != null && !cuisine.trim().isEmpty()) ? cuisine.trim() : null;
    
    List<Restaurant> restaurants = restaurantRepository.searchRestaurants(
        normalizedName, normalizedLocation, normalizedCuisine
    );
    
    return restaurants.stream()
        .map(this::mapToRestaurantResponseWithCuisine)
        .toList();
}
```

---

## Part 4: Controller ✅

```java
@GetMapping("/customer/restaurants/search")
public ResponseEntity<List<RestaurantResponseDTO>> searchRestaurants(
    @RequestParam(required = false) String name,
    @RequestParam(required = false) String location,
    @RequestParam(required = false) String cuisine
) {
    return ResponseEntity.ok(restaurantService.search(name, location, cuisine));
}
```

---

## Part 5: Security ✅

```java
.requestMatchers("/customer/**").hasRole("CUSTOMER")
```

Only users with CUSTOMER role can access search endpoints.

---

## Part 6: Best Practices ✅

| Practice | Implementation |
|----------|---------------|
| DTO Pattern | `RestaurantResponseDTO` - no entity exposure |
| Case-insensitive | `LOWER()` in queries |
| DISTINCT | Avoids duplicates from JOIN |
| Null handling | Parameters are optional |
| Clean architecture | Controller → Service → Repository |

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/customer/restaurants/search` | Search with filters |
| GET | `/customer/restaurants/filters` | Get filter options |
| GET | `/customer/restaurants/top-rated` | Top rated restaurants |
| GET | `/customer/restaurants/location/{location}` | Filter by location |
| GET | `/customer/restaurants/cuisine/{cuisine}` | Filter by cuisine |

---

## Example API Usage

### Search Request
```bash
GET /customer/restaurants/search?name=Pizza&location=Mumbai&cuisine=Italian
Authorization: Bearer <customer-jwt-token>
```

### Response
```json
[
  {
    "id": 1,
    "name": "Pizza Palace",
    "location": "Mumbai",
    "city": "Mumbai",
    "cuisine": "Italian",
    "rating": 4.5,
    "active": true,
    "ownerId": 1
  }
]
```

### Get Filter Options
```bash
GET /customer/restaurants/filters
```
```json
{
  "cuisines": ["Italian", "Indian", "Chinese"],
  "locations": ["Mumbai", "Delhi", "Bangalore"],
  "cities": ["Mumbai", "Delhi", "Bangalore"]
}
```

---

## Files Modified

### Backend:
1. `entity/Restaurant.java` - Added location, owner relation, foods collection
2. `entity/Food.java` - Added restaurant relation
3. `repository/RestaurantRepository.java` - Optimized search query
4. `service/RestaurantService.java` - search() method with DTO mapping
5. `controller/CustomerController.java` - Search endpoint with filters
6. `dto/RestaurantResponseDTO.java` - Added location field

### Frontend:
1. `api/customerApi.js` - Updated search API with location parameter
2. `components/RestaurantSearch.jsx` - Updated to use location filter

---

## ✅ Implementation Complete!

Run the application:
```bash
# Backend
./mvnw spring-boot:run

# Frontend
cd frontend && npm start
```

Test search:
1. Login as CUSTOMER
2. Go to Restaurants tab
3. Use search bar and filters

