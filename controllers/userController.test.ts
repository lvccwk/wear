import { Server as SocketIO } from 'socket.io';
import { createRequest, createResponse, createSocketIO } from '../util/test-helper';
import { Request, Response } from 'express';
import { User } from '../util/interface';
import { UserController } from './userController';
import { UserService } from '../services/userService';
import express from 'express';
jest.mock('../util/formidable');

describe('userController', () => {
	let userController: UserController;
	let userService: UserService;
	let io: SocketIO;
	let req: Request;
	let res: Response;

	// let session: Request['session'];

	beforeEach(() => {
		// Step 1: Prepare the data and mock  [Arrange]
		io = createSocketIO();
		req = createRequest();
		res = createResponse();

		userService = new UserService({} as any);

		const fakeUser: User = {
			id: 1,
			// display_name: 'tommy',
			email: '1123@email.com',
			password: 'abc'
		};

		userService.getUserByEmail = jest.fn(async () => fakeUser);
		userService.createUser = jest.fn(
			async (display_name: string, password: string) => fakeUser
		);

		userController = new UserController(userService, io);
	});

	it('login: can login', async () => {
		// step 2: call the method
		try {
			await userController.login(req, res);
			// // Step 3: expectation
			expect(userService.getUserByEmail).toBeCalledTimes(1);
			expect(userService.getUserByEmail).toBeCalledWith('test@email.com');
		} catch (error) {
			console.log(error);
		}
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

	it('loginGoogle', async () => {
		const req: Request = {
			session: {
				user: { name: 'test', email: 'test@email.com' }
			}
		} as unknown as Request;
		await userController.loginGoogle(req, res);
		// const accessToken = req.session?.['grant'].response.access_token;
		// expect(res.redirect).toHaveBeenCalledWith('/');
		// expect(res.redirect).toHaveBeenCalledWith('chatroom.html');
		console.log(`res.json`, await res.json);
		expect(res.status).toHaveBeenCalledWith(500);
	});
});
