export const testUrls = [
    { url: 'http://localhost:4200', framework: 'Angular' },
    { url: 'http://localhost:4201', framework: 'React' },
    { url: 'http://localhost:4202', framework: 'Vue' },
    { url: 'http://localhost:4203', framework: 'Svelte' },
];

export const testCases = [
    { id: 'btn-add-rows', name: 'Create 1,000 Rows', handler: 'createInitialRows' },
    { id: 'btn-create-10k', name: 'Create 10,000 Rows', handler: 'create10kRows' },
    { id: 'btn-add', name: 'Append 1,000 Rows', handler: 'appendRows' },
    { id: 'btn-update', name: 'Update all rows', handler: 'updateRows' },
    { id: 'btn-update-10', name: 'Update every 10th Row', handler: 'update10thRows' },
    { id: 'btn-select', name: 'Select row', handler: 'selectRow' },
    { id: 'btn-swap', name: 'Swap Rows', handler: 'swapRows' },
    { id: 'btn-clear', name: 'Clear Rows', handler: 'clearRows' },
    { id: 'btn-remove-row', name: 'Delete Row', handler: 'removeRow' }
];