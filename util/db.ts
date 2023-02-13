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

interface users {
	id: number;
	display_name: string;
	email: string;
	password: string;
	created_at: Date;
	updated_at: Date;
}

async function main() {
	const txn = await knex.transaction();
	try {
		let students = await knex.select<users>('*').from('users');
		console.table(students);
		await txn.commit();
	} catch (error) {
		await txn.rollback();
	} finally {
		knex.destroy();
	}
}
main();
