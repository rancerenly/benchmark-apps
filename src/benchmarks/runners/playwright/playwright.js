import { chromium } from 'playwright';
import { testCases } from "../../config.js";
import { waitForTestCompletion } from "../helpers/waitForTestCompletion.js";

// createInitialRows.js
export async function createInitialRows(page) {
    const createButton = await page.waitForSelector('button#btn-add-rows', { visible: true });
    if (!createButton) {
        throw new Error('Button to add 1000 rows not found');
    }

    await createButton.click();
}

// create10kRows.js
export async function create10kRows(page) {
    const createButton = await page.$('button#btn-create-10k');
    if (!createButton) {
        throw new Error('Button to create 10000 rows not found');
    }
}

// appendRows.js
export async function appendRows(page) {
    await createInitialRows(page);
    const appendButton = await page.$('button#btn-add');
    if (!appendButton) {
        throw new Error('Button to append 1000 rows not found');
    }
}

// updateRows.js
export async function updateRows(page) {
    await createInitialRows(page);
    const updateButton = await page.$('button#btn-update');
    if (!updateButton) {
        throw new Error('Button to update rows not found');
    }
}

// update10thRows.js
export async function update10thRows(page) {
    await createInitialRows(page);
    const updateButton = await page.$('button#btn-update-10');
    if (!updateButton) {
        throw new Error('Button to update every 10th row not found');
    }
}

// selectRow.js
export async function selectRow(page) {
    await createInitialRows(page);
    const selectButton = await page.$('button#btn-select');
    if (!selectButton) {
        throw new Error('Button to select row not found');
    }
}

// swapRows.js
export async function swapRows(page) {
    await createInitialRows(page);
    const swapButton = await page.$('button#btn-swap');
    if (!swapButton) {
        throw new Error('Button to swap rows not found');
    }
}

// clearRows.js
export async function clearRows(page) {
    await createInitialRows(page);
    const clearButton = await page.$('button#btn-clear');
    if (!clearButton) {
        throw new Error('Button to clear rows not found');
    }
}

// removeRow.js
export async function removeRow(page) {
    await createInitialRows(page);

    const removeButtonLocator = page.locator('.btn-danger').first();

    await removeButtonLocator.waitFor({ state: 'visible' });

    const isButtonVisible = await removeButtonLocator.isVisible();
    if (!isButtonVisible) {
        throw new Error('Button to delete row is not visible');
    }
}

const handlers = {
    'btn-add-rows': createInitialRows,
    'btn-create-10k': create10kRows,
    'btn-add': appendRows,
    'btn-update': updateRows,
    'btn-update-10': update10thRows,
    'btn-select': selectRow,
    'btn-swap': swapRows,
    'btn-clear': clearRows,
    'btn-remove-row': removeRow
};

export async function runPlaywrightBenchmark(url, framework = "Unknown", environment = "Playwright", iterations = 1) {
    const browser = await chromium.launch({ headless: false, args: ['--no-sandbox'] });
    const results = [];

    for (const testCase of testCases) {
        console.log('---------------------------------------------------------------------------------------------------')
        console.log('Current testCase: ', testCase);
        console.log('All iterations:', iterations)
        const times = [];
        const domMutationsArr = [];
        const visiblePaintDelays = [];

        for (let i = 0; i < iterations; i++) {

            const context = await browser.newContext();
            const page = await context.newPage();
            await page.goto(url, { waitUntil: 'networkidle' });

            try {
                if (testCase.id !== 'btn-add-rows') {
                    await handlers[testCase.id](page);
                }

                let button = await page.$(`button#${testCase.id}`);
                if (testCase.id === 'btn-remove-row') {
                    button = page.locator('.btn-danger').first();
                }
                if (!button) throw new Error(`Button ${testCase.id} not found`);

                const prevState = await page.locator('table tr').allTextContents();

                await page.evaluate(() => {
                    window.__domMutationCount = 0;
                });

                const visiblePaintPromise = page.evaluate(() => {
                    return new Promise((resolve) => {
                        const startTime = performance.now();
                        const targetNode = document.querySelector('table.test-data');
                        if (!targetNode) {
                            resolve(-1);
                            return;
                        }
                        const observer = new MutationObserver((mutations, obs) => {
                            obs.disconnect();
                            requestAnimationFrame(() => {
                                const endTime = performance.now();
                                resolve(endTime - startTime);
                            });
                        });
                        observer.observe(targetNode, {
                            attributes: true,
                            childList: true,
                            subtree: true,
                            characterData: true,
                        });
                    });
                });

                const start = performance.now();


                await button.click();

                const visiblePaintDelay = await visiblePaintPromise;
                visiblePaintDelays.push(visiblePaintDelay);


                await waitForTestCompletion(page, testCase.id, prevState);

                const end = performance.now();


                console.log('visiblePaintDelays', visiblePaintDelays)

                const domMutations = await page.evaluate(() => window.__domMutationCount || 0);
                domMutationsArr.push(domMutations);

                times.push(end - start);
            } catch (error) {
                console.error(`Error in ${testCase.name} (iteration ${i + 1}): ${error.message}`);
            } finally {
                await context.close();
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
            averageDomMutations: domMutationsArr.length ? (domMutationsArr.reduce((a,b) => a+b) / domMutationsArr.length).toFixed(2) : "N/A",
            averageVisiblePaintDelay: visiblePaintDelays.length ? (visiblePaintDelays.reduce((a,b) => a+b) / visiblePaintDelays.length).toFixed(2) : "N/A",
            ...(times.length === 0 && { error: "No successful iterations" })
        });
    }

    await browser.close();
    return results;
}