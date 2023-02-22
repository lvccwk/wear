import { Server as SocketIO } from 'socket.io';
import { createRequest, createRequestWithoutParams, createResponse } from '../util/test-helper';
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
	let fakeMemo: Product;
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

		fakeMemo = { image: 'image-1.png', id: 1 };
		// cartService.postCart = jest.fn(async () => [fakeMemo]);
		// cartService.getCart = jest.fn(async (content: string, fileName: string) => {});
		// // cartService.updateMemoById = jest.fn(async (id: number, memoContent: string) => {});
		// cartService.deleteItemInCart = jest.fn(async (cartItemId: number) => {});

		// cartController.addToCart = jest.fn(async () => fakeUser) as any;
	});

	// it('addToCart : ok', async () => {
	// 	(formParsePromise as jest.Mock).mockReturnValue(fakeMemo);
	// 	await cartController.addToCart(req, res);
	// 	expect(cartService.postCart).toBeCalledTimes(1);
	// 	expect(res.status).toBeCalledWith(500);
	// 	expect(res.json).toBeCalledWith({ message: '[CAR001] - Server error' });
	// });

	it('addToCart : 500 fail - [CAR001] - Server error', async () => {
		await cartController.addToCart(req, res);
		expect(cartService.postCart).toBeNull;
		expect(res.status).toBeCalledWith(500);
		expect(res.json).toBeCalledWith({ message: '[CAR001] - Server error' });
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

	// afterEach(() => {
	// 	jest.clearAllMocks();
	// });
});
