import { UserService } from '../services/userService';
import express from 'express';
import { logger } from '../util/logger';
import { checkPassword, hashPassword } from '../util/hash';
import { User } from '../util/interface';
import type { Server as SocketServer } from 'socket.io';
import { formParsePromise } from '../util/formidable';

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
			// console.log(accessToken);
			// req.session['user'] = user;

			res.redirect('/index.html');
		} catch (error) {
			// console.log(error);
			// logger.error(error);
			res.status(500);
			res.json({
				message: '[USR0033] - Server error'
			});
		}
	};

	logout = async (req: express.Request, res: express.Response) => {
		try {
			delete req.session.user;
			res.redirect('/');
		} catch (error) {
			// logger.error(error);
			res.status(500).json({
				message: '[USR002] - Server error'
			});
		}
	};

	login = async (req: express.Request, res: express.Response) => {
		try {
			logger.info('body = ', req.body);
			let { email, password } = req.body;
			if (!email || !password) {
				res.status(401).json({
					message: 'Invalid input'
				});
				return;
			}

			let foundUser = await this.userService.getUserByEmail(email);
			if (!foundUser) {
				res.status(402).json({
					message: 'Invalid email'
				});
				return;
			}

			let isPasswordValid = await checkPassword(password, foundUser.password!);

			if (!isPasswordValid) {
				res.status(403).json({
					message: 'Invalid password'
				});
				return;
			}

			delete foundUser.password;

			req.session.user = {
				email: foundUser.email,
				id: foundUser.id,
				display_name: foundUser.display_name
			};
			res.redirect('/searchresult.html');
		} catch (error) {
			// logger.error(error);
			res.status(500).json({
				message: '[USR001] - Server error'
			});
		}
	};

	register = async (req: express.Request, res: express.Response) => {
		try {
			let { name, email, password, confirmPassword } = req.body;

			if (!name || !password || !email) {
				res.status(401).json({
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
				res.status(403).json({
					message: 'Your email has been registered'
				});
				return;
			}

			user = await this.userService.createUser(name, email, password);

			delete user.password;

			req.session.user = {
				email: user.email,
				id: user.id,
				display_name: user.display_name
			};

			res.json({
				message: 'ok'
			});
		} catch (error) {
			// console.log(error);
			// logger.error(error);
			res.status(500).json({
				message: '[USR002] - Server error'
			});
		}
	};

	getSessionProfile = (req: express.Request, res: express.Response) => {
		res.json(req.session.user || {});
		// this.io.emit('load-memo');
	};

	getUserProfile = async (req: express.Request, res: express.Response) => {
		try {
			let userId = Number(req.session['user']!.id);
			let userInfo = await this.userService.getMyInfo(userId);

			res.json({
				data: userInfo,
				message: 'Get userInfo success'
			});
		} catch (error) {
			res.status(500).json({
				message: '[USR003] - Server error'
			});
		}
	};

	putUserProfile = async (req: express.Request, res: express.Response) => {
		try {
			let userId = Number(req.session['user']!.id);
			let name = req.body.newName;
			let email = req.body.newEmail;
			let password = req.body.newPassword

			await this.userService.changeMyInfo(userId, name, email, password);

			res.json({
				message: 'update info success'
			});
		} catch (error) {
			res.status(500).json({
				message: '[USR004] - Server error'
			});
		}
	};
}
