import express from 'express';
import { collectionController } from '../app';
import { isLoggedInAPI } from '../util/guard'

export function collectionRoutes() {
	const collectionRoutes = express.Router();
	collectionRoutes.post('/', collectionController.addToCollection);
    // collectionRoutes.delete('/:id', isLoggedInAPI, collectionController.dropFromCollection);
	return collectionRoutes;
}
