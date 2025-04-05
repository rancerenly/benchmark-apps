export async function waitForAppend1000Rows(page) {
    await page.waitForFunction(() => {
        const rows = document.querySelectorAll('table tr');
        return rows.length === 2000;
    });
}
