import Knex from 'knex';
import { id } from '../jest.config';
import { Product } from '../util/interface';
import { CartService } from './cartService';

const knexConfig = require('../knexfile');
const knex = Knex(knexConfig['test']); // Connection to the test database.

describe('MemoService', () => {
	let cartService: CartService;

	let productIds: number[];
	let fakeProducts: Product[];
	let newMemos: Product[];
	beforeEach(async () => {
		cartService = new CartService(knex);
		// fakeProducts = [
		// 	{
		// 		name: 'Product 1',
		// 		image: 'abc.jpg'
		// 	},
		// 	{
		// 		name: 'Product 2',
		// 		image: 'def.jpg'
		// 	}
		// ];
		// productIds = (await knex.insert(fakeProducts).into('cart').returning('id')).map(
		// 	(m) => m.id
		// );

		// console.log('dummy input');
		// console.log({ productIds });
	});

	it.only('postCart: ok', async () => {
		await cartService.postCart('postCart.jpg', 1);
		newMemos = await knex.select('*').from('cart').where('name', 'postCart.jpg');
		// expect(cartService.postCart).toBeCalledTimes(1);
		// expect(newMemos.length).toBe(1);
		expect(newMemos).toMatchObject([
			{
				name: 'ghi.jpg',
				user_id: 1
			}
		]);
	});

	it('getCart: ok', async () => {
		await cartService.getCart(1);
		expect(cartService.getCart).toBeCalledTimes(1);
	});

	it('deleteItemInCart: ok', async () => {
		await cartService.deleteItemInCart(1);
		expect(cartService.getCart).toBeCalledTimes(1);
	});

	// afterEach(async () => {
	// 	await knex('users').whereIn('id', productIds).del();
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

	// afterAll(async () => {
	// 	await knex.destroy()
	// })
});
