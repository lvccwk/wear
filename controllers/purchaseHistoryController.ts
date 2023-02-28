import { PurchaseHistoryService } from '../services/purchaseHistoryService';
import express from 'express';
import { formParsePromise } from '../util/formidable'
import type { Server as SocketServer } from 'socket.io';

export class PurchaseHistoryController {
	constructor(private purchaseHistoryService: PurchaseHistoryService, private io: SocketServer) {}

    addToPurchaseHistory = async (req: express.Request, res: express.Response) => {
		try {
            let { files } = await formParsePromise(req)
			let fileName = files.image ? files.image['newFilename'] : ''
            let userId = Number(req.session['user']!.id)
			let brandName = ""
			await this.purchaseHistoryService.postPurchaseHistory(fileName, userId, brandName)

			res.json({
				message: 'add to purchase history success'
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
			console.log("ERROR - 3")
            res.json({
				data: purchaseHistory,
				message: 'get purchase history success'
			})
		} catch (error) {
			res.status(500).json({
                message: '[PH002] - Server error'
			});
		}
	};

}
