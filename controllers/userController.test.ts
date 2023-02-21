import { Server as SocketIO } from 'socket.io';
import {
	createLoginAcRequest,
	createRegAcRequest,
	createRequest,
	createResponse,
	createResponse500,
	createResponseLogin,
	createResponseLogin402
} from '../util/test-helper';
import { Request, Response } from 'express';
import { GoogleUser, User } from '../util/interface';
import { UserController } from './userController';
import { UserService } from '../services/userService';
import { checkPassword, hashPassword } from '../util/hash';
import Knex from 'knex';
const knexConfig = require('../knexfile');
const knex = Knex(knexConfig['test']);
jest.mock('../util/formidable');
jest.mock('../util/hash');

describe('userController', () => {
	let userController: UserController;
	let userService: UserService;
	let io: SocketIO;
	let req: Request;
	let res: Response;
	let session: Request['session'];
	let fakeGoogleUser: GoogleUser;
	beforeEach(() => {
		// io = createSocketIO();
		req = createRequest();
		res = createResponse();

		userService = new UserService({} as any);
		userController = new UserController(userService, io);

		const fakeUser: User = {
			id: 1,
			display_name: 'tommy',
			email: '1123@email.com',
			password: 'abc'
		};

		const createFakeUser: User = {
			name: 'new-user2',
			email: 'new@email.com',
			password: 'new1',
			confirmPassword: 'new1'
		};

		const createFakeGoogleUser: User = {
			id: 1,
			display_name: 'test',
			email: 'test123@email.com',
			password: 'test123'
		};

		fakeGoogleUser = {
			id: '112690466894368960587',
			email: '123123213@live.hk',
			verified_email: true,
			name: 'Lawrence Tang',
			given_name: 'Lawrence',
			family_name: 'Tang',
			picture:
				'https://lh3.googleusercontent.com/a/AEdFTp40XKsgAR34z26FhM0yMvYyuw1GV9Ra_6p-65X4=s96-c',
			locale: 'en-GB'
		};
		(hashPassword as jest.Mock).mockReturnValue(true);
		userController.login = jest.fn(async () => fakeUser) as any;
		userService.getUserByEmail = jest.fn(async () => fakeUser);
		// userController.register = jest.fn(async () => createFakeUser) as any;
		userService.createUser = jest.fn(
			async (display_name: string, password: string) => fakeUser
		);
		userService.getGoogleUserprofile = jest.fn(async (access_token: string) => fakeGoogleUser);
		userService.createGoogleUser = jest.fn(async (email: string) => createFakeGoogleUser);
		userController = new UserController(userService, io);
	});

	it('login : !isPasswordValid', async () => {
		(checkPassword as jest.Mock).mockReturnValue(false);
		req = createLoginAcRequest();
		// res = createResponseLoginOk();
		await userController.login(req, res);
		expect(userService.getUserByEmail).toBeCalledTimes(1);
		expect(userService.getUserByEmail).toBeCalledWith('new@email.com');

		expect(res.status).toBeCalledWith(403);
		expect(res.json).toBeCalledWith({ message: 'Invalid password' });
	});

	it('login : can login', async () => {
		(checkPassword as jest.Mock).mockReturnValue(true);
		req = createLoginAcRequest();
		await userController.login(req, res);
		expect(userService.getUserByEmail).toBeCalledTimes(1);
		expect(userService.getUserByEmail).toBeCalledWith('new@email.com');
		// expect(checkPassword).toBeCalledTimes(1);
		expect(req.body.password).toBeNull;
		expect(res.redirect).toHaveBeenCalledWith('/chatroom.html');
		expect(res.redirect).toBeCalledTimes(1);
	});

	it('login: status 500 login fail', async () => {
		res = createResponseLogin();
		await userController.login(req.body, res);
		expect(res.json).toBeCalledWith({ message: '[USR001] - Server error' });
		expect(res.status).toBeCalledWith(500);
	});

	it('login: status 402  Invalid email', async () => {
		userService.getUserByEmail = jest.fn(async () => undefined) as any;
		res = createResponseLogin402();

		await userController.login(req, res);

		expect(userService.getUserByEmail).toBeCalledTimes(1);
		expect(res.json).toBeCalledWith({ message: 'Invalid email' });
		expect(res.status).toBeCalledWith(402);
	});

	it('login: 401 status code and "Invalid input" message if email or password is missing', async () => {
		req.body = { email: 'test@example.com' };
		await userController.login(req, res);
		expect(res.status).toHaveBeenCalledWith(401);
		expect(res.json).toHaveBeenCalledWith({ message: 'Invalid input' });

		req.body = { password: 'password' };
		await userController.login(req, res);
		expect(res.status).toHaveBeenCalledWith(401);
		expect(res.json).toHaveBeenCalledWith({ message: 'Invalid input' });

		req.body = {};
		expect(res.status).toHaveBeenCalledWith(401);
		expect(res.json).toHaveBeenCalledWith({ message: 'Invalid input' });

		expect(userService.getUserByEmail).not.toHaveBeenCalled();
		expect(res.redirect).not.toHaveBeenCalled();
	});

	it('loginGoogle: registered account can login ', async () => {
		req = createLoginAcRequest();
		await userController.loginGoogle(req.body.email, res);

		expect(userService.getUserByEmail).toBeCalledTimes(1);
		expect(userService.getGoogleUserprofile).toBeCalledTimes(1);
		expect(userService.getUserByEmail).toBeCalledWith(fakeGoogleUser.email);
		expect(res.redirect).toHaveBeenCalledWith('/chatroom.html');
	});

	it('loginGoogle: login and create new user ', async () => {
		userService.getUserByEmail = jest.fn(async () => undefined) as any;

		await userController.loginGoogle(req, res);
		let accessToken = req.session?.['grant'].response.access_token;
		const googleUserProfile = await userService.getGoogleUserprofile(accessToken);
		expect(googleUserProfile).toMatchObject(fakeGoogleUser);
		expect(userService.getGoogleUserprofile).toBeCalledWith('google_test_token');
		expect(userService.getGoogleUserprofile).toBeCalledTimes(2);
		expect(userService.getUserByEmail).toBeCalledWith(fakeGoogleUser.email);

		expect(userService.createGoogleUser).toBeCalledTimes(1);
		expect(res.redirect).toBeCalledTimes(1);
		expect(res.redirect).toHaveBeenCalledWith('/chatroom.html');
	});

	it('loginGoogle: all fail', async () => {
		res = createResponse500();
		await userController.loginGoogle(req.body.session, res);
		expect(res.json).toBeCalledWith({ message: '[USR0033] - Server error' });
		expect(res.status).toBeCalledWith(500);
	});

	it('getSessionProfile: should return the user from the session ', () => {
		const req: Request = {
			session: {
				user: { display_name: 'test', email: 'test@email.com' }
			}
		} as unknown as Request;

		userController.getSessionProfile(req, res);
		expect(res.json).not.toBeNull();
		expect(res.json).toHaveBeenCalledTimes(1);
		expect(res.json).toHaveBeenCalledWith(req.session.user);
	});

	it('getSessionProfile: return {} ', () => {
		userController.getSessionProfile(req, res);
	});

	it('logout: deletes user session and redirects to home page', async () => {
		try {
			const req: Request = {
				session: {
					user: { display_name: 'test', email: 'test@email.com' }
				}
			} as unknown as Request;

			await userController.logout(req, res);
			expect(req.session.user).toBeUndefined();
			expect(req.session).not.toHaveProperty('user');
			expect(res.redirect).toHaveBeenCalledWith('/');
		} catch (error) {
			expect(res.status).toHaveBeenCalledWith(500);
			expect(res.json).toHaveBeenCalledWith({ message: '[USR0033] - Server error' });
		}
	});

	it('logout: logout fail', async () => {
		res = createResponse500();
		await userController.logout(req.body, res);

		expect(res.status).toHaveBeenCalledWith(500);
		expect(res.json).toHaveBeenCalledWith({ message: '[USR002] - Server error' });
	});

	it('register: 401 if email / password / name is missing', async () => {
		req.body = { email: 'test@example.com' };
		req.body = req.body.email;
		await userController.register(req, res);
		expect(res.status).toHaveBeenCalledWith(401);
		expect(res.json).toHaveBeenCalledWith({ message: 'Invalid input' });

		req.body = { password: 'password' };
		req.body = req.body.password;
		await userController.register(req, res);
		expect(res.status).toHaveBeenCalledWith(401);
		expect(res.json).toHaveBeenCalledWith({ message: 'Invalid input' });

		req.body = { name: 'test' };
		await userController.register(req, res);
		expect(res.status).toHaveBeenCalledWith(401);
		expect(res.json).toHaveBeenCalledWith({ message: 'Invalid input' });

		req.body = {};
		await userController.register(req, res);
		expect(res.status).toHaveBeenCalledWith(401);
		expect(res.json).toHaveBeenCalledWith({ message: 'Invalid input' });

		expect(res.redirect).not.toHaveBeenCalled();
	});

	it('register: 402 status code and "password and confirm password are not same" message if passwords do not match', async () => {
		req.body = {
			name: 'test',
			email: 'test@example.com',
			password: 'password',
			confirmPassword: 'password2'
		};
		await userController.register(req, res);
		expect(res.status).toHaveBeenCalledWith(402);
		expect(res.json).toHaveBeenCalledWith({
			message: 'password and confirm password are not same'
		});
	});

	it('register: 403 status code and "Your email has been registered" message if user already exists', async () => {
		req.body = {
			name: 'test_admin',
			email: 'test@example.com',
			password: 'password',
			confirmPassword: 'password'
		};
		await userController.register(req, res);
		expect(res.status).toHaveBeenCalledWith(403);
		expect(res.json).toHaveBeenCalledWith({ message: 'Your email has been registered' });
		expect(userService.getUserByEmail).toHaveBeenCalledWith('test@example.com');
	});

	it('register & hashedPassword : Server error ', async () => {
		(hashPassword as jest.Mock).mockReturnValue('A'.repeat(60));
		req.body = {
			name: 'test11',
			email: 'test@example.com',
			password: 'password'
		};

		res = createResponse500();
		await userController.register(req.body, res);
		expect(res.status).toBeCalledWith(500);
		expect(res.json).toBeCalledWith({ message: '[USR002] - Server error' });
	});

	it('register & hashedPassword : register ok  ', async () => {
		(hashPassword as jest.Mock).mockReturnValue('A'.repeat(60));
		(userService.getUserByEmail as jest.Mock).mockReturnValue(false);
		req = createRegAcRequest();
		await userController.register(req, res);

		expect(userService.createUser).toBeCalledTimes(1);
		expect(userService.getUserByEmail).toBeCalledTimes(1);
		expect(hashPassword).toBeCalledTimes(1);
		expect(res.json).toBeCalledWith({ message: 'ok' });
	});
	// afterEach(async () => {
	// 	await knex('users').whereIn('id', userIds).del();
	// 	await knex('users')
	// 		.where({
	// 			email: 'admin1@email.com'
	// 		})
	// 		.orWhere({
	// 			email: 'admin2@email.com'
	// 		})
	// 		.orWhere({
	// 			email: 'admin3@email.com'
	// 		})
	// 		.del();
	// });
});
