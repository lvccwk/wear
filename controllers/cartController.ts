import { CartService } from '../services/cartService';
import express from 'express';
import { formParsePromise } from '../util/formidable';
// import { logger } from '../util/logger';
import type { Server as SocketServer } from 'socket.io';

export class CartController {
	constructor(private cartService: CartService, private io: SocketServer) {}

	addToCart = async (req: express.Request, res: express.Response) => {
		try {
			let { files } = await formParsePromise(req);
			let fileName = files.image ? files.image['newFilename'] : '';
			let userId = Number(req.session['user']!.id);
			let brandName = ""
			await this.cartService.postCart(fileName, userId, brandName);

			res.json({
				message: 'add to cart success'
			});
		} catch (error) {
			res.status(500).json({
				message: '[CAR001] - Server error'
			});
		}
	};

	goToCart = async (req: express.Request, res: express.Response) => {
		try {
			let userId = Number(req.session['user']!.id);
			let cart = await this.cartService.getCart(userId);

			res.json({
				data: cart,
				message: 'Get cart success'
			});
		} catch (error) {
			res.status(500).json({
				message: '[CAR002] - Server error'
			});
		}
	};

	dropFromCart = async (req: express.Request, res: express.Response) => {
		try {
			let cartItemId = Number(req.params.id);

			if (!cartItemId) {
				res.status(400).json({
					message: 'Invalid cart item id'
				});
				return;
			}

			await this.cartService.deleteItemInCart(cartItemId);
			res.json({ message: 'delete cart item ok' });
		} catch (error) {
			res.status(500).json({
				message: '[CAR003] - Server error'
			});
		}
	};
}
