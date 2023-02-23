import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
	await knex.schema.createTable('cart', (table) => {
		table.increments();
		table.string('image').notNullable();
		table.string('brand');
		table.integer('user_id').unsigned();
		table.foreign('user_id').references('users.id');

		table.timestamps(false, true);
	});
}

export async function down(knex: Knex): Promise<void> {
	await knex.schema.dropTableIfExists('cart');
}
