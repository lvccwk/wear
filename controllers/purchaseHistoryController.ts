import { PurchaseHistoryService } from '../services/purchaseHistoryService';
import express from 'express';
import { formParsePromise } from '../util/formidable'
import { logger } from '../util/logger';
import { checkPassword, hashPassword } from '../util/hash';
// import { User } from '../util/interface';
import type { Server as SocketServer } from 'socket.io';

// declare module 'express-session' {
// 	interface SessionData {
// 		counter?: number;
// 		user?: User;
// 	}
// }

export class PurchaseHistoryController {
	constructor(private purchaseHistoryService: PurchaseHistoryService, private io: SocketServer) {}

    addToPurchaseHistory = async (req: express.Request, res: express.Response) => {
		try {
            let { files } = await formParsePromise(req)
			let fileName = files.image ? files.image['newFilename'] : ''
            let userId = Number(req.session['user']!.id)

			await this.purchaseHistoryService.postPurchaseHistory(fileName, userId)

			res.json({
				message: 'add to history success'
			})
		} catch (error) {
			res.status(500).json({
                message: '[PH001] - Server error'
			});
		}
	};

    goToPurchaseHistory = async (req: express.Request, res: express.Response) => {
		try {
            let userId = Number(req.session['user']!.id)
			let purchaseHistory = await this.purchaseHistoryService.getPurchaseHistory(userId)

            res.json({
				data: purchaseHistory,
				message: 'Get history success'
			})
		} catch (error) {
			res.status(500).json({
                message: '[PH002] - Server error'
			});
		}
	};

}
