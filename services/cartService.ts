import { Knex } from 'knex';

// export function postCartA(fileName: string, userId: number) {
// 	throw new Error('add to cart fail 123');
// }
export class CartService {
	constructor(private knex: Knex) {}

	async postCart(fileName: string, userId: number, brandName: string) {
		try {
			await this.knex('cart').insert({
				image: fileName,
				user_id: userId,
				brand: brandName,
			})
			.into("cart")
			return
		} catch (error) {
			throw new Error('add to cart fail');
		}
	}

	async getCart(userId: number) {
		try {
			let result = await this.knex
			.select("id", "image", "brand")
			.from("cart")
			.orderBy("created_at", "desc")
			.where("user_id", userId)
			return result
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
