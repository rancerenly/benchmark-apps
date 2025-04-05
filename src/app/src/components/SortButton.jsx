import React from 'react';
import { Button } from '@mui/material';

const SortButton = ({ testName, handleSort, sortConfig }) => {
    return (
        <Button
            onClick={() => handleSort(testName)}
            style={{ fontWeight: sortConfig.testName === testName ? 'bold' : 'normal' }}
        >
            {testName}
            {sortConfig.testName === testName && (
                sortConfig.direction === 'asc' ? ' ↑' : ' ↓'
            )}
        </Button>
    );
};

export default SortButton;
