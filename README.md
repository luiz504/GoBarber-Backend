# API GoBarber
  MVC / CRUD


Table of contents
-----------------
* [Features](#Features)
  * [Account Creation](#Account-Creation)
  * [Login](#Login)
  * [Account Update](#Account-Update)
  * [Upload Files](#Upload-Files)
  * [List Providers](#List-Providers)
  * [Appointment Creation](#Appointment-Creation)
    * [Provider Notification Creation](#Provider-Notification-Creation)
  * [User appointments List](#User-appointments-List)
  * [User Cancel Appointment](#User-Cancel-Appointment)
    * [E-mail Notification Job trigger](#E-mail-Notification-Job-trigger)
  * [Provider Schedule List](#Provider-Schedule-List)
  * [Provider Notification List](#Provider-Notification-List)
  * [Provider Notification Mark Read](#Provider-Notification-Mark-Read)
  * [Provider Notification Available Schedule](#Provider-Notification-Available-Schedule)
* [Middlewares](#Middlewares)
* [Background Jobs](#BackGround-Jobs)

## Features
---

 ### Account Creation

 >Route - post('/users').{body: name, email, password}
 >>Model - User.js /save: id , name, email, password_hash , provider, created/updated_at // Postgres
 >>>Controller - UserController.store
 >>>>View - json({ id, name. email, provider })

 - without token authentication

 - YupValidations: [

   name: { string, required },

   email: { string, type, required },

   password: { string, min6, required },

    ]

 - Validations: [

   email already in use,

    ]
---

 ### Login
>Route - post('/sessions').{body/Json: email, password}
>>Model - User.js File.js
>>>Controller - SessionController.store
>>>>View - json({ user:{ id, name, email, provider, avatar:{ url, path }}, token })

- without token authentication

 - YupValidations: [

   email: { string, type email, required },

   password: { string, required },

    ]

- Validations: [

   email exists in DB,

   password matches,

   ]
---

 ### Account Update

 >Route - put('/users').{body/Json: name, email, oldPassword, password, confirmPassword}.BearerToken({user_id || provider_id})
 >>Model - User.js /save: name, email, password_hash , provider, created/updated_at, avatar_id, File.js /load: id, path // Postgres
 >>>Controller - UserController.update
 >>>>View - json({ id, name, email, provider, avatar:{ url, id, path }})

 - YupValidations: [

   name: { string },

   email: { string, type },

   oldPassword: { string, min6 },

   password: { string, min6, required if 'oldPassword' exits, not equal 'oldPassword' },

   confirmPassword: { required if password exits, equal 'password' }

    ]

  - Validations: [

    email already in use,

    password matchs,

    ]
 ---

 ### Upload Files

 >Route - store('/files').{Multipart: 'file' / img}.BearerToken{user_id || provider_id}
 >>Model - File.js /save: id, name, path, created/updated_at // belongsTo User.js // Postgres
 >>>Controller - FileControllers.store
 >>>>View - json({ url, id, name, path, update/createdAt })
---

 ### List Providers

 >Route - get('/providers').{BearerToken{user_id||provider_id}
 >>Model - User.js / File.js // Postgres
 >>>Controller - ProviderController.index
 >>>>View - json([{ id, name, email, avatar_id, avatar: { url, name, path }}])
---

### Appointment Creation

 >Route - post('/appointments').{BearerToken{user_id||provider_id}
 >>Model - Appointment.js /save: id, date, user_id, provider_id, canceled_at, created/update_at / User.js /load: id, provider, // Postgres
 >>>Controller - AppointmentController.store
 >>>>View - json({ past, cancelable, id, user_id, provider_id, date, created/updatedAt, canceled_at })

 - YupValidations: [

   provider_id: [ number, required ],

   date: [ date, required ],

    ]

 - Validations: [

   provider_id is provider: true,

   Provider and user id are different,

   Past dates,

   Schedule availability,

    ]


  - #### Provider Notification Creation

  >Schema - Notification.js /save: _id, read, content, user, created/updatedAt // MongoDB
 ---

 ### User appointments List

 >Route - get('/appointments').{BearerToken{user_id}.{Query: 'page' / number}
 >>Model - Appontment.js / User.js / File.js // Postgres
 >>>Controller - AppointmentController.index
 >>>>View - json([{ past, cancelable, id, date, provider: { id, name, avatar: { url, id, path }}}])
 ---

### User Cancel Appointment

 >Route - get('/appointments/:id').{BearerToken{user_id}
 >>Model - Appontment.js /save: cancelated_at / User.js /load: name, email // Postgres
 >>>Controller - AppointmentController.delete
 >>>>View - json({ past, cancelable, id, date, canceled_at, created/updatedAt, user_id, provider_id, provider:{ name, email }, user: { name }})

 - Validations: [

   Appointment already canceled,

   Logged user = appointment user,

   2 hours in advance limit,

    ]

 - ### E-mail Notification Job trigger
  >Model - Queue.js / Mail.js //Redis // Bee-queue
  >>Layout - cancellation.hbs
 ---

### Provider Schedule List

 >Route - get('/schedule').{BearerToken{provider_id}}.{Query: 'date' / dateISO}
 >>Model - User.js /Appontment.js // Postgres
 >>>Controller - ScheduleController.index
 >>>>View - json([{ past, cancelable, id, date, canceled_at, created/updatedAt, user_id, provider_id, user:{ name }}])

 - Validations: [

    The logged account is a provider

    ]
 ---

 ### Provider Notification List

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

 ### Provider Notification Mark Read

 >Route - get('/appointments/:id').{BearerToken{provider_id}}
 >>Model - Notification.js /save: read, //MongoDB
 >>>Controller - NotificationController.index
 >>>>View - json([{ read, _id, content, user, creacted/updatedAt}])
 ---

### Provider Notification Available Schedule

 >Route - get('/appointments').{BearerToken{provider_id}}.{Query: 'date' / timesStamp}
 >>Model - Appointment.js /load:  //Postgress
 >>>Controller - NotificationController.index
 >>>>View - json([{ time, value, available }])

  - Validations: [

    Date is valid

    ]
---
  ## Middlewares
---
 - [x] Bearer Token - Authentication JTW - [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken)
 - Config - /src/config/auth.js
 - Model - /src/app/middlewares/authentication.js
 - validations: [

    * token provided,

    * token integrity,

    ]
---
- [x] Multipart/form-data input - [multer](https://github.com/expressjs/multer)
- Config: /src/config/multer.js
- Output: /tmp/upload - filename manipulation randon hexadecimal string + originalfile .ext

---
- [x] Cross-origin resource sharing - [cors](https://github.com/expressjs/cors)
- File: /src/app.js
---
- [x] Json - JavaScript Object Notation
- File: /src/app.js
---
- [x] Exeption Handler
- File: /src/app.js
- development - [youch](https://github.com/poppinss/youch)
- !development - status(500)

## Background Jobs

- [x] E-mail trap - [TrampMail](https://mailtrap.io/)
- Config: /src/config/mail.js

- [x] E-mail template engine - / [handlebars](https://github.com/wycats/handlebars.js/)
- Model: /src/lib/Mail.js
- Layouts: /src/app/mail/*
---
- [x] Jobs and Queue - [Bee-Queue](https://github.com/bee-queue/bee-queue)
- Queue Model: /src/lib/Queue.js
- Jobs Models: /src/app/jobs/*
- Queue DB : Redis
- Redis Config: /src/config/redis.js
---

## Errors handles after deploy manager
- [x] - [Sentry](https://sentry.io)
- Config: /src/config/sentry
- File: /src/app.js


## Instructions to run the project

Requirements:

[Docker](https://docs.docker.com/install/) used images : [Postgres](https://hub.docker.com/_/postgres), [MongoDB](https://hub.docker.com/_/mongo), [Redis Alpine](https://hub.docker.com/_/redis).

- Clone the project.

- Run  `$ yarn` to install modules.

- Config `.env` file based to `.env.example`

- Run `$ yarn start` main application

- Run `$ yarn queue` to run backgroundJobs.

- Requests -

Insomnia - Import insominia_xxxx-xx-xx.json to your Insomnia app

[GobarberWeb](https://github.com/luiz504/GoBarber-Web) - Provider DashBoard

Gobarber Mobile - Users App















