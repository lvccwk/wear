import { Knex } from 'knex';

export class CollectionService {
	constructor(private knex: Knex) {}

    async postCollection(imagePath: string) {
		try {
            let collectionId = await this.knex('collections').insert({
                image: imagePath,
            })
            .into("collections")
            .returning("id");

			return collectionId
		} catch (error) {
			throw new Error('add to collection fail');
		}
	}

    // async dropCollection(cartItemId: number) {
	// 	try {
	// 		await this.knex('cart').where('id', cartItemId).del();
	// 	} catch (error) {
	// 		// console.log(error);
	// 		throw new Error('delete collection fail');
	// 	}
	// }
}
