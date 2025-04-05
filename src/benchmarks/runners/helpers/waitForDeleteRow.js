export async function waitForDeleteRow(page) {
    await page.waitForFunction(() => {
        const rows = document.querySelectorAll('table tr');
        return rows.length === 999;
    });
}
