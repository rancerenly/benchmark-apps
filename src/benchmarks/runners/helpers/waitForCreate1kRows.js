export async function waitForCreate1000Rows(page) {
    await page.waitForFunction(() => {
        const rows = document.querySelectorAll('table tr');
        return rows.length === 1000;
    });
}
