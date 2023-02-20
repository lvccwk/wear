// import SocketIO from 'socket.io';
import { Request, Response } from 'express';
// export function createSocketIO() {
// 	const emit = jest.fn((event: string, msg: string) => null);
// 	return {
// 		to: jest.fn(() => ({ emit })),
// 		emit
// 	} as unknown as SocketIO.Server;
// }

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
			display_name: 'test-user',
			email: 'test@email.com',
			password: '1234'
		},
		params: {}
	} as unknown as Request;
}

export function createFailRequest() {
	return {
		body: {
			display_name: 'fail-user',
			email: 'fail@email.com',
			password: 'fail'
		},
		params: {}
	} as unknown as Request;
}

export function createNewAcRequest() {
	return {
		body: {
			display_name: 'new-user',
			email: 'new@email.com',
			password: 'new'
		},
		params: {}
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

export function createResponse500() {
	const json = jest.fn(() => '[USR002] - Server error');

	return {
		status: jest.fn((status: number) => {
			return { json };
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
