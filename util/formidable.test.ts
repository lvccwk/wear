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
		req = createRequest();

		(hashPassword as jest.Mock).mockReturnValue(true);
	});

	it('should reject with an error if form parsing fails', async () => {
		const req = {
			headers: {},
			body: {}
		} as unknown as Request;

		await expect(formParsePromise(req)).rejects.toThrow();
	});
});
