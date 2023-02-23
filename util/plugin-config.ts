import grant from 'grant';
import { env } from '../util/env';
import expressSession from 'express-session';

export const grantExpress = grant.express({
	defaults: {
		origin: 'https://lawrence-tang.com',
		transport: 'session',
		state: true
	},
	google: {
		key: env.GOOGLE_CLIENT_ID,
		secret: env.GOOGLE_SECRET,
		scope: ['profile', 'email'],
		callback: '/login/google'
	}
});
export const expressSessionConfig = expressSession({
	secret: 'WEAR',
	resave: true,
	saveUninitialized: true
});
