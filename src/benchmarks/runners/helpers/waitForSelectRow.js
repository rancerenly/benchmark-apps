export async function waitForSelectRow(page) {
    await page.waitForFunction(() => {
        const selectedRow = document.querySelector('table tr.danger');
        return selectedRow !== null;
    });
}
