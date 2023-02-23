import { Knex } from 'knex';

export async function seed(knex: Knex): Promise<void> {
	console.log('seed running');

	// let result = await knex.select('*').from('users');
	// console.log(result);

	// Deletes ALL existing entries
	await knex('users').del();
	await knex('cart').del();
	// Inserts seed entries
	await knex('users').insert([
		{
			email: 'admin@com',
			password: 'admin',
			display_name: 'admin'
		}
	]);

	await knex('cart').insert([
		{
			user_id: 1,
			image: 'getCart.jpg'
		}
	]);
}
