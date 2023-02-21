import Knex from 'knex';
import { checkPassword, hashPassword } from '../util/hash';

const knexConfig = require('../knexfile');
const knex = Knex(knexConfig['test']);

describe('userService', () => {
	it('checkPassword & hassPassword : ok', async () => {
		const password = '123';
		let hashedPassword = await hashPassword(password);
		let checkedPassword = await checkPassword(password, hashedPassword);

		expect(hashedPassword).not.toBeNull();
		expect(hashedPassword).toHaveLength(60);
		expect(checkedPassword).not.toBeNull();
		expect(checkedPassword).toBe(true);
	});
});
