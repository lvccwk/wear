import Knex from 'knex';
import { Product } from '../util/interface';
import { CartService } from './cartService';

const knexConfig = require('../knexfile');
const knex = Knex(knexConfig['test']); // Connection to the test database.

describe('CartService', () => {
	let cartService: CartService;
	let product: Product[];

	beforeEach(async () => {
		cartService = new CartService(knex);
	});

	it('postCart: insert cart success', async () => {
		await cartService.postCart('postCart.jpg', 1);
		product = await knex.select('*').from('cart').where('image', 'postCart.jpg');
		// expect(product.length).toBe(1);
		expect(product).toMatchObject([
			{
				user_id: 1,
				image: 'postCart.jpg'
			}
		]);
	});

	it('postCart: add to cart fail', async () => {
		let result;
		const a: any = '1wqe';
		// expect(() => cartService.postCart(a, a)).toThrow(/add to cart fail/!);
		try {
			result = await cartService.postCart(a, a);
			// console.log('result', result);
		} catch (e) {
			expect(e).toEqual(new Error('add to cart fail'));
		}
	});

	it('getCart: check cart success ', async () => {
		await cartService.postCart('getCart.jpg', 1);
		let result = await cartService.getCart(1);
		expect(result).toMatchObject([{ image: 'getCart.jpg' }]);
	});

	it('getCart: check cart fail ', async () => {
		let result;
		const a: any = '1wqe';
		// expect(() => cartService.postCart(a, a)).toThrow(/add to cart fail/!);
		try {
			result = await cartService.getCart(a);
			// console.log('result', result);
		} catch (e) {
			expect(e).toEqual(new Error('get to cart fail'));
		}
	});

	it('deleteItemInCart: delete cart success', async () => {
		let result = await cartService.deleteItemInCart(1);
		// expect(cartService.getCart).toBeCalledTimes(1);
		expect(result).toBeNull;
	});

	afterEach(async () => {
		// await knex('cart').whereIn('id', productIds).del();
		await knex('cart').where('image', 'postCart.jpg').orWhere('image', 'getCart.jpg').del();
	});

	// afterAll(async () => {
	// 	await knex.destroy()
	// })
});
