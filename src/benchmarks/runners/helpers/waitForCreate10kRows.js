export async function waitForCreate10000Rows(page) {
    await page.waitForFunction(() => {
        const rows = document.querySelectorAll('table tr');
        return rows.length === 10000;
    });
}
