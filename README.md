# API GoBarber

MVC / CRUD

[GoBarber-WebApp](https://github.com/luiz504/GoBarber-Web)

## Features
---

 - [x] Account creation

 >Route - post('/users').{body: name, email, password}
 >>Model - User.js /save: id , name, email, password_hash , provider, created/updated_at // Postgres
 >>>Controller - UserController.store
 >>>>View - json({ id, name. email, provider })

 - without token authentication

 - yupValidation: [

   name: { string, required },

   email: { string, type, required },

   password: { string, min6, required },

    ]

 - Validations: { email: exists }
---

 - [x] Login
>Route - post('/sessions').{body/Json: email, password}
>>Model - User.js
>>>Controller - SessionController.store
>>>>View - json({ id, name. email, provider, token })

- without token authentication

 - yupValidation: [

   email: { string, type, required },

   password: { string, required },

    ]

- Validations: [
   email: exists,
   password: match,
   ]
---

 - [x] Account update

 >Route - put('/users').{body/Json: name, email, oldPassword, password, confirmPassword}.BearerToken({user id})
 >>Model - User.js /save: name, email, password_hash , provider, created/updated_at, avatar_id // Postgres
 >>>Controller - UserController.update
 >>>>View - json({ id, name, email, provider, avatar_id })

 - yupValidation: [

   name: { string },

   email: { string, type },

   oldPassword: { string, min6 },

   password: { string, min6, required if 'oldPassword' exits, not equal 'oldPassword' },

   confirmPassword: { required if password exits, equal 'password' }

    ]
 ---

 - [x] Upload Files

 >Route - store('/files').{body/Multipart: 'file', img }.BearerToken({user id})
 >>Model - File.js /save: id, name, path, created/updated_at // belongsTo User.js // Postgres
 >>>Controller - FileControllers.update
 >>>>View - json({ id, name, path, update/created_at })
---

 - [x] Providers list

 >Route - get('/providers').{BearerToken}
 >>Model - User.js / File.js // Postgres
 >>>Controller - ProviderController.index
 >>>>View - json({ provider: id, name, email, avatar_id, { avatar: name, path, url }})
---

- [x] Appointment creation

 >Route - post('/appointments').e}.BerarerToken({user_id})
 >>Model - Appointment.js /save: id, date, user_id, provider_id, created/update_at // belongsTo User.js // Postgres
 >>>Controller - AppointmentController.store
 >>>>View - json({ id, user_id, provider_id, date, created/updated_at, canceled_at })

 - yupValidation: [

   provider_id: [ number, required ],

   date: [ date, required ],

    ]

 - Validations: [
   provider and user are diferent,
   pastdate,
   hour availability,
    ]

    * Provider Notification -

    >Schema - Notification.js /save: _id, read, content, user_id, created/updated_at // MongoDB
 ---

 - [x] Users appointment list

 >Route - get('/appointments').{BearerToken{user_id}}
 >>Model - User.js / File.js /Appontment.js // Postgres
 >>>Controller - AppointmentController.index
 >>>>View - json({ id, date, provider: { id, name, avatar: { url, id, path }})
 ---

  - [x] Users appointment calcelation

 >Route - get('/appointments/:id').{BearerToken{user_id}}
 >>Model - Appontment.js /save: cancelated_at // Postgres
 >>>Controller - AppointmentController.delete
 >>>>View - json({ id, date, canceled_at, created/updated_at, user_id, provider_id})

 - Validations: [
   logged user = appointment user,
   2 hous in advance limit
    ]
 ---

 - [x] Provider schedule list

 >Route - get('/schedule').{BearerToken{provider_id}}
 >>Model - User.js /Appontment.js // Postgres
 >>>Controller - ScheduleController.index
 >>>>View - json([{ id, date, canceled_at, created/updated_at, user_id, provider_id }])

 - [x] Provider notification list

 >Route - get('/appointments').{BearerToken{provider_id}}
 >>Model - User.js / Notification.js // Postgres //MongoDB
 >>>Controller - NotificationController.index
 >>>>View - json([{ read, _id, content, user, creacted/updatedAt}])

  - Validations: [
   logged account is provider
    ]
  - misc: [
    pagination: 20items,
    sort: createdAt 'desceding'
  ]
 ---

 - [x] Provider notification mark read

 >Route - get('/appointments/:id').{BearerToken{provider_id}}
 >>Model - Notification.js /save: read, //MongoDB
 >>>Controller - NotificationController.index
 >>>>View - json([{ read, _id, content, user, creacted/updatedAt}])
---


  ## Middlewares
---
 - [x] Bearer Token - Authentication JTW
 - validations: [

    * token provided,

    * token integrity,

    ]

  ---
-[x] Multipart/form-data input - multer
- output: filename manipulation randon hexadecimal string + originalfile .ext

---



















