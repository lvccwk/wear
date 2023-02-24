import { Knex } from 'knex';

export class PurchaseHistoryService {
	constructor(private knex: Knex) {}

    async postPurchaseHistory(fileName: string, userId: number, brandName: string) {
		try {
			return await this.knex
			.insert({
				image: fileName,
				user_id: userId,
				brand: brandName,
			})
			.into("purchaseHistory")
		} catch (error) {
			throw new Error('add to history fail');
		}
	}

	async getPurchaseHistory(userId: number) {
		try {
			return await this.knex
			.select("id", "image", "brand")
			.from("purchaseHistory")
			.where("user_id", userId)
		} catch (error) {
			throw new Error('get history fail');
		}
	}
}
