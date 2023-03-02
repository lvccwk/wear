import { CartService } from '../services/cartService';
import express from 'express';
import { formParsePromise } from '../util/formidable';
// import { logger } from '../util/logger';
import type { Server as SocketServer } from 'socket.io';
import dotenv from 'dotenv';
dotenv.config();

//Items to be bought/sold

const stripe = require('stripe')(process.env.STRIPE_PRIVATE_KEY);
export class CartController {
	constructor(private cartService: CartService, private io: SocketServer) {}

	addToCart = async (req: express.Request, res: express.Response) => {
		try {
			let img = req.body.image
			let userId = Number(req.session['user']!.id);
			let brandName = '';

			await this.cartService.postCart(img, userId, brandName);

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

	stripeApi = async (req: express.Request, res: express.Response) => {
		try {
			//Items to be bought/sold
			// const storeItems = new Map([
			// 	[1, { priceInCents: 1000, name: 'APPLE' }],
			// 	[2, { priceInCents: 2000, name: 'ORANGE' }]
			// ]);

			let userId = Number(req.session['user']!.id);
			let cart = await this.cartService.getCart(userId);
			console.log('cart', cart);

			const session = await stripe.checkout.sessions.create({
				payment_method_types: ['card'], //VISA/MASTERCARD
				mode: 'payment', //one time payment (not subscription)

				//items to be purchased
				line_items: cart.map((item: any) => {
					//get items by id
					// const storeItem = storeItems.get(item.id);

					return {
						price_data: {
							currency: 'hkd',
							product_data: {
								name: cart[0].image
							},
							unit_amount: 1000
						},
						quantity: 1
					};
				}),
				//redirect after payment
				success_url: `${process.env.SERVER_URL}/success.html`,
				cancel_url: `${process.env.SERVER_URL}/fail.html`
			});
			//console.log(session.url);
			//send stripe checkout url back to frontend
			res.json({ url: session.url });
		} catch (error: any) {
			console.log(error);
			res.status(500).json({ error: error.message });
		}
	};
}
