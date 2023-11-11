# **Islamic elegance (Backend)**

### **Requirement analysis - [_click here_](https://docs.google.com/document/d/1cyBMGPUjJ2wi37jDH9fRbEbpkpABCYEdamrQTGAzoRs/edit?usp=sharing)**

---

## Used Technology

- TypeScript
- NodeJs
  - ExpressJs
- MongoDB
  - Mongoose
- Zod
- Jsonwebtoken
- Bcrypt
- Cors
- Dotenv
- Http-status
- Ts-node-dev
- ESLint
- Prettier
- Lint-staged
- Husky

---

## Main Functionality

- Open

  - Registration (redirect back)
  - Login (redirect back)
  - All products with pagination and filtering
  - Product details
  - Cart

- User

  - Checkout
  - Create order
  - Cancel order which is in processing process
  - Pending orders
  - Completed orders
  - Profile information
  - Edit profile
  - Change password
  - Review product

- Admin
  - See all pending order
  - See all completed order
  - Accept order
  - Cancel order
  - Confirm order
  - All users
  - User details
  - Change user password
  - Add product
  - Update product

## API Endpoints

### Product routes

- /product (get)
- /product/:id (get)
- /product (post) ⇒ (for create product by admin)
- /product/:id (patch) ⇒ (for update product by admin)
- /product/:id (delete) ⇒ (for delete product by - admin)
- /product/review/:id (post)
- /product/review/:id (delete)

### Auth routes

- /auth/signup (post)
- /auth/login (post)
- /auth/change-password (patch)
- /auth/profile (get) ⇒ (for getting own profile - information)
- /auth/profile (patch) ⇒ (for updating own profile)
- /auth/all-users (get)
- /auth/user/:id (get)
- /auth/change-password-by-admin/:id (patch) ⇒ (for update password by admin)

### Order routes

- /order (post) ⇒ (for create order)
- /order/cancel-order/:id (delete) ⇒ (for cancel order which is in processing stage)
- /order/my-pending-order (get) ⇒ (for getting own pending order)
- /order/my-completed-order (get) ⇒ (for getting own completed order)
- /order/accept-order/:id (patch) ⇒ (for accept order by admin)
- /order/delivered-order/:id (patch) ⇒ (for ensure delivery by admin)
- /order/all-pending-order (get) ⇒ (for getting all pending order by admin)
- /order/all-completed-order (get) ⇒ (for getting all completed order by admin)
