import { Knex } from 'knex';

export class PurchaseHistoryService {
	constructor(private knex: Knex) {}

    async postPurchaseHistory(fileName: string, userId: number, brandName: string) {
		try {
			return await this.knex
			.insert({
				name: fileName,
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
			.select("name", "brand")
			.from("purchaseHistory")
			.where("user_id", userId)
		} catch (error) {
			throw new Error('get history fail');
		}
	}
}
