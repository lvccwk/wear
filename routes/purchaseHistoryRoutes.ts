import express from 'express';
import { purchaseHistoryController } from '../app';

export function purchaseHistoryRoutes() {
	const purchaseHistoryRoutes = express.Router();
	purchaseHistoryRoutes.get('/ph', purchaseHistoryController.addToPurchaseHistory);
	purchaseHistoryRoutes.post('/ph', purchaseHistoryController.goToPurchaseHistory);
	return purchaseHistoryRoutes;
}