import { Server as SocketIO } from 'socket.io';
import { createRequest, createResponse, createSocketIO } from '../util/test-helper';
import { Request, Response } from 'express';
import { User } from '../util/interface';
// import { logger } from '../utils/logger'

import { UserController } from './userController';
import { UserService } from '../services/userService';
// import { logger } from '../util/logger';
jest.mock('../util/formidable');
// jest.mock('../utils/logger')

describe('userController', () => {
	let userController: UserController;
	let userService: UserService;
	let io: SocketIO;
	let req: Request;
	let res: Response;
	// let fakeMemo: Memo;
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

	it.only('can login', async () => {
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
});
