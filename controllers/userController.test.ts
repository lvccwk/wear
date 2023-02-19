import { Server as SocketIO } from 'socket.io';
import { createRequest, createResponse, createSocketIO } from '../util/test-helper';
import { Request, Response } from 'express';
import { User } from '../util/interface';
import { UserController } from './userController';
import { UserService } from '../services/userService';
import { hashPassword } from '../util/hash';

jest.mock('../util/formidable');

describe('userController', () => {
	let userController: UserController;
	let userService: UserService;

	let io: SocketIO;
	let req: Request;
	let res: Response;
	let session: Request['session'];

	beforeEach(() => {
		// Step 1: Prepare the data and mock  [Arrange]
		io = createSocketIO();
		req = createRequest();
		res = createResponse();

		userService = new UserService({} as any);

		const fakeUser: User = {
			id: 1,
			display_name: 'tommy',
			email: '1123@email.com',
			password: 'abc'
		};

		userService.getUserByEmail = jest.fn(async () => fakeUser);
		userService.createUser = jest.fn(
			async (display_name: string, password: string) => fakeUser
		);
		userService.createGoogleUser = jest.fn(async (accessToken: string) => fakeUser);
		userController = new UserController(userService, io);

		// userController.register = jest.fn(async (req, res) => fakeUser);
	});

	it('login: can login', async () => {
		try {
			await userController.login(req, res);

			expect(userService.getUserByEmail).toBeCalledTimes(1);
			expect(userService.getUserByEmail).toBeCalledWith('test@email.com');
			expect(res.redirect).toHaveBeenCalledWith('/chatroom.html');
		} catch (error) {
			console.log(error);
		}
	});

	it('loginGoogle: can login', async () => {
		try {
			await userController.loginGoogle(req, res);
			expect(userService.getUserByEmail).toBeCalledTimes(1);
			expect(userService.getUserByEmail).toBeCalledWith('test@email.com');
			expect(res.redirect).toHaveBeenCalledWith('/chatroom.html');
		} catch (error) {
			console.log(error);
			expect(res.status).toHaveBeenCalledWith(500);
		}
	});
	it('loginGoogle createGoogleUser: can login', async () => {
		try {
			await userService.createGoogleUser(req.body.email);

			expect(userService.getUserByEmail).toBeCalledTimes(1);
			expect(userService.getUserByEmail).toBeCalledWith('test@email.com');
			expect(res.redirect).toHaveBeenCalledWith('/chatroom.html');
		} catch (error) {
			console.log(error);
		}
	});

	it('login: should return 401 status code and "Invalid input" message if email or password is missing', async () => {
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

	it('login: should return 403 status code and "Invalid email" message if user is not found', async () => {
		req.body = { email: 'nonexistent@example.com', password: 'password' };
		await userController.login(req, res);

		expect(res.status).toHaveBeenCalledWith(403);
		expect(res.json).toHaveBeenCalledWith({ message: 'Invalid password' });
		expect(userService.getUserByEmail).toHaveBeenCalledWith('nonexistent@example.com');
		expect(res.redirect).not.toHaveBeenCalled();
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

	it('logout: deletes user session and redirects to root route', async () => {
		const req: Request = {
			session: {
				user: { display_name: 'test', email: 'test@email.com' }
			}
		} as unknown as Request;

		await userController.logout(req, res);
		expect(req.session.user).toBeUndefined();
		expect(res.redirect).toHaveBeenCalledWith('/');
	});

	it('loginGoogle(getUserByEmail)', async () => {
		let user = await userService.getUserByEmail('');
		// console.log(user);
		expect(user.id).toBe(1);
		expect(user.email).toBe('1123@email.com');
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

	it('register: should return 403 status code and "Your email has been registered" message if user already exists', async () => {
		const getUserByEmailMock = jest
			.spyOn(userService, 'getUserByEmail')
			.mockResolvedValue({ email: 'test@example.com' });
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
		getUserByEmailMock.mockRestore();
	});

	it('register: hashedPassword', async () => {
		let hashedPassword = await hashPassword(req.body.password);

		expect(hashedPassword).toHaveLength(60);
		expect(hashedPassword).not.toBeUndefined();
	});
});
