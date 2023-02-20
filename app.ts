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
import { Server as SocketIO } from 'socket.io';
import { knex } from './util/db';
import path from 'path';

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

app.use(makeUserRoutes());
app.use(cartRoutes());
app.use(purchaseHistoryRoutes());
app.use(express.static(path.join(__dirname, 'template_design')));
app.use(express.static(path.join(__dirname, 'image')));
app.use(express.static('public'));
app.use(express.static('util'));
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
	console.log(`${socket.id} is connected to server`);
	// send a message to the client
	socket.emit('hello from server', 1, '2', { 3: Buffer.from([4]) });
	// receive a message from the client
	socket.on('hello from client', (...args) => {
		// ...
		console.log('server', args);
	});
});

const PORT = 8080;
server.listen(PORT, () => {
	console.log(`Listening at http://localhost:${PORT}/`);
});
