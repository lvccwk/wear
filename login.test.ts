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

	// it('login', async () => {
	// 	await page.goto('http://localhost:8080/');
	// 	await page.getByRole('link', { name: '登入' }).click();
	// 	await page
	// 		.locator('#signin-form')
	// 		.getByRole('button', { name: 'Sign In', exact: true })
	// 		.click();
	// });

	it('test', async () => {
		await page.goto('http://localhost:8080/');
		await page.getByRole('link', { name: '登入' }).click();
		await page
			.locator('#signin-form')
			.getByRole('button', { name: 'Sign In', exact: true })
			.click();
		await page.getByRole('link', { name: 'Go somewhere' }).first().click();
		await page.getByRole('button', { name: 'CHECKOUT' }).click();
		await page.click("[id='email']");
		await page.locator('#email').fill('test@test.test');
		await page.getByPlaceholder('1234 1234 1234 1234').click();
		await page.getByPlaceholder('1234 1234 1234 1234').fill('4242 4242 4242 4242');

		await page.click("[id='cardExpiry']");
		await page.locator('#cardExpiry').fill('03 / 30');

		await page.click("[id='cardCvc']");
		await page.locator('#cardCvc').fill('333');

		await page.click("[id='billingName']");
		await page.locator('#billingName').fill('qqq');
		await page.getByTestId('hosted-payment-submit-button').click();
	}, 100000);
});
