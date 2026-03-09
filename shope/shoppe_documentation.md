# Shopp-E: End-to-End Project Documentation

Shopp-E is a full-featured, robust, and scalable e-commerce microservices platform. It supports multi-vendor functionality, allowing individual retailers to sell their products while customers browse, compare, and purchase them seamlessly. The project is split into a Java Spring Boot backend and an Angular v21 frontend.

---

## 1. System Features & Workflows
The platform is designed around three main user roles: **Customer**, **Retailer**, and **Admin**.

- **Customer Journey:** Unauthenticated users can search, browse, and filter products. Upon logging in or signing up, they can add items to their **Wishlist** or **Shopping Cart**. They can also select up to 4 items simultaneously for a side-by-side **Product Comparison**. Customers can view active carts, adjust item quantities in real-time, and proceed to a secure Stripe-powered **Checkout**. 
- **Retailer Journey:** Retailers have a dedicated dashboard where they can submit new products to their catalog, update stock and prices, and view sales/revenue metric summaries. 
- **Admin Workflow:** Administrators oversee the platform. They can approve or reject new Retailer accounts, manage the global product catalog, define product categories, and manage users.
- **Authentication:** Security relies on stateless JWT (JSON Web Tokens). Account recovery is handled via a secure email OTP (One Time Password) flow.

---

## 2. Technology Stack & Extracted Libraries

### 2.1 Backend (Java Microservices)
The backend is built around **Java 17** utilizing **Spring Boot 3.2.4**. Inter-service routing and discovery are powered by **Spring Cloud 2023.0.1**.
- **`spring-boot-starter-web` & `data-jpa`**: For exposing REST APIs and accessing the database via Hibernate ORM.
- **`spring-cloud-starter-gateway`**: Acts as the API Gateway routing all external consumer requests.
- **`spring-cloud-starter-netflix-eureka-server`**: Service registry for all microservices.
- **`jjwt` (v0.11.5)**: Used in the Auth Service to sign and parse stateless JWT tokens securely.
- **`spring-security`**: Handles Role-Based Access Control (RBAC) and BCrypt adaptive hashing for passwords.
- **`jacoco-maven-plugin` (v0.8.11)**: Used for comprehensive test coverage generation.

### 2.2 Frontend (Angular SPA)
The frontend utilizes the cutting-edge **Angular v21** release candidate ecosystem.
- **`@angular/core`, `common`, `forms`, `router` (v21.2.0-next/rc)**: The core framework for reactive UIs, routing, and form validation.
- **`tailwindcss` (v3.4) & `autoprefixer`**: Responsible for modern, responsive, mobile-first styling and utility classes.
- **`lucide-angular` (v0.575.0)**: Used for clean, scalable, SVGs and UI icons.
- **`@stripe/stripe-js` (v8.9.0)**: Used in the checkout flow to securely generate payment tokens.
- **`rxjs` (v7.8.0)**: Used for reactive state management and API stream handling.
- **`vitest` (v4.0.8) & `jsdom`**: Fast frontend unit testing framework (replacing Jasmine/Karma).

---

## 3. Database Structure & Flow
The application requires a relational database (e.g., **MySQL** via Aiven) strictly following 3NF normalization. Hibernate automatically maps these entities.

### Key Entities:
1. **User / Role**: Central table holding all accounts. A many-to-many join defines whether a User is a `ROLE_CUSTOMER`, `ROLE_RETAILER`, or `ROLE_ADMIN`. Contains safe BCrypt `password_hash`.
2. **Retailer**: Extends the User profile with specific business details (`store_name`, generated `revenue`).
3. **Product & Category**: Products belong to one specific Category (1:N) and one Specific Retailer (1:N). Tracks `stock`, `price`, `description`.
4. **Wishlist**: A join table mapping a User ID to a Product ID.
5. **CartItem**: Maps a User ID to a Product ID alongside an active `quantity`.
6. **Order & OrderItem**: When checkout occurs, CartItems are converted to fixed `OrderItems` (locking in the `price_at_purchase`), which are tied to a parent `Order` ID.
7. **ProductComparison**: Stores the array of product IDs a user is actively comparing.

---

## 4. Architecture & Component Interaction

### 4.1 Backend Structure (The Microservices)
Instead of a monolith, the backend is decoupled into **7 independent services**:
1. **Eureka Server**: The registry. All other services boot up and tell Eureka "I am here."
2. **API Gateway**: The only port exposed to the Angular Frontend. It catches requests (e.g., `/api/products`), asks Eureka where the Product Service is, and routes the traffic there. It also validates JWT token presence.
3. **Auth Service**: Issues JWT tokens on login and handles BCrypt hashing and OTPs.
4. **User Service**: Manages customer profiles.
5. **Product Service**: High-traffic service handling the core catalog, search filters, and categories.
6. **Order Service**: Manages the Wishlist, Cart state, and final Checkout processing. 
7. **Retailer Service**: Dedicated service for vendor catalog submissions and revenue tracking.

**Interaction Flow:**
*Angular Frontend ➔ API Gateway ➔ Target Microservice ➔ MySQL Database*

### 4.2 Frontend Structure
Angular is structured by **Feature Modules** to keep the bundle size optimized:
- **`AuthModule`**: Login, Register, Forgot Password.
- **`ProductModule`**: The browsing grid, real-time search, filters, and comparisons.
- **`OrderModule`**: Cart management and the Stripe Checkout flow.
- **`Dashboards`**: Protected routes for the Admin (`AdminModule`) and Retailers (`RetailerModule`) guarded by Angular `CanActivate` Route Guards checking the JWT role.
- **`Core/Shared`**: Interceptors that automatically attach the `Authorization: Bearer <jwt>` to every outgoing HTTP request.

---

## 5. API Endpoints

The system relies on RESTful JSON APIs interacting through DTOs (Data Transfer Objects).

### Auth & User APIs
- `POST /auth/login` (Returns JWT)
- `POST /auth/signup` (Registers and hashes password)
- `POST /auth/forgot-password` / `POST /auth/reset-password` (OTP Flow)
- `GET /users/me` (Profile tracking using JWT Context)

### Product Routing
- `GET /products` (Search with keyword, category, pagination query params)
- `GET /products/{id}` 
- `POST /products` (Requires `ROLE_RETAILER` or `ROLE_ADMIN`)
- `GET /categories`

### Cart, Wishlist, & Compare
- `GET /cart`, `POST /cart`, `PUT /cart/{id}` (Update quantities)
- `GET /wishlist`, `POST /wishlist`, `DELETE /wishlist/{itemId}`
- `GET /compare`, `POST /compare` (Max 4 limits enforced in backend)

### Orders & Checkout
- `POST /orders` (Submits the cart, creates an order, triggers payment)
- `GET /orders` (Order history)

### Dashboards
- `GET /retailer/products`, `PUT /retailer/products/{id}` (Retailer specific actions)
- `GET /admin/retailers`, `PUT /admin/retailers/{id}/approve` (Platform administration)
