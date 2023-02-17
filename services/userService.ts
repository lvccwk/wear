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
			console.log(user);
			return user;
		} catch (error) {
			console.log(error);
			throw new Error(error + '');
		}
	}

	async createUser(
		display_name: string,
		email: string,
		password: string | undefined = crypto.randomUUID()
	): Promise<User> {
		let users = await this.knex('users')
			.insert({
				display_name,
				email,
				password: password
			})
			.returning('*');

		console.log(users[0]);
		return users[0];
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
