export async function waitForClearTable(page) {
    await page.waitForFunction(() => {
        const rows = document.querySelectorAll('table tr');
        return rows.length === 0;
    });
}
