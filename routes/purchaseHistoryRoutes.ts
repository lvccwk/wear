import express from 'express';
import { purchaseHistoryController } from '../app';
import { isLoggedInAPI } from '../util/guard'

export function purchaseHistoryRoutes() {
	const purchaseHistoryRoutes = express.Router();
	purchaseHistoryRoutes.get('/', isLoggedInAPI, purchaseHistoryController.addToPurchaseHistory);
	purchaseHistoryRoutes.post('/', purchaseHistoryController.goToPurchaseHistory);
	return purchaseHistoryRoutes;
}