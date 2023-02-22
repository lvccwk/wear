import express from 'express';
import { cartController } from '../app';

export function cartRoutes() {
	const cartRoutes = express.Router();
	cartRoutes.post('/', cartController.addToCart);
	cartRoutes.get('/', cartController.goToCart);
	cartRoutes.delete('/', cartController.dropFromCart);
	return cartRoutes;
}