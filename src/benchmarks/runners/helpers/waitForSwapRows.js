export async function waitForSwapRows(page, prevState) {
    const currentState = await page.locator('table tr').allTextContents();

    return await page.evaluate(({prevState, currentState}) => {
        return currentState[1] !== prevState[1] && currentState[1] === prevState[2];
    }, {prevState, currentState});
}
