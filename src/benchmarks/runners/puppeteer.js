
import puppeteer from 'puppeteer';
import { testCases } from '../config.js';
import { createInitialRows } from '../utils/helpers.js';

export async function runPuppeteerBenchmark(url, framework = "Unknown", environment = "Puppeteer", iterations = 1) {
    const browser = await puppeteer.launch({ headless: false, args: ['--no-sandbox'] });
    const results = [];

    for (const testCase of testCases) {
        const times = [];

        for (let i = 0; i < iterations; i++) {
            const page = await browser.newPage();
            await page.goto(url, { waitUntil: 'networkidle2' });

            try {
                if (['btn-swap', 'btn-update', 'btn-clear'].includes(testCase.id)) {
                    await createInitialRows(page);
                }

                const button = await page.$(`button#${testCase.id}`);
                if (!button) continue;

                const start = performance.now();
                await button.click();
                await waitForTestCompletion(page, testCase.id);
                const end = performance.now();

                times.push(end - start);
            } catch (e) {
                console.error(`Error in ${testCase.name}:`, e.message);
            } finally {
                await page.close();
            }
        }

        results.push({
            framework,
            test: testCase.name,
            averageTime: times.length ? (times.reduce((a, b) => a + b) / times.length).toFixed(2) : "N/A",
            environment,
            iterations: times.length,
            minTime: times.length ? Math.min(...times).toFixed(2) : "N/A",
            maxTime: times.length ? Math.max(...times).toFixed(2) : "N/A",
            ...(times.length === 0 && { error: "No successful iterations" })
        });
    }

    await browser.close();
    return results;
}

async function waitForTestCompletion(page, testId) {
    switch (testId) {
        case 'btn-clear':
            await page.waitForFunction(() => document.querySelectorAll('tbody tr').length === 0);
            break;
        case 'btn-swap':
            await page.waitForFunction(() => {
                const rows = document.querySelectorAll('tbody tr');
                return rows.length > 0 && rows[0].textContent.includes('9999');
            });
            break;
        case 'btn-update':
            await page.waitForFunction(() => document.querySelectorAll('tbody tr.updated').length >= 1000);
            break;
        default:
            await page.waitForSelector('tbody tr:first-child');
    }
}
