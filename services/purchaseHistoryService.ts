import { Knex } from 'knex';

export class PurchaseHistoryService {
	constructor(private knex: Knex) {}

    async postPurchaseHistory(userId: number) {
		try {
			let cartInfo = await this.knex
			.select("image", "brand")
			.from("cart")
			.where("user_id", userId)

			for(let x = 0; x < cartInfo.length; x++){
				await this.knex('purchase_history').insert({
					image: cartInfo[x].image,
					user_id: userId,
					brand: cartInfo[x].brand,
				})
				.into("purchase_history")
			}

			await this.knex('cart').where('user_id', userId).del();

			return
		} catch (error) {
			throw new Error('add to history fail');
		}
	}

	async getPurchaseHistory(userId: number) {
		try {
			let result = await this.knex
			.select("image", "brand", "updated_at")
			.from("purchase_history")
			.orderBy("created_at", "desc")
			.where("user_id", userId)
			return result
		} catch (error) {
			throw new Error('get history fail');
		}
	}
}
