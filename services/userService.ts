import { hashPassword } from '../util/hash';
import { User } from '../util/interface';
import fetch from 'cross-fetch';
import crypto from 'crypto';
import { Knex } from 'knex';

export class UserService {
	constructor(private knex: Knex) {}

	async getUserByEmail(email: string): Promise<User> {
		try {
			let user = await this.knex.select('*').from('users').where({ email }).first();

			return user;
		} catch (error) {
			throw new Error(error + 'get email fail');
		}
	}

	async createUser(
		display_name: string,
		email: string,
		password: string | undefined = crypto.randomUUID()
	): Promise<User> {
		// try {
		let hashedPassword = await hashPassword(password);
		let users = await this.knex('users')
			.insert({
				display_name,
				email,
				password: hashedPassword
			})
			.returning('*');

		return users[0];
		// } catch (error) {
		// 	// console.log(error);
		// 	throw new Error('create user fail');
		// }
	}

	async getGoogleUserprofile(accessToken: string) {
		const fetchRes = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
			method: 'get',
			headers: {
				Authorization: `Bearer ${accessToken}`
			}
		});

		const googleUserProfile = await fetchRes.json();
		return googleUserProfile;
	}

	async createGoogleUser(
		email: string,
		password: string | undefined = crypto.randomUUID()
	): Promise<User> {
		let hashedPassword = await hashPassword(password);
		let emailPrefix = email.split('@')[0];

		let users = await this.knex('users')
			.insert({
				display_name: emailPrefix,
				email,
				password: hashedPassword
			})
			.returning('*');
		return users[0];
	}
}
