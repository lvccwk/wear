import type { Knex } from 'knex';
import { env } from './util/env';

const config: { [key: string]: Knex.Config } = {
	development: {
		client: 'postgresql',
		debug: true,
		connection: {
			host: env.DB_HOST,
			database: env.DB_NAME,
			user: env.DB_USERNAME,
			password: env.DB_PASSWORD
		},
		pool: {
			min: 2,
			max: 10
		},
		migrations: {
			tableName: 'knex_migrations'
		}
	},

	test: {
		client: 'postgresql',
		connection: {
			database: env.TEST_DB_NAME,
			user: env.DB_USERNAME,
			password: env.DB_PASSWORD
		},
		pool: {
			min: 2,
			max: 10
		},
		migrations: {
			tableName: 'knex_migrations'
		}
	},

	staging: {
		client: 'postgresql',
		connection: {
			database: 'my_db',
			user: 'username',
			password: 'password'
		},
		pool: {
			min: 2,
			max: 10
		},
		migrations: {
			tableName: 'knex_migrations'
		}
	},

	production: {
		client: 'postgresql',
		connection: {
			database: 'my_db',
			user: 'username',
			password: 'password'
		},
		pool: {
			min: 2,
			max: 10
		},
		migrations: {
			tableName: 'knex_migrations'
		}
	}
};

module.exports = config;
