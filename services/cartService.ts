import { Photo } from '../util/interface';
import { Knex } from 'knex';

export class CartService {
	constructor(private knex: Knex) {}

	async postCart(fileName: string, userId: number) {
		try {
			return await this.knex
			.insert({
				name: fileName,
				user_id: userId,
			})
			.into("cart")
		} catch (error) {
			throw new Error('add to cart fail');
		}
	}

	async getCart(userId: number) {
		try {
			return await this.knex
			.select("name")
			.from("cart")
			.where("user_id", userId)
		} catch (error) {
			throw new Error('get to cart fail');
		}
	}

	async deleteItemInCart(cartItemId: number) {
		try {
			return await this.knex("cart").where("id", cartItemId).del();
		} catch (error) {
			throw new Error('delete cart item fail');
		}
	}
}
