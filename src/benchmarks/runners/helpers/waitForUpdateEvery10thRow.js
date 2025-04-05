export async function waitForUpdateEvery10thRow(page, prevState) {
    const currentState = await page.locator('table tr').allTextContents();

    return await page.evaluate(({prevState, currentState}) => {
        return prevState[9] !== currentState[9];
    }, {prevState, currentState});
}
