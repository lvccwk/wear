import { Knex } from 'knex';
import { hashPassword } from '../util/hash';

export async function seed(knex: Knex): Promise<void> {
	console.log('seed running');

	// let result = await knex.select('*').from('users');
	// console.log(result);

	// Deletes ALL existing entries
	await knex('purchase_history').del();
	await knex('cart').del();
	await knex('users').del();
	// Inserts seed entries
	await knex.raw(`TRUNCATE TABLE users RESTART IDENTITY CASCADE`);
	await knex.raw(`TRUNCATE TABLE cart RESTART IDENTITY CASCADE`);
	await knex('users').insert([
		{
			email: 'admin@com',
			password: await hashPassword('admin'),
			display_name: 'admin'
		},
		{
			email: 'admin2@com',
			password: await hashPassword('admin'),
			display_name: 'admin'
		},
		{
			email: '1admin@com',
			password: await hashPassword('admin'),
			display_name: 'admin'
		}
	]);

	await knex('cart').insert([
		{
			user_id: 1,
			image: 'getCart.jpg'
		},
		{
			user_id: 2,
			image: 'postCart.jpg'
		},
		{
			user_id: 2,
			image: 'postCart.jpg'
		},
		{
			user_id: 2,
			image: 'postCart.jpg'
		},
		{
			user_id: 2,
			image: 'postCart.jpg'
		},
		{
			user_id: 2,
			image: 'postCart.jpg'
		},
		{
			user_id: 1,
			image: 'postCart.jpg'
		}
	]);

	await knex('purchase_history').insert([
		{
			user_id: 1,
			image: 'getCart.jpg',
			brand: 'NIKE'
		},
		{
			user_id: 2,
			image: 'postCart.jpg',
			brand: 'NIKE'
		},
		{
			user_id: 2,
			image: 'postCart.jpg',
			brand: 'NIKE'
		},
		{
			user_id: 2,
			image: 'postCart.jpg',
			brand: 'NIKE'
		},
		{
			user_id: 2,
			image: 'postCart.jpg',
			brand: 'ADIDAS'
		},
		{
			user_id: 2,
			image: 'postCart.jpg',
			brand: 'ADIDAS'
		}
	]);
}
