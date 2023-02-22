import form from 'formidable';
import Knex from 'knex';
import { formParsePromise } from './formidable';
import { createRequest, createResponse } from './test-helper';
import { Request, Response } from 'express';

const knexConfig = require('../knexfile');
const knex = Knex(knexConfig['test']);

describe('formParsePromise', () => {
	let req: Request;
	let res: Response;
	beforeEach(() => {
		req = createRequest();
		res = createResponse();
	});
	it('addToCart : 500 fail - [CAR001] - Server error', async () => {
		let result = await formParsePromise(req);

		expect(result).toBeNull;
		expect(result).toBeCalledWith(0);
		expect(res.json).toBeCalledWith({ message: '[CAR001] - Server error' });
	});

	// it.only('should resolve with fields and files when the form is parsed successfully', async () => {
	// 	const result = await formParsePromise(req);
	// 	form.parse(req, (err, fields, files));
	// 	expect(result).toEqual({ fields: {}, files: {} });
	// });

	// // it('should reject with an error when the form parsing fails', async () => {
	// // 	const error = new Error('Form parsing failed');
	// // 	jest.spyOn(form, 'parse').mockImplementation((req, cb) => {
	// // 		cb(error, {}, {});
	// // 	});

	// // 	await expect(formParsePromise(req)).rejects.toThrow(error);
	// // });
});
