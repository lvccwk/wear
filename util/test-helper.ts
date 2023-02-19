import SocketIO from 'socket.io';
import { Request, Response } from 'express';
export function createSocketIO() {
	const emit = jest.fn((event: string, msg: string) => null);
	return {
		to: jest.fn(() => ({ emit })),
		emit
	} as unknown as SocketIO.Server;
}

export function createRequest() {
	return {
		body: {
			display_name: 'test-user',
			email: 'test@email.com',
			password: '1234'
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
