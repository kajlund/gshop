# REST API for the gShop application

The server is implemented as a Node.js/Express server using the Knex.js query builder for querying a SQL database.

### Commands

- Create migration: `npx knex --knexfile=./src/db/knexfile.js migrate:make <name>`
- Create Seed: `npx knex --knexfile ./src/db/knexfile.js seed:make <name>`

### Dependencies

```bash
npm i bcryptjs cookie-parser cors date-fns dotenv express express-async-errors http-status-codes jsonwebtoken knex nanoid nodemailer pino pino-http pino-pretty validator
```

### DevDependencies

```bash
npm i -D eslint eslint-config-prettier eslint-plugin-prettier nodemon prettier sqlite3
```
