import express from 'express';
import { purchaseHistoryController } from '../app';

export function purchaseHistoryRoutes() {
	const purchaseHistoryRoutes = express.Router();
	purchaseHistoryRoutes.get('/', purchaseHistoryController.addToPurchaseHistory);
	purchaseHistoryRoutes.post('/', purchaseHistoryController.goToPurchaseHistory);
	return purchaseHistoryRoutes;
}