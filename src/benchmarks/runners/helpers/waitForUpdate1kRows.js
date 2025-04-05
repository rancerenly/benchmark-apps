export async function waitForUpdateAllRows(page, prevState) {
    const currentState = await page.locator('table tr').allTextContents();

    return await page.evaluate(({prevState, currentState}) => {
        return currentState.every((curr, index) => curr !== prevState[index]);
    }, {prevState, currentState});
}
