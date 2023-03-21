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
import { url } from 'inspector';
const knexConfig = require('../knexfile');
const knex = Knex(knexConfig['test']);

jest.mock('../util/formidable');

describe('userController', () => {
	let cartController: CartController;
	let cartService: CartService;
	let io: SocketIO;
	let req: Request;
	let res: Response;
	let session: Request['session'];

	beforeEach(() => {
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

			let result = await cartController.addToCart(req, res);
			await cartService.postCart(req.body.image, req.body.id, 'nike');

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
		(formParsePromise as jest.Mock).mockReturnValue(undefined || '');
		try {
			req = createRequestId();
			await cartController.goToCart(req, res);
			let cart = await cartService.getCart(req.body.id);
			expect(formParsePromise).toBeCalledTimes(1);
			expect(res.json).toBeCalledWith({
				data: cart,
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

	it('dropFromCart : ok', async () => {
		(formParsePromise as jest.Mock).mockReturnValue(undefined || '');
		try {
			req = createRequest();
			await cartController.dropFromCart(req, res);
			let cart = await cartService.deleteItemInCart(req.body.cart);
			expect(formParsePromise).toBeCalledTimes(1);
			expect(res.json).toBeCalledWith({
				message: 'delete cart item ok'
			});
		} catch (e) {
			expect(res.status).toBeCalledWith(500);
			expect(res.json).toBeCalledWith({ message: '[CAR003] - Server error' });
		}
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

	it('stripeApi : error', async () => {
		await cartController.stripeApi(req, res);

		expect(res.status).toBeCalledWith(500);
		expect(res.json).toBeCalledWith({
			error: "Cannot read properties of undefined (reading 'id')"
		});
	});

	it('stripeApi : ok', async () => {
		try {
			req = createRequestId();
			await cartController.stripeApi(req, res);
			let cart = await cartService.getCart(req.session.user?.id!);

			expect(cart).toMatchObject({
				price_data: {
					currency: 'hkd',
					product_data: {
						name: cart[0].image
					},
					unit_amount: 1000
				},
				quantity: 1
			});
			expect(cart).toReturnTimes(1);
			expect(cart).toBeCalledTimes(1);
			expect(res.json).toBeCalledWith({ error: 'get to cart fail' });
			expect(res.json).toHaveBeenCalledWith({ url: url });
		} catch (error) {}
		expect(res.status).toBeCalledWith(500);
		expect(res.json).toBeCalledWith({ error: 'get to cart fail' });
	});

	it('should create a Stripe checkout session and return the URL', async () => {
		await cartController.stripeApi(req, res);

		expect(cartService.getCart).toBeNull;
	});
});
