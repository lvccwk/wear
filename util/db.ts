// import pg from 'pg'
// import { env } from './env'

// export const client = new pg.Client({
// 	database: env.DB_NAME,
// 	user: env.DB_USERNAME,
// 	password: env.DB_PASSWORD
// })

// client.connect()

import Knex from 'knex';

const knexConfigs = require('../knexfile');
const configMode = process.env.NODE_ENV || 'development';
const knexConfig = knexConfigs[configMode];
export const knex = Knex(knexConfig);
