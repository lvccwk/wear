import { CollectionService } from '../services/collectionService';
import express from 'express';
import type { Server as SocketServer } from 'socket.io';

export class CollectionController {
	constructor(private collectionService: CollectionService, private io: SocketServer) {}

    addToCollection = async (req: express.Request, res: express.Response) => {
		try {
            // let { files } = await formParsePromise(req)
			// let fileName = files.image ? files.image['newFilename'] : ''
            let imagePath = req.body.image
			
			let image = await this.collectionService.postCollection(imagePath)

			res.json({
				message: 'add to collection success',
                imageId: image
			})
		} catch (error) {
			res.status(500).json({
                message: '[COL001] - Server error'
			});
		}
	};

    // dropFromCollection = async (req: express.Request, res: express.Response) => {
	// 	try {
    //         // let { files } = await formParsePromise(req)
	// 		// let fileName = files.image ? files.image['newFilename'] : ''
    //         let imagePath = req.body.image
			
	// 		await this.collectionService.dropCollection(imagePath)

	// 		res.json({
	// 			message: 'drop from collection success'
	// 		})
	// 	} catch (error) {
	// 		res.status(500).json({
    //             message: '[COL002] - Server error'
	// 		});
	// 	}
	// };
}
