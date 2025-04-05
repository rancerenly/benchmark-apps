import fs from 'fs';
import path from 'path';

export async function createInitialRows(page) {
    const button = await page.$('button#btn-add-rows');
    if (!button) throw new Error('Create 1k button not found');

    await button.click();
    await page.waitForSelector('tbody tr:nth-child(1000)', { timeout: 30000 });
}

export function writeResultsToFile(results, filename = 'benchmark_results.json') {
    const filePath = path.resolve('benchmark_results.json');

    const dirPath = path.dirname(filePath);
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }

    const dataToWrite = JSON.stringify(results, null, 2);

    fs.writeFileSync(filePath, dataToWrite, 'utf8');

    console.log(`Results saved to ${filePath}`);
}
