import { Knex } from 'knex';

export class PurchaseHistoryService {
	constructor(private knex: Knex) {}

    async postPurchaseHistory(fileName: string, userId: number, brandName: string) {
		try {
			let result = await this.knex
			.insert({
				image: fileName,
				user_id: userId,
				brand: brandName,
			})
			.into("purchase_history")
			return result
		} catch (error) {
			throw new Error('add to history fail');
		}
	}

	async getPurchaseHistory(userId: number) {
		try {
			let result = await this.knex
			.select("id", "image", "brand", "user_id")
			.from("purchase_history")
			.where("user_id", userId)
			return result
		} catch (error) {
			throw new Error('get history fail');
		}
	}
}
