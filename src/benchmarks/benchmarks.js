import { testUrls } from './config.js';
import { runPlaywrightBenchmark } from "./runners/playwright/playwright.js";

const iterations = 1;

const allResults = [];

for (const { url, framework } of testUrls) {
    console.log(`\n🎯 Running benchmarks for ${framework}...`);
    const results = await runPlaywrightBenchmark(url, framework, 'Playwright', iterations);
    allResults.push(...results);
}

console.table(allResults);
