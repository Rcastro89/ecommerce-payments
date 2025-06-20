
# 🛒 E-Commerce Checkout App with Payment Gateway

A modern, responsive single-page application (SPA) for purchasing tech products through a secure credit card checkout experience. Built with a clean architecture approach, this project integrates a custom backend with Wompi's sandbox payment API, providing a full end-to-end flow — from product selection to transaction confirmation and stock update.

---

## 📸 Screenshots

### 📦 Product List
![Product List](./assets/screenshots/products.png)

### 🛍️ Cart View
![Cart](./assets/screenshots/cart.png)

### 💳 Credit Card Payment Modal
![Payment Form](./assets/screenshots/payment.png)

---

## 🧠 Project Overview

This application simulates a real-world e-commerce scenario, covering:

- Product visualization with stock.
- Add-to-cart and quantity management.
- Secure credit card data input.
- Order summary and transaction resume.
- Payment handling via **Wompi** (sandbox).
- Stock update and transaction tracking post-payment.

It follows **Hexagonal Architecture** (Ports and Adapters) and applies the **Railway Oriented Programming (ROP)** paradigm in business logic.

---

## ⚙️ Technologies Used

### Frontend

- **ReactJS** + **Vite**
- **Redux Toolkit**
- **SCSS Modules**
- **Jest** (with +80% test coverage)
- **Responsive Design** (Mobile-first)

### Backend

- **NestJS** (TypeScript)
- **PostgreSQL** (with TypeORM)
- **Jest** for Unit and E2E testing
- **Hexagonal Architecture**
- **ROP (Railway Oriented Programming)** pattern

---

## 🧪 Run Locally

### 🔧 Prerequisites

- Node.js v18+
- PostgreSQL running locally
- (Optional: Docker for PostgreSQL)

---

### ▶️ Frontend

```bash
cd frontend
npm install

# Development server
npm run dev

# Run tests
npm run test
```

---

### ▶️ Backend

```bash
cd backend
npm install

# Start backend server
npm run start:dev

# Run tests
npm run test
npm run test:cov    # Generate coverage
```

📌 You can configure the database connection in `src/configs/typeorm.config.ts`.

---

## 🧾 API Documentation

> Documentation will be published via Swagger soon.

For now, key endpoints include:

| Method | Endpoint                   | Description                 |
|--------|----------------------------|-----------------------------|
| GET    | `/products`                | Fetch all products          |
| POST   | `/payments/checkout`       | Process a payment request   |
| GET    | `/transactions/:id/status` | Get transaction result      |

If needed, a Postman Collection can be provided.

---

## 🗃️ Database Schema

This application defines five key entities:

- **Client** (`client`)
- **Product** (`products`)
- **Transaction** (`transaction`)
- **TransactionItem** (`transaction_item`)
- **Delivery** (`delivery`)

They are linked via foreign keys. Transactions and their items are normalized; deliveries are tied to transactions, and clients own transactions.

---

## 📁 Project Structure

### Frontend

```
frontend/
├── app/                # Redux store
├── components/         # UI components
├── features/           # Feature-based domains (cart, payment, product)
├── hooks/              # Custom hooks
├── layouts/            # Shared layouts
├── styles/             # Global SCSS
├── types/              # TypeScript models
```

### Backend

```
backend/
├── application/        # Use cases and orchestration logic
├── domain/             # Entities, repositories, interfaces (Ports)
├── infrastructure/     # Controllers, database (Adapters)
├── main.ts             # App bootstrap
```

---

## 🧱 Architecture Highlights

### 🧭 Hexagonal Architecture

The system follows **Ports and Adapters (Hexagonal)** principles, separating:

- `domain/`: Business rules (Entities, Interfaces)
- `application/`: Use cases
- `infrastructure/`: Framework-specific concerns (HTTP, DB)

This allows high testability, decoupling, and scalability.

---

### 🛤️ Railway Oriented Programming (ROP)

The business logic is structured as a pipeline of transformations:

```ts
return Result.ok(paymentRequest)
  .bind(validateCard)
  .bind(createTransaction)
  .bind(sendToWompi)
  .map(updateStock);
```

Each step returns a `Result<T, Error>` ensuring clean error propagation.

---

## Backend

Implemented in **NestJS** with TypeScript, following clean architecture principles.

- Business logic completely separated from controllers.
- Hexagonal architecture: use cases and entities live in `domain/` and `application/`.
- ORM: TypeORM with PostgreSQL.
- Strong validation with Pipes and DTOs.
- Railway Oriented Programming applied in payment flows.

---

## 🧪 Tests

