import { Knex } from 'knex';

export class CartService {
	constructor(private knex: Knex) {}

	async postCart(img: number, userId: number, brandName: string) {
		try {
			let collectionInfo = await this.knex
				.select('image')
				.from('collections')
				.where('id', img);

			await this.knex('cart')
				.insert({
					image: collectionInfo[0].image,
					user_id: userId,
					brand: brandName
				})
				.into('cart');

			await this.knex('collections').where('id', img).del();

			return;
		} catch (error) {
			throw new Error('add to cart fail');
		}
	}

	async getCart(userId: number) {
		try {
			let result = await this.knex
				.select('id', 'image', 'brand', 'updated_at')
				.from('cart')
				.orderBy('created_at', 'desc')
				.where('user_id', userId);
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
