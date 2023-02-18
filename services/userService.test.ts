import Knex from 'knex';
import { UserService } from '../services/userService';
import { UserController } from '../controllers/userController';
import { hashPassword } from '../util/hash';
import { User } from '../util/interface';
import { displayName } from '../jest.config';

jest.mock('../util/hash');

const knexConfig = require('../knexfile');
const knex = Knex(knexConfig['test']);

describe('userService', () => {
	let userService: UserService;
	let userController: UserController;
	let userIds: number[];
	let fakeUsers: User[];
	let fakePassword: string;

	beforeAll(async () => {
		userService = new UserService(knex);

		fakePassword = '$2a$04$ICdsa9jPS5SAbSpcuYlYUOddMTxe/6EAG2QnVPCSnsaiPu8tMqPjq';

		fakeUsers = [
			{
				display_name: 'Test_User1',
				email: 'admin1@email.com',
				password: fakePassword
			},
			{
				display_name: 'Test_User2',
				email: 'admin2@email.com',
				password: fakePassword
			}
		];
		userIds = (await knex.insert(fakeUsers).into('users').returning('id')).map((m) => m.id);

		// console.log({ userIds });
	});

	it('getUserByEmail: should get user by email', async () => {
		const user = await userService.getUserByEmail(fakeUsers[0].email!);

		console.table(user);
		expect(user).not.toBeNull();
		expect(user.email).toBe(fakeUsers[0].email);
		expect(user).toMatchObject(fakeUsers[0]);
	});

	it('getUserByEmail: should throw an error if user creation fails', async () => {
		const mockKnex = {
			insert: jest.fn().mockReturnThis(),
			returning: jest.fn().mockRejectedValueOnce(new Error('create user fail'))
		};

		await expect(
			userService.createUser.call(
				{ knex: mockKnex },
				fakeUsers[0].display_name!,
				fakeUsers[0].email!,
				fakeUsers[0].password!
			)
		).rejects.toThrow('create user fail');
	});

	it('createUser & getUserByEmail: should be able to create new user ', async () => {
		(hashPassword as jest.Mock) = jest
			.fn()
			.mockImplementation(() => Promise.resolve(fakePassword));
		await userService.createUser('Test_User3', 'admin3@email.com', 'admin');
		const user = await userService.getUserByEmail('admin3@email.com');
		expect(user).toMatchObject({
			display_name: 'Test_User3'
		});
		expect(user).not.toBeNull();
	});

	it('createGoogleUser: should get display_name by google email', async () => {
		const user = await userService.createGoogleUser(fakeUsers[0].email!);

		let emailPrefix = fakeUsers[0].email!.split('@')[0];
		expect(user.id).not.toBeNull();
		expect(user.display_name).toBe(emailPrefix);
		expect(user.email).toBe(fakeUsers[0].email);
		expect(hashPassword).toHaveBeenCalledTimes(1);
		expect(hashPassword).toHaveBeenCalledWith(expect.any(String));
	});

	afterEach(async () => {
		await knex('users').whereIn('id', userIds).del();
		await knex('users')
			.where({
				email: 'admin1@email.com'
			})
			.orWhere({
				email: 'admin2@email.com'
			})
			.del();
	});

	// afterAll(async () => {
	// 	await knex.destroy();
	// });
});
