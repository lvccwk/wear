import { Server as SocketIO } from 'socket.io';
import {
	createRequest,
	createRequestId,
	createRequestWithoutParams,
	createResponse
} from '../util/test-helper';
import { Request, Response } from 'express';
import Knex from 'knex';
import { CartController } from './cartController';
import { CartService } from '../services/cartService';
import { formParsePromise } from '../util/formidable';
import { Product, User } from '../util/interface';
const knexConfig = require('../knexfile');
const knex = Knex(knexConfig['test']);

jest.mock('../util/formidable');
// jest.mock('../util/hash');

describe('userController', () => {
	let cartController: CartController;
	let cartService: CartService;
	let io: SocketIO;
	let req: Request;
	let res: Response;
	let session: Request['session'];

	beforeEach(() => {
		// io = createSocketIO();
		req = createRequest();
		res = createResponse();
		(formParsePromise as jest.Mock).mockReturnValue({
			fields: { content: 'yyy' },
			files: {
				image: {
					newFilename: 'yyy.jpeg'
				}
			}
		});
		cartService = new CartService({} as any);
		cartController = new CartController(cartService, io);
	});

	it('addToCart : ok', async () => {
		try {
			req = createRequestId();
			// (cartService.postCart as jest.Mock).mockReturnValue({});
			let result = await cartController.addToCart(req, res);
			await cartService.postCart(req.body.image, req.body.id);
			// expect(cartService.postCart).toBeNull;
			expect(formParsePromise).toBeCalledTimes(1);
			expect(res.json).toBeCalledWith({ message: 'add to cart success' });
		} catch (e) {}
	});

	it('addToCart : 500 fail - [CAR001] - Server error', async () => {
		await cartController.addToCart(req, res);
		expect(cartService.postCart).toBeNull;
		expect(res.status).toBeCalledWith(500);
		expect(res.json).toBeCalledWith({ message: '[CAR001] - Server error' });
	});

	it('goToCart : ok', async () => {
		// (formParsePromise as jest.Mock).mockReturnValue( || '');
		try {
			req = createRequestId();
			await cartController.goToCart(req, res);
			let result = await cartService.getCart(req.body.id);
			expect(formParsePromise).toBeCalledTimes(1);
			expect(res.json).toBeCalledWith({
				data: result,
				message: 'Get cart success'
			});
		} catch (e) {
			expect(res.status).toBeCalledWith(500);
			expect(res.json).toBeCalledWith({ message: '[CAR002] - Server error' });
		}
	});

	it('goToCart : 500 fail - [CAR002] - Server error', async () => {
		await cartController.goToCart(req, res);
		expect(cartService.getCart).toBeNull;
		expect(res.status).toBeCalledWith(500);
		expect(res.json).toBeCalledWith({ message: '[CAR002] - Server error' });
	});

	it('dropFromCart : 400 fail - Invalid cart item id', async () => {
		req = createRequestWithoutParams();
		await cartController.dropFromCart(req, res);
		expect(cartService.deleteItemInCart).toBeNull;
		expect(res.status).toBeCalledWith(400);
		expect(res.json).toBeCalledWith({ message: 'Invalid cart item id' });
	});

	it('dropFromCart : 500 fail - [CAR003] - Server error', async () => {
		await cartController.dropFromCart(req, res);

		expect(cartService.deleteItemInCart).toBeNull;
		expect(res.status).toBeCalledWith(500);
		expect(res.json).toBeCalledWith({ message: '[CAR003] - Server error' });
	});
});
