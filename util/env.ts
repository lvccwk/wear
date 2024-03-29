import dotenv from 'dotenv';

dotenv.config();

export const env = {
	DB_HOST: process.env.DB_HOST,
	DB_NAME: process.env.DB_NAME,
	TEST_DB_NAME: process.env.TEST_DB_NAME,
	DB_USERNAME: process.env.DB_USERNAME,
	DB_PASSWORD: process.env.DB_PASSWORD,
	GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
	GOOGLE_SECRET: process.env.GOOGLE_SECRET
};
