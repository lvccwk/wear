import express from 'express';
import { cartController } from '../app';

export function cartRoutes() {
	const cartRoutes = express.Router();
	cartRoutes.post('/cart', cartController.addToCart);
	cartRoutes.get('/cart', cartController.goToCart);
	cartRoutes.delete('/cart', cartController.dropFromCart);
	return cartRoutes;
}