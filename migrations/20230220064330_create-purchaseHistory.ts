import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
	await knex.schema.createTable('purchaseHistory', (table) => {
		table.increments();
		table.string('name').notNullable();
        table.integer("user_id").unsigned();
        table.foreign("user_id").references("users_id");

		table.timestamps(false, true);
	});
}

export async function down(knex: Knex): Promise<void> {
	await knex.schema.dropTableIfExists('purchaseHistory');
}