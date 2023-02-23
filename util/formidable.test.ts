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
	xit('addToCart : 500 fail - [CAR001] - Server error', async () => {
		await formParsePromise;
		// expect(() => formParsePromise).toBeCalledTimes(0);
		// expect(result).toBeUndefined;
		// expect(formParsePromise).toBeCalledWith(0);
		// expect(res.json).toBeCalledWith({ message: '[CAR001] - Server error' });
	});
});
