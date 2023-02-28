import express from 'express';
import { purchaseHistoryController } from '../app';
import { isLoggedInAPI } from '../util/guard'

export function purchaseHistoryRoutes() {
	const purchaseHistoryRoutes = express.Router();
	purchaseHistoryRoutes.get('/', isLoggedInAPI, purchaseHistoryController.goToPurchaseHistory);
	purchaseHistoryRoutes.post('/', isLoggedInAPI, purchaseHistoryController.addToPurchaseHistory);
	return purchaseHistoryRoutes;
}