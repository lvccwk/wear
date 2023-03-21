import express from 'express';
import { userController } from '../app';
import { isLoggedInAPI } from '../util/guard';

export function makeUserRoutes() {
	const userRoutes = express.Router();
	userRoutes.get('/login/google', userController.loginGoogle);
	userRoutes.get('/logout', userController.logout);
	userRoutes.post('/login', userController.login);
	userRoutes.post('/register', userController.register);
	userRoutes.get('/me', userController.getSessionProfile);
	userRoutes.get('/profile', isLoggedInAPI, userController.getUserProfile);
	userRoutes.put('/update', isLoggedInAPI, userController.putUserProfile);
	return userRoutes;
}
