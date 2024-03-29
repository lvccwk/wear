import Knex from 'knex';
import { UserService } from '../services/userService';
import { hashPassword } from '../util/hash';
import { User } from '../util/interface';
import { createRequest } from '../util/test-helper';
import { Request, Response } from 'express';

jest.mock('../util/hash');

const knexConfig = require('../knexfile');
const knex = Knex(knexConfig['test']);

describe('userService', () => {
	let userService: UserService;
	let userIds: number[];
	let fakeUsers: User[];
	let fakePassword: string;
	let req: Request;
	let res: Response;

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
	});

	it('getUserByEmail: should get user by email', async () => {
		const user = await userService.getUserByEmail(fakeUsers[0].email!);
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
		await userService.createUser('Test_User3', 'admin3@email.com', undefined);
		const user = await userService.getUserByEmail('admin3@email.com');
		expect(user).toMatchObject({
			display_name: 'Test_User3'
		});
		expect(user).not.toBeNull();
		expect(hashPassword).toHaveBeenCalledTimes(1);
		expect(hashPassword).toHaveBeenCalledWith(expect.any(String));

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
		expect(hashPassword).toHaveBeenCalledTimes(3);
		expect(hashPassword).toHaveBeenCalledWith(expect.any(String));
	});

	it('getGoogleUserprofile', async () => {
		const accessToken =
			'ya29.a0AVvZVspoxonC3aX5LGv-dNb5xaWMITBonrBNrexVwNlarFim89OZxXE_Pv1NZgHGqziIqSxdHO4VZTRyKDc0SsNUdlZvsQunLLUeZ93Oe9IUVwBEj95woqI6TDTMLZAZ-u9iNAm3qu00xpQn1-TYPvHJpdG1aCgYKAeMSARISFQGbdwaIm4nTwW_1SvW12UsZYShQ-A0163-XHjNIGiYmtKUhD9AAAD';

		const user = await userService.getGoogleUserprofile(accessToken);

		expect(user.email).not.toBeNull();
		expect(user.email).toBe(undefined);
	});

	it('getMyInfo', async () => {
		const user = await userService.getMyInfo(1);

		expect(user).not.toBeNull();
		expect(user[0].email).toBe('admin@com');
		expect(user).toMatchObject([
			{
				email: 'admin@com',
				password: '$2a$04$TzJa0MXLMhfAiToI5o.eNuiuTNVf7MWmY08.BCqCPRJ4O7VPePX7S',
				display_name: 'admin'
			}
		]);
	});
	it('changeMyInfo: ok', async () => {
		await userService.changeMyInfo(3, 'admin-change', '1admin@com', 'admin');

		expect(hashPassword).toBeCalledTimes(4);
	});

	it('changeMyInfo: fail email', async () => {
		try {
			req = createRequest();

			await userService.changeMyInfo(
				req.body.id,
				req.body.name,
				undefined as any,
				req.body.password
			);

			expect(hashPassword).toBeCalledTimes(1);
		} catch (e) {
			expect(e).toEqual(new Error('update user Info fail'));
		}
	});

	it('changeMyInfo: fail email', async () => {
		try {
			req = createRequest();

			await userService.changeMyInfo(
				req.body.id,
				req.body.name,
				undefined as any,
				req.body.password
			);

			expect(hashPassword).toBeCalledTimes(1);
		} catch (e) {
			expect(e).toEqual(new Error('update user Info fail'));
		}
	});

	it('changeMyInfo: fail password', async () => {
		try {
			req = createRequest();

			await userService.changeMyInfo(
				req.body.id,
				req.body.name,
				req.body.id,
				undefined as any
			);

			expect(hashPassword).toBeCalledTimes(1);
		} catch (e) {
			expect(e).toEqual(new Error('update user Info fail'));
		}
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
});
