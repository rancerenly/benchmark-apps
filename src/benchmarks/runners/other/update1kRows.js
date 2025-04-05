import { chromium } from 'playwright';
import { createInitialRows } from '../utils/helpers.js';
import { waitForTestCompletion } from './waitForTestCompletion.js';

export async function testUpdateAllRows(url, testCase, iterations = 1) {
    const browser = await chromium.launch({ headless: false, args: ['--no-sandbox'] });
    const results = [];

    for (let i = 0; i < iterations; i++) {
        const context = await browser.newContext();
        const page = await context.newPage();
        await page.goto(url, { waitUntil: 'networkidle' });

        await createInitialRows(page);

        const start = performance.now();
        const button = await page.$(`button#${testCase.id}`);
        if (!button) throw new Error(`Button ${testCase.id} not found`);

        await button.click();
        await waitForTestCompletion(page, testCase.id);
        const end = performance.now();

        results.push(end - start);

        await context.close();
    }

    const averageTime = results.length ? (results.reduce((a, b) => a + b) / results.length).toFixed(2) : 'N/A';
    const minTime = results.length ? Math.min(...results).toFixed(2) : 'N/A';
    const maxTime = results.length ? Math.max(...results).toFixed(2) : 'N/A';

    return {
        test: testCase.name,
        averageTime,
        minTime,
        maxTime,
        iterations,
    };
}
