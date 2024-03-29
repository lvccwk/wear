import { Request, Response } from 'express';

export function createRequest() {
	return {
		session: {
			grant: {
				response: {
					access_token: 'google_test_token'
				}
			}
		},
		body: {
			id: 10,
			display_name: 'test-user',
			email: '1123@email.com',
			password: 'abc',
			image: 'abc.jpg'
		},
		params: { id: 1 },
		fields: { email: '123.com', display_name: '123', hashPassword: '123' },
		files: { image: { newFilename: 'yyy.jpeg' } },
		cart: { id: 1, image: 'apple.png' }
	} as unknown as Request;
}

export function createResponse() {
	const json = jest.fn(() => null);
	const redirect = jest.fn(() => null);

	return {
		status: jest.fn((status: number) => {
			return { json, redirect };
		}),
		json,
		redirect
	} as unknown as Response;
}

export function createRequestId() {
	return {
		session: {
			user: {
				id: 1
			}
		},
		body: {
			id: 10,
			display_name: 'test-user',
			email: '1123@email.com',
			password: 'abc',
			image: 'abc.jpg'
		},
		params: { id: 1 }
	} as unknown as Request;
}

export function createRequestWithoutParams() {
	return {
		session: {
			grant: {
				response: {
					access_token: 'google_test_token'
				}
			}
		},
		body: {
			display_name: 'test-user',
			email: '1123@email.com',
			password: 'abc'
		},
		params: {}
	} as unknown as Request;
}

export function createLoginAcRequest() {
	return {
		body: {
			email: 'new@email.com',
			password: 'new'
		},
		params: {}
	} as unknown as Request;
}

export function createRegAcRequest() {
	return {
		body: {
			name: 'new-user2',
			email: 'new@email.com',
			password: 'new1',
			confirmPassword: 'new1'
		},
		params: {}
	} as unknown as Request;
}

export function createResponse500() {
	const json = jest.fn(() => '[USR002] - Server error');

	return {
		status: jest.fn((status: number) => {
			return { json, status };
		}),
		json
	} as unknown as Response;
}

export function createResponseLogin() {
	const json = jest.fn(() => '[USR001] - Server error');

	return {
		status: jest.fn((status: number) => {
			return { json };
		}),
		json
	} as unknown as Response;
}

export function createResponseLogin402() {
	const json = jest.fn(() => 'Invalid email');

	return {
		status: jest.fn((status: number) => {
			return { json, status };
		}),
		json
	} as unknown as Response;
}
