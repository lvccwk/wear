import express from 'express';
import HTTP from 'http';
import { expressSessionConfig, grantExpress } from './util/plugin-config';
import { UserService } from './services/userService';
import { UserController } from './controllers/userController';
import { makeUserRoutes } from './routes/userRoutes';
import { CartService } from './services/cartService';
import { CartController } from './controllers/cartController';
import { cartRoutes } from './routes/cartRoutes';
import { PurchaseHistoryService } from './services/purchaseHistoryService';
import { PurchaseHistoryController } from './controllers/purchaseHistoryController';
import { purchaseHistoryRoutes } from './routes/purchaseHistoryRoutes';
import { CollectionService } from './services/collectionService';
import { CollectionController } from './controllers/collectionController';
import { collectionRoutes } from './routes/collectionRoutes';
import { Server as SocketIO } from 'socket.io';
import { knex } from './util/db';
import path from 'path';

import fetch from 'cross-fetch';
import dns from 'node:dns';
dns.setDefaultResultOrder('ipv4first');

export const app = express();
const server = new HTTP.Server(app);
export const io = new SocketIO(server);

app.use(express.json());
app.use(expressSessionConfig);
app.use(grantExpress as express.RequestHandler);

export let userService = new UserService(knex);
export let userController = new UserController(userService, io);
export let cartService = new CartService(knex);
export let cartController = new CartController(cartService, io);
export let purchaseHistoryService = new PurchaseHistoryService(knex);
export let purchaseHistoryController = new PurchaseHistoryController(purchaseHistoryService, io);
export let collectionService = new CollectionService(knex);
export let collectionController = new CollectionController(collectionService, io);

//fetch image
app.post('/prompt', async (req, res) => {
	const data = req.body;
	try {
		let response = await fetch('http://localhost:8000/get-suggestions', {
			method: 'post',
			body: JSON.stringify(data),
			headers: {
				'Content-Type': 'application/json'
			}
		});
		let suggestions = await response.json();

		res.json({ suggestions, generating: 1 });
	} catch (error) {
		res.json({ suggestions: { suggestions: 'Error' }, generating: 0 });
	}
});

app.post('/on-image-generated', async (req, res) => {
	io.emit('message', req.body);
	res.json({ status: 'ok' });
});

app.get('/is_logged_in', async (req, res) => {
	if (req.session.user) {
		res.status(200).json({ loggedIn: true });
	} else {
		res.status(403).json({ loggedIn: false });
	}
});

app.get('/logout', async (req, res) => {
	userController.logout(req, res);
});

app.use(makeUserRoutes());
app.use('/cart', cartRoutes());
app.use('/purchaseHistory', purchaseHistoryRoutes());
app.use('/collection', collectionRoutes());
app.use(express.static(path.join(__dirname, 'template_design')));
app.use(express.static(path.join(__dirname, 'image')));
app.use('/node_modules', express.static(path.join(__dirname, 'node_modules')));

app.use(express.static('public'));

app.use(express.static('util'));
app.use('/model_pics', express.static('model_pics'));
app.use((req, res) => {
	res.redirect('404.html');
});

io.use((socket, next) => {
	let req = socket.request as express.Request;
	let res = req.res as express.Response;
	expressSessionConfig(req, res, next as express.NextFunction);
});

io.on('connection', (socket) => {
	const req = socket.request as express.Request;
	req.session['key'] = 'XXX';
	req.session.save();

	socket.on('search_product', async (data) => {
		socket.join(data);
		io.to(data).emit('photo', data);
	});

	//fetch image
	socket.on('chat message', (msg: string) => {
		io.emit('chat message', msg);
	});

	socket.on('disconnect', () => {
		console.log('user disconnected');
	});
});

const PORT = 8080;
server.listen(PORT, () => {
	console.log(`Listening at http://localhost:${PORT}/`);
});
