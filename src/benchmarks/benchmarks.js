import { testUrls } from './config.js';
import { runPlaywrightBenchmark, runLighthouseBenchmark } from "./runners/index.js";
import { writeResultsToFile } from "./utils/index.js";

const iterations = 1;

const allResults = [];

let lighthouseResults = {};

for (const { url, framework } of testUrls) {
    console.log(`\n🎯 Running benchmarks for ${framework}...`);
    lighthouseResults[framework] = await runLighthouseBenchmark(url, framework);
    allResults.push(...await runPlaywrightBenchmark(url, framework, 'Playwright', iterations));
}

writeResultsToFile(allResults);
writeResultsToFile(lighthouseResults, 'lighthouse_results.json');
console.table(allResults);
