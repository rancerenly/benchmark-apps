import { waitForCreate1000Rows } from "./waitForCreate1kRows.js";
import { waitForUpdateAllRows } from "./waitForUpdate1kRows.js";
import { waitForUpdateEvery10thRow } from "./waitForUpdateEvery10thRow.js";
import { waitForSelectRow } from "./waitForSelectRow.js";
import { waitForSwapRows } from "./waitForSwapRows.js";
import { waitForDeleteRow } from "./waitForDeleteRow.js";
import { waitForCreate10000Rows } from "./waitForCreate10kRows.js";
import { waitForAppend1000Rows } from "./waitForAppend1kRows.js";
import { waitForClearTable } from "./waitForClearTable.js";

export async function waitForTestCompletion(page, testId, prevState) {
    switch (testId) {
        case 'btn-add-rows':
            return await waitForCreate1000Rows(page);
        case 'btn-update':
            return await waitForUpdateAllRows(page, prevState);
        case 'btn-update-10':
            return await waitForUpdateEvery10thRow(page, prevState);
        case 'btn-select':
            return await waitForSelectRow(page);
        case 'btn-swap':
            return await waitForSwapRows(page, prevState);
        case 'btn-remove-row':
            return await waitForDeleteRow(page);
        case 'btn-create-10k':
            return await waitForCreate10000Rows(page);
        case 'btn-add':
            return await waitForAppend1000Rows(page);
        case 'btn-clear':
            return await waitForClearTable(page);
        default:
            throw new Error(`Unknown testId: ${testId}`);
    }
}
