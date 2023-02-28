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

import fetch from 'cross-fetch'
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

//fetch image
app.post('/prompt',async (req, res) => {
	const data  = req.body;
	// data.versions_count=5;
	// data.length=200;
	console.log("appts_line49",data)
	try {
	  let response = await fetch('http://localhost:8000/get-suggestions', {
		method: 'post',
		body: JSON.stringify(data),
		headers: {
		  'Content-Type': 'application/json'
		}
	  })
	  let suggestions = await response.json();
	  console.log("appts_line59" , suggestions);
	  
	  res.json({suggestions,generating:1});
	} catch (error) {
	  console.log("ERR0R",error);
	  res.json({suggestions:{suggestions:"Error"},generating:0});
	}
  });
  
  app.post("/on-image-generated",async (req,res)=>{
	io.emit('message', req.body);
	res.json({status:"ok"})
  });


app.use(makeUserRoutes());
app.use('/cart', cartRoutes());
app.use('/purchaseHistory', purchaseHistoryRoutes());
app.use(express.static(path.join(__dirname, 'template_design')));
app.use(express.static(path.join(__dirname, 'image')));
app.use(express.static('public'));
app.use(express.static('util'));
app.use("/model_pics",express.static('model_pics'));
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

	socket.on('search_product', async (data) => {
		socket.join(data);
		io.to(data).emit('photo', data);
	});

	//fetch image
	socket.on('chat message', (msg: string) => {
		console.log('message: ' + msg);
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
