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
		let result = await cartService.postCart('postTest.jpg', 2, 'nike');
		product = await knex.select('image').from('cart').where('image', 'postTest.jpg');
		// // console.log(`12312312313123`, product[0].image);

		expect(product).toMatchObject([
			{
				image: 'postTest.jpg'
			}
		]);
	});

	it('postCart: add to cart fail', async () => {
		let result;
		const a: any = '1wqe';
		// expect(() => cartService.postCart(a, a)).toThrow(/add to cart fail/!);
		try {
			result = await cartService.postCart(a, a, 'nike');
			// console.log('result', result);
		} catch (e) {
			expect(e).toEqual(new Error('add to cart fail'));
		}
	});

	it('getCart: check cart success ', async () => {
		let result = await cartService.getCart(2);

		expect(result).toMatchObject([
			{
				id: 2,
				image: 'postCart.jpg',
				brand: null
			}
		]);
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
		expect(result).toBeNull;
	});

	afterEach(async () => {
		await knex('cart').where('image', 'postTest.jpg').del();
	});

	// afterAll(async () => {
	// 	await knex.destroy()
	// })
});
