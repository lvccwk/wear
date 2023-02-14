### env setup

yarn add knex pg @types/pg
yarn knex init -x ts

### database connection

npx gen-env .

DB_NAME=wear
DB_USERNAME=postgres
DB_PASSWORD=postgres

### database setup

run

1. Plain SQL
   ../database folder/wear.session.sql
   or
2. SQL Query Builder : knex sql
   yarn knex migrate:up

### local 8080

yarn install
yarn run dev

//yarn add sqlite3 --save 