- Framework: **Jest** with `ts-jest`.
- Total coverage: ≥ 80% in both frontend and backend.
- Tests for business logic, REST endpoints, Redux reducers, and UI components.

```bash
---------------------------------|---------|----------|---------|---------|-------------------
File                             | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s 
---------------------------------|---------|----------|---------|---------|-------------------
All files                        |   89.64 |    71.69 |   88.67 |   89.72 |                   
 src                             |       0 |      100 |       0 |       0 |                   
  App.tsx                        |       0 |      100 |       0 |       0 | 1-19              
 src/app                         |       0 |      100 |       0 |       0 |                   
  store.ts                       |       0 |      100 |       0 |       0 | 1-41              
 src/components                  |     100 |      100 |     100 |     100 |                   
  Backdrop.tsx                   |     100 |      100 |     100 |     100 |                   
  BottomMenu.tsx                 |     100 |      100 |     100 |     100 |                   
  CartIcon.tsx                   |     100 |      100 |     100 |     100 | 
  FullscreenLoader.tsx           |     100 |      100 |     100 |     100 | 
 src/features/cart/components    |     100 |       50 |     100 |     100 | 
  CartCard.tsx                   |     100 |       50 |     100 |     100 | 20
 src/features/cart/hooks         |     100 |      100 |     100 |     100 | 
  useCart.tsx                    |     100 |      100 |     100 |     100 | 
 src/features/cart/pages         |     100 |      100 |     100 |     100 | 
  CartPage.tsx                   |     100 |      100 |     100 |     100 | 
 src/features/cart/slices        |     100 |     87.5 |     100 |     100 | 
  cartSlice.ts                   |     100 |     87.5 |     100 |     100 | 36
  selectors.ts                   |     100 |      100 |     100 |     100 | 
 src/features/cart/utils         |     100 |      100 |     100 |     100 | 
  cartUtils.ts                   |     100 |      100 |     100 |     100 | 
 src/features/payment/components |     100 |    73.91 |     100 |     100 | 
  CardForm.tsx                   |     100 |      100 |     100 |     100 | 
  CustomerForm.tsx               |     100 |    58.33 |     100 |     100 | 29-58
  InputGroup.tsx                 |     100 |    85.71 |     100 |     100 | 32
  PaymentSummary.tsx             |     100 |      100 |     100 |     100 | 
 src/features/payment/hooks      |   93.47 |     56.6 |   86.66 |   95.29 | 
  useCheckout.ts                 |   90.24 |       75 |      60 |   94.87 | 41,53
  usePayments.tsx                |   96.07 |    51.21 |     100 |   95.65 | 81,112
 src/features/payment/modals     |   81.25 |      100 |      25 |      80 | 
  PaymentModal.tsx               |   81.25 |      100 |      25 |      80 | 49-59
 src/features/payment/services   |   76.92 |       50 |     100 |      75 | 
  paymentService.ts              |   76.92 |       50 |     100 |      75 | 59,64-65
 src/features/payment/utils      |   94.73 |     62.5 |     100 |     100 | 
  paymentUtils.ts                |   94.73 |     62.5 |     100 |     100 | 4-17
 src/features/product/components |      80 |      100 |      75 |   78.57 | 
  ProductCard.tsx                |      80 |      100 |      75 |   78.57 | 42-44
 src/features/product/hooks      |   92.15 |     61.9 |   86.66 |      95 | 
  useFetchProducts.ts            |     100 |      100 |     100 |     100 | 
  useProducts.tsx                |   87.09 |    57.89 |   77.77 |    92.3 | 13,17
 src/features/product/pages      |     100 |      100 |     100 |     100 | 
  ProductPage.tsx                |     100 |      100 |     100 |     100 | 
 src/features/product/services   |   84.61 |       75 |     100 |   81.81 | 
  productService.ts              |   84.61 |       75 |     100 |   81.81 | 7-8
 src/features/product/slices     |     100 |    83.33 |     100 |     100 | 
  productsSlice.ts               |     100 |    83.33 |     100 |     100 | 45
  selectors.ts                   |     100 |      100 |     100 |     100 | 
 src/hooks                       |   96.29 |      100 |   83.33 |     100 | 
  useAppDispatch.ts              |      75 |      100 |       0 |     100 | 
  useAppSelector.ts              |     100 |      100 |     100 |     100 | 
  useProductCart.ts              |     100 |      100 |     100 |     100 | 
 src/layouts                     |       0 |      100 |       0 |       0 | 
  MainLayout.tsx                 |       0 |      100 |       0 |       0 | 2-17
---------------------------------|---------|----------|---------|---------|-------------------
```
```bash
-----------------------------------------|---------|----------|---------|---------|-------------------
File                                     | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s 
-----------------------------------------|---------|----------|---------|---------|-------------------
All files                                |   90.81 |       75 |   67.92 |   91.79 |                   
 application/product                     |     100 |      100 |     100 |     100 |                   
  get-all-products.usecase.ts            |     100 |      100 |     100 |     100 |                   
 application/use-cases                   |   92.85 |       80 |     100 |   92.59 |                   
  payment.use-case.ts                    |   92.85 |       80 |     100 |   92.59 | 54-58,83,194     
 domain/client                           |   85.71 |      100 |       0 |    90.9 | 
  client.entity.ts                       |   84.61 |      100 |       0 |      90 | 21
  client.repository.ts                   |     100 |      100 |     100 |     100 | 
 domain/delivery                         |   83.33 |      100 |       0 |   88.88 | 
  delivery.entity.ts                     |   81.81 |      100 |       0 |    87.5 | 15
  delivery.repository.ts                 |     100 |      100 |     100 |     100 | 
 domain/product                          |   68.42 |      100 |       0 |    64.7 | 
  product.entity.ts                      |   66.66 |      100 |       0 |    62.5 | 43-48
  product.repository.ts                  |     100 |      100 |     100 |     100 | 
 domain/transaction                      |   76.31 |      100 |       0 |   83.33 | 
  transaction-item.entity.ts             |   78.57 |      100 |       0 |   81.81 | 16,20
  transaction-item.repository.ts         |     100 |      100 |     100 |     100 | 
  transaction.entity.ts                  |   72.72 |      100 |       0 |   82.35 | 26,30,33
  transaction.repository.ts              |     100 |      100 |     100 |     100 | 
 infrastructure/client/repositories      |     100 |      100 |     100 |     100 | 
  typeorm-client.repository.ts           |     100 |      100 |     100 |     100 | 
 infrastructure/delivery/repositories    |     100 |      100 |     100 |     100 | 
  typeorm-delivery.repository.ts         |     100 |      100 |     100 |     100 | 
 infrastructure/payment/controllers      |     100 |      100 |     100 |     100 | 
  payment.controller.ts                  |     100 |      100 |     100 |     100 | 
 infrastructure/payment/dto              |   86.95 |      100 |       0 |   86.95 | 
  payment-request.dto.ts                 |   86.95 |      100 |       0 |   86.95 | 60,65,69
 infrastructure/product/controllers      |     100 |      100 |     100 |     100 | 
  product.controller.ts                  |     100 |      100 |     100 |     100 | 
 infrastructure/product/repositories     |     100 |      100 |     100 |     100 | 
  typeorm-product.repository.ts          |     100 |      100 |     100 |     100 | 
 infrastructure/transaction/repositories |     100 |      100 |     100 |     100 | 
  typeorm-transaction-item.repository.ts |     100 |      100 |     100 |     100 | 
  typeorm-transaction.repository.ts      |     100 |      100 |     100 |     100 | 
 infrastructure/wompi                    |     100 |       50 |     100 |     100 | 
  wompi.service.ts                       |     100 |       50 |     100 |     100 | 43
-----------------------------------------|---------|----------|---------|---------|-------------------
```
---

## 🚀 Deployment

Deployment in progress using AWS infrastructure.

Recommended strategy:

| Component   | Service             |
|-------------|----------------------|
| Frontend    | AWS S3 + CloudFront |
| Backend     | AWS Lambda or EC2   |
| Database    | RDS (PostgreSQL)    |

Once deployed, public URLs will be added here.

---

## 🔐 Security

- No sensitive data (e.g., card numbers) is stored.
- Integration with Wompi sandbox using secure API keys.
- The backend validates card structure without logging real data.
- Planned use of security headers (e.g., Helmet for Express/Nest).

---

## 📄 API Documentation

> Swagger documentation in progress.

Currently available endpoints:

| Method | Endpoint                   | Description                     |
|--------|----------------------------|---------------------------------|
| GET    | `/products`                | Retrieve products with stock    |
| POST   | `/payments/checkout`       | Start payment process           |
| GET    | `/transactions/:id/status` | Check payment result            |

Postman collection will be added to the repository.

---

## 🧾 Final Notes

- Tests coverage ≥ 80% verified with Jest.
- Professionally structured and maintainable codebase.
- Clear separation of concerns: UI, presentation logic, business rules, persistence.
- Ready for production deployment.

---

## 👤 Author

Developed by **Reinaldo Castro** 

