import Knex from 'knex';
import { Page, chromium } from 'playwright';

const knexConfig = require('./knexfile');
const knex = Knex(knexConfig['test']); // Connection to the test database.

describe('Login', () => {
	let page: Page;

	beforeAll(async () => {
		const browser = await chromium.launch();
		page = await browser.newPage();
	});

	it('login', async () => {
		await page.goto('http://localhost:8080/');
		await page.getByRole('link', { name: '登入' }).click();
		await page
			.locator('#signin-form')
			.getByRole('button', { name: 'Sign In', exact: true })
			.click();
	});

	it('register', async () => {
		await page.goto('http://localhost:8080/');
		await page.getByRole('link', { name: '登入' }).click();
		await page.locator('#signUp').click();
		await page.locator('#signup-form').getByPlaceholder('Email').click();
		await page.locator('#signup-form').getByPlaceholder('Email').fill('test_admin@com');
		await page.once('dialog', async (dialog) => {
			// await console.log(`Dialog message: ${dialog.message()}`);
			await dialog.dismiss().catch(() => {});
		});
		await page.locator('#signup-form').getByRole('button', { name: 'Sign Up' }).click();
	});

	afterEach(async () => {
		// await knex.raw('delete from users where email = ?', ['test_admin@com']);
		await knex('users').where({
			email: 'test_admin@com'
		});
	});
});
