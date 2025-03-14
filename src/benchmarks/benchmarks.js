// Benchmark automation using Playwright, Lighthouse, and Puppeteer
import { chromium } from 'playwright';
import puppeteer from 'puppeteer';
import lighthouse from 'lighthouse';
import { writeFileSync } from 'fs';
import { URL } from 'url';

const testUrls = [
    { url: 'http://localhost:4200', framework: 'Angular' },
    { url: 'http://localhost:4201', framework: 'React' },
    { url: 'http://localhost:4202', framework: 'Vue' },
    { url: 'http://localhost:4202', framework: 'Svelte' },
];


const testCases = [
    { id: 'btn-add-rows', name: 'Add 1,000 Rows' },
    { id: 'btn-create-10k', name: 'Create 10,000 Rows' },
    { id: 'btn-swap', name: 'Swap Rows' },
    { id: 'btn-update', name: 'Update every 10th Row' },
    { id: 'btn-clear', name: 'Clear Rows' }
];

async function runPlaywrightBenchmark(url, framework = "Unknown Framework", testEnvironment = "Playwright", iterations = 1) {
    const browser = await chromium.launch({ headless: false }); // Запускаем браузер
    const page = await browser.newPage();
    await page.goto(url);

    console.log(`Running Playwright benchmark for ${framework} at ${url}`);

    await page.waitForLoadState('domcontentloaded');

    let results = [];

    for (const testCase of testCases) {
        let times = [];
        console.log(`Testing: ${testCase.name}`);

        for (let i = 0; i < iterations; i++) {
            console.log(`Iteration ${i + 1} for ${testCase.name}`);

            const button = await page.$(`button#${testCase.id}`);
            if (!button) {
                console.error(`❌ Button ${testCase.name} not found on ${url}`);
                continue;
            }

            const start = performance.now();
            await button.click();

            if (testCase.id === 'btn-clear') {
                await page.waitForFunction(() => document.querySelectorAll('tbody tr').length === 0);
            } else {
                await page.waitForSelector('tbody tr:first-child', { timeout: 60000 });
            }

            const end = performance.now();

            const duration = end - start;
            times.push(duration);
            console.log(`Iteration ${i + 1} time: ${duration} ms`);
        }

        const averageTime = times.length > 0 ? (times.reduce((a, b) => a + b, 0) / times.length).toFixed(2) : "N/A";
        results.push({ framework, test: testCase.name, averageTime: averageTime, environment: testEnvironment });
        console.log(`Average execution time for ${testCase.name}: ${averageTime} ms`);
    }

    await browser.close();
    console.table(results);
    return results;
}

export { runPlaywrightBenchmark };


async function runPuppeteerBenchmark(url, framework = "Unknown Framework", testEnvironment = "Puppeteer", iterations = 1) {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto(url);

    console.log(`Running Puppeteer benchmark for ${framework} at ${url}`);


    let results = [];

    for (const testCase of testCases) {
        let times = [];
        console.log(`Testing: ${testCase.name}`);

        for (let i = 0; i < iterations; i++) {
            console.log(`Iteration ${i + 1} for ${testCase.name}`);

            const button = await page.$(`button#${testCase.id}`);
            if (!button) {
                console.error(`❌ Button ${testCase.name} not found on ${url}`);
                continue;
            }

            const start = performance.now();
            await button.click();

            if (testCase.id === 'btn-clear') {
                await page.waitForFunction(() => document.querySelectorAll('tbody tr').length === 0);
            } else {
                await page.waitForSelector('tbody tr:first-child', { timeout: 60000 });
            }

            const end = performance.now();

            const duration = end - start;
            times.push(duration);
            console.log(`Iteration ${i + 1} time: ${duration} ms`);
        }

        const averageTime = times.length > 0 ? (times.reduce((a, b) => a + b, 0) / times.length).toFixed(2) : "N/A";
        results.push({ framework, test: testCase.name, averageTime: averageTime, environment: testEnvironment });
        console.log(`Average execution time for ${testCase.name}: ${averageTime} ms`);
    }

    await browser.close();
    return results;
}

export { runPuppeteerBenchmark };

async function runLighthouseBenchmark(url, framework = "Unknown") {
    console.log(`Running Lighthouse benchmark for ${framework} at ${url}`);

    const browser = await puppeteer.launch({
        headless: true,
        args: ['--remote-debugging-port=9222'],
    });

    const { lhr } = await lighthouse(url, {
        port: new URL(browser.wsEndpoint()).port,
        output: 'json',
        throttlingMethod: 'provided',
        preset: 'desktop',
        onlyCategories: ['performance'],
    });

    await browser.close();

    const results = [
        { framework, test: 'Performance Score', averageTime: Math.round(lhr.categories.performance.score * 100), environment: 'Lighthouse' },
        { framework, test: 'First Contentful Paint (FCP)', averageTime: Math.round(lhr.audits['first-contentful-paint'].numericValue), environment: 'Lighthouse' },
        { framework, test: 'Largest Contentful Paint (LCP)', averageTime: Math.round(lhr.audits['largest-contentful-paint'].numericValue), environment: 'Lighthouse' },
        { framework, test: 'Total Blocking Time (TBT)', averageTime: Math.round(lhr.audits['total-blocking-time'].numericValue), environment: 'Lighthouse' },
        { framework, test: 'Cumulative Layout Shift (CLS)', averageTime: lhr.audits['cumulative-layout-shift'].numericValue.toFixed(2), environment: 'Lighthouse' },
        { framework, test: 'Speed Index', averageTime: Math.round(lhr.audits['speed-index'].numericValue), environment: 'Lighthouse' },
        { framework, test: 'Time to Interactive (TTI)', averageTime: Math.round(lhr.audits['interactive'].numericValue), environment: 'Lighthouse' },
    ];

    return results;
}

export { runLighthouseBenchmark };


async function runAllBenchmarks() {
    let allResults = [];

    for (const { url, framework } of testUrls) {
        console.log(`Running benchmarks for ${framework} (${url})...`);

        const playwrightResults = await runPlaywrightBenchmark(url, framework);
        const puppeteerResults = await runPuppeteerBenchmark(url, framework);
        const lighthouseResults = await runLighthouseBenchmark(url, framework);

        allResults.push(...playwrightResults, ...puppeteerResults ,...lighthouseResults);
    }

    console.table(allResults);
    writeFileSync('benchmark_results.json', JSON.stringify(allResults, null, 2));
}

runAllBenchmarks();
