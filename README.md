

# Wage Access Platform


Api endpoints

- GET /api/cashout/balance -> available balance for cashout
- GET /api/cashout/currencies -> available currencies to cashout
- GET /api/cashout/history -> transactions history
- POST /api/cashout -> Creates a cashout order

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
