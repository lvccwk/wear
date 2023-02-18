import Knex from 'knex';
import { UserService } from '../services/userService';
import { UserController } from '../controllers/userController';
import { createRequest, createResponse } from '../util/test-helper';
import { hashPassword } from '../util/hash';
import { User } from '../util/interface';

jest.mock('../util/hash');

const knexConfig = require('../knexfile');
const knex = Knex(knexConfig['test']);

describe('userService', () => {
	let userService: UserService;
	// let userController: UserController;
	let userIds: number[];
	let fakeUsers: User[];
	let fakePassword: string;
	// let req: Request;
	// let res: Response;

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
		expect(
			userService.getUserByEmail.call({ knex: Knex }, fakeUsers[0].display_name!)
		).rejects.toThrow('get email fail');
	});

	it('createUser: should be able to create new user ', async () => {
		(hashPassword as jest.Mock) = jest
			.fn()
			.mockImplementation(() => Promise.resolve(fakePassword));
		await userService.createUser('Test_User3', 'admin3@email.com', 'admin');
		const user = await userService.getUserByEmail('admin3@email.com');
		expect(user).toMatchObject({
			display_name: 'Test_User3'
		});
		expect(user).not.toBeNull();
		expect(
			userService.createUser.call(
				{ knex: Knex },
				fakeUsers[0].display_name!,
				fakeUsers[0].email!,
				fakeUsers[0].password!
			)
		).rejects.toThrow('create user fail');
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

	it.only('getGoogleUserprofile', async () => {
		const accessToken =
			'ya29.a0AVvZVsouQoIbtnXxeIIAV0cwYX53WCfH1dmqN3N8CtVWVFwe7ujVemqbcJZP5BYfkQGe2lLgL-C7WmKQdpvfAGy14iRwo4OLSAMUNwdtXJ3Xaj9MMdJh7lo5UT1GOlZz7Hnuszlb3Juvm3GuAEamn6rzJerIaCgYKAe8SARISFQGbdwaI6Z4k_zv3RfK7ySTINGnYfA0163';
		const user = await userService.getGoogleUserprofile(accessToken);

		console.log(user);
		expect(user.email).not.toBeNull();
		expect(user.email).toBe('lawrence3536@outlook.com');
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
			.orWhere({
				email: 'admin3@email.com'
			})
			.del();
	});

	// afterAll(async () => {
	// 	await knex.destroy();
	// });
});
