export async function createInitialRows(page) {
    const button = await page.$('button#btn-add-rows');
    if (!button) throw new Error('Create 1k button not found');

    await button.click();
    await page.waitForSelector('tbody tr:nth-child(1000)', { timeout: 30000 });
}
