

# Wage Access Platform

## Instructions

`docker compose up --build`

`npx prisma db push` Only for dev

## TODO:

- Connect back in front
- Limit decimals in amount input, maybe do string instead?
- Better communicate not enough funds

## Specifications

Api endpoints

- GET /api/cashouts -> cashouts history
- POST /api/cashouts -> Creates a cashout order using an sql transaction
- GET /api/cashouts/balance -> available balance for cashout. Calculated from the sum of Earnings minus the sum of successful or pending cashouts
- GET /api/cashouts/currencies -> available currencies to cashout

Database schema

Note: For simplification porpoises I'm considering the email the employee id. I assume if company has a custom domain and email assigned to each user this shouldn't be a problem. Anyways adding the id is trivial, It would just need an extra step in the frontend to link the email and the id.


```
model User {
    id
    email string @unique
}
```


```
enum CashoutStatus {
    PENDING
    SUCCESS
    CANCELED
}

model Cashout {
    
}
```


```
model Earnings {

}
```
