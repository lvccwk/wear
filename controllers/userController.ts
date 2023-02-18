import { UserService } from '../services/userService';
import express from 'express';
import { logger } from '../util/logger';
import { checkPassword, hashPassword } from '../util/hash';
import { User } from '../util/interface';
import type { Server as SocketServer } from 'socket.io';
import crypto from 'crypto';

declare module 'express-session' {
	interface SessionData {
		counter?: number;
		user?: User;
	}
}

export class UserController {
	constructor(private userService: UserService, private io: SocketServer) {}

	loginGoogle = async (req: express.Request, res: express.Response) => {
		try {
			const accessToken = req.session?.['grant'].response.access_token;

			const googleUserProfile = await this.userService.getGoogleUserprofile(accessToken);

			let user = await this.userService.getUserByEmail(googleUserProfile.email);

			if (!user) {
				// let hashedPassword = await hashPassword(crypto.randomUUID());

				// let emailPrefix = googleUserProfile.email.split("@")[0];

				user = await this.userService.createGoogleUser(googleUserProfile.email);
			}
			console.log(`accessToken`, accessToken);
			console.log(`googleUserProfile.email`, googleUserProfile.email);
			req.session['user'] = user;

			res.redirect('/chatroom.html');
		} catch (error) {
			// console.log(error);
			logger.error(error);
			res.status(500).json({
				message: '[USR0033] - Server error'
			});
		}
	};

	logout = async (req: express.Request, res: express.Response) => {
		try {
			delete req.session.user;
			res.redirect('/');
		} catch (error) {
			logger.error(error);
			res.status(500).json({
				message: '[USR002] - Server error'
			});
			// throw new Error('[USR002] - Server error');
		}
	};

	login = async (req: express.Request, res: express.Response) => {
		try {
			logger.info('body = ', req.body);
			let { email, password } = req.body;
			if (!email || !password) {
				res.status(402).json({
					message: 'Invalid input'
				});
				return;
			}

			let foundUser = await this.userService.getUserByEmail(email);
			if (!foundUser) {
				res.status(401).json({
					message: 'Invalid email123'
				});
				return;
			}

			console.log(`foundUser`, foundUser);
			let isPasswordValid = await checkPassword(password, foundUser.password!);

			if (!isPasswordValid) {
				res.status(402).json({
					message: 'Invalid password456'
				});
				return;
			}

			delete foundUser.password;

			req.session.user = {
				email: foundUser.email,
				id: foundUser.id,
				display_name: foundUser.display_name
			};

			console.log(`check req.session.user`, req.session.user);

			res.redirect('/chatroom.html');
		} catch (error) {
			logger.error(error);
			res.status(500).json({
				message: '[USR001] - Server error'
			});
		}
	};

	register = async (req: express.Request, res: express.Response) => {
		try {
			let { name, email, password, confirmPassword } = req.body;

			if (!name || !password || !email) {
				res.status(402).json({
					message: 'Invalid input'
				});
				return;
			}

			if (confirmPassword != password) {
				res.status(402).json({
					message: 'password and confirm password are not same'
				});
				return;
			}

			let user = await this.userService.getUserByEmail(email);

			if (user) {
				res.status(402).json({
					message: 'Your email has been registered'
				});
				return;
			} else {
				let hashedPassword = await hashPassword(password);
				user = await this.userService.createUser(name, email, hashedPassword);
			}

			delete user.password;
			req.session.user = {
				email: user.email,
				id: user.id,
				display_name: user.display_name
			};

			res.json('ok');
		} catch (error) {
			logger.error(error);
			res.status(500).json({
				message: '[USR002] - Server error'
			});
		}
	};

	getSessionProfile = (req: express.Request, res: express.Response) => {
		res.json(req.session.user || {});
		this.io.emit('load-memo');
	};
}
