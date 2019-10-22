# API GoBarber

MVC / CRUD

[GoBarber-WebApp].(https://github.com/luiz504/GoBarber-Web)

## Features

 - [x] Account creation

 >Route - post('/users').{body: name, email, password}.
 >>Model - User.js /save : id , name, email, password_hash , provider, created/updated_at // Postgres
 >>>Controller - UserController.store.
 >>>>View - json({ id, name. email, provider }).


- [ ] Authentication JTW
> Routes -



















