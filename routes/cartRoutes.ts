import express from 'express';
import { cartController } from '../app';
import { isLoggedInAPI } from '../util/guard';

export function cartRoutes() {
	const cartRoutes = express.Router();
	cartRoutes.post('/', isLoggedInAPI, cartController.addToCart);
	cartRoutes.get('/', isLoggedInAPI, cartController.goToCart);
	cartRoutes.delete('/:id', isLoggedInAPI, cartController.dropFromCart);
	cartRoutes.post('/checkout-session', isLoggedInAPI, cartController.stripeApi);
	return cartRoutes;
}
