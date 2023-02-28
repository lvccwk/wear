import { Knex } from 'knex';

export async function seed(knex: Knex): Promise<void> {
	console.log('seed running');

	// let result = await knex.select('*').from('users');
	// console.log(result);

	// Deletes ALL existing entries
	await knex('users').del();
	await knex('cart').del();
	// Inserts seed entries
	await knex.raw(`TRUNCATE TABLE users RESTART IDENTITY CASCADE`);
	await knex.raw(`TRUNCATE TABLE cart RESTART IDENTITY CASCADE`);
	await knex('users').insert([
		{
			email: 'admin@com',
			password: 'admin',
			display_name: 'admin'
		},
		{
			email: 'admin2@com',
			password: 'admin',
			display_name: 'admin'
		},
		{
			email: '1admin@com',
			password: 'admin',
			display_name: 'admin'
		}
	]);

	await knex('cart').insert([
		{
			user_id: 1,
			image: 'getCart.jpg'
		},
		{
			user_id: 3,
			image: 'postCart.jpg'
		},
		{
			user_id: 3,
			image: 'postCart.jpg'
		},
		{
			user_id: 3,
			image: 'postCart.jpg'
		},
		{
			user_id: 3,
			image: 'postCart.jpg'
		},
		{
			user_id: 3,
			image: 'postCart.jpg'
		},
		{
			user_id: 3,
			image: 'postCart.jpg'
		},
		{
			user_id: 3,
			image: 'postCart.jpg'
		}
	]);
}
