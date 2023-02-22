import { Knex } from 'knex';

export class CartService {
	constructor(private knex: Knex) {}

	async postCart(fileName: string, userId: number) {
		try {
			await this.knex
			.insert({
				name: fileName,
				user_id: userId,
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
			.select("name")
			.from("cart")
			.where("user_id", userId)
			return result
		} catch (error) {
			throw new Error('get to cart fail');
		}
	}

	async deleteItemInCart(cartItemId: number) {
		try {
			await this.knex("cart").where("id", cartItemId).del();
			return
		} catch (error) {
			throw new Error('delete cart item fail');
		}
	}
}
