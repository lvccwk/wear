import { Knex } from 'knex';

// export function postCartA(fileName: string, userId: number) {
// 	throw new Error('add to cart fail 123');
// }
export class CartService {
	constructor(private knex: Knex) {}

	async postCart(fileName: string, userId: number) {
		// throw new Error('add to cart fail ');
		try {
			await this.knex('cart').insert({
				user_id: userId,
				image: fileName
			});
		} catch (error) {
			throw new Error('add to cart fail');
		}
	}

	async getCart(userId: number) {
		try {
			let result = await this.knex.select('image').from('cart').where('user_id', userId);
			// .returning('id');
			console.table(result);
			return result;
		} catch (error) {
			throw new Error('get to cart fail');
		}
	}

	async deleteItemInCart(cartItemId: number) {
		try {
			await this.knex('cart').where('id', cartItemId).del();
		} catch (error) {
			throw new Error('delete cart item fail');
		}
	}
}
