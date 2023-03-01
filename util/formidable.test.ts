import formidable from 'formidable';
import Knex from 'knex';
import { Request, Response } from 'express';
import { UserService } from '../services/userService';
import { hashPassword } from './hash';
import { User } from './interface';
import { createRequest } from './test-helper';
import { form, formParsePromise, uploadDir } from './formidable';

jest.mock('../util/hash');

const knexConfig = require('../knexfile');
const knex = Knex(knexConfig['test']);

formidable;
formParsePromise;

describe('formParsePromise', () => {
	let req: Request;
	let res: Response;
	beforeEach(() => {
		// io = createSocketIO();
		req = createRequest();
		// res = createResponse();

		(hashPassword as jest.Mock).mockReturnValue(true);
		// formParsePromise = jest.fn(async () => ) as any;
		// userService.getUserByEmail = jest.fn(async () => fakeUser);
	});

	it('should reject with an error if form parsing fails', async () => {
		// Create a mock request object with no form data
		const req = {
			headers: {},
			body: {}
		} as unknown as Request;

		// Call the formParsePromise function with the mock request object
		await expect(formParsePromise(req)).rejects.toThrow();
	});
});
