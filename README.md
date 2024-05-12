

# Wage Access Platform

## Specifications

### Api endpoints

- GET /api/cashouts -> Cashouts history
- POST /api/cashouts -> Creates a cashout order using an sql transaction
- GET /api/cashouts/balance -> available balance for cashout. Calculated from the sum of Earnings minus the sum of successful or pending cashouts
- GET /api/cashouts/currencies -> available currencies to cashout
- POST /api/earnings -> Creates an earning for the employee. Only for admin.

### How it works:

We have tables for earnings and cashouts. Earnings table entries can be from different sources, for testing and potentially the use case I just created a POST endpoint. But it can also come from a cronjob or any other source. 
Each time an employee requests a cashout, we create an sql transaction that sums earnings and cashouts per currency to finally convert it to target currency and verify he has enough funds to withdraw. If that's the case we do a new entry in cashouts with state pending. Transaction processing is out of the scope, so for now it'll remain in pending, I imagine some cases for update to SUCCESS, from manually paying out, to relying on services which accreditation is not immediate, for instance crypto tx verification, or retrials.
For currencies I tried to keep it dynamic also in case tomorrow this expands to mexico, brazil, etc.
I added authentication with kinde. We could easily link that to custom employees ids. For now keeping it simple and using emails for this.

### Database schema:

Note: For simplification porpoises I'm considering the email the employee id. I assume if company has a custom domain and email assigned to each user this shouldn't be a problem. Anyways adding the id is trivial, It would just need an extra step in the frontend to link the email and the id.


```
model User {
  id    String @id @default(cuid())
  email String @unique

  // timestamps
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // relations
  earnings Earnings[]
  cashouts Cashout[]
}

// =====================================
// ============== Currency =============
// =====================================

enum Currency {
  USD
  ARS
}

// =====================================
// ============== Earnings =============
// =====================================

model Earnings {
  id     String   @id @default(cuid())
  amount Float
  currency Currency

  // timestamps
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // relations
  user   User   @relation(fields: [userId], references: [id])
  userId String
}

// ====================================
// ============== Cashout =============
// ====================================

enum CashoutStatus {
  PENDING
  COMPLETED
  CANCELLED
}

model Cashout {
  id     String   @id @default(cuid())
  amount Float
  status CashoutStatus
  currency Currency

  // timestamps
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // relations
  user   User   @relation(fields: [userId], references: [id])
  userId String
}
```


## Instructions

Setup the .env files in both client and server

`client/.env.development`

```
REACT_APP_KINDE_CLIENT_ID="..."
REACT_APP_KINDE_DOMAIN="https://payday.kinde.com"
```

`server/.env.development`

```
POSTGRES_HOST=postgres
POSTGRES_PORT=5432
POSTGRES_USER=postgres
POSTGRES_PASSWORD=password
POSTGRES_DATABASE=postgres
AUTH_JWKS_URI=https://payday.kinde.com/.well-known/jwks
DATABASE_URL="postgresql://postgres:password@postgres:5432/postgress?schema=public"
ADMIN_SECRET="admin_secret"
```


`server/.env` (for prisma cli only)

```
DATABASE_URL="postgresql://postgres:password@localhost:5432/postgress?schema=public"
```

Spin up the containers with `docker compose up --build`

Push the schema to the db (Only for dev) with `npx prisma db push`

Testing:
Register in the app, and create some earning entries for your email with the admin_secret from the .env

```
curl --location 'http://localhost:3050/api/earnings' \
--header 'x-admin-secret: {{admin_secret}}' \
--header 'Content-Type: application/json' \
--data-raw '{
    "for": "{{email}}",
    "currency": "ARS",
    "amount": 100
}'
```
