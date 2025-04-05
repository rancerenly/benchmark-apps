import React from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Button,
    Box,
    Typography,
    Paper
} from '@mui/material';
import SortButton from './SortButton';

const BenchmarkResultsTable = ({ testResults, frameworks, handleSort, sortConfig }) => {
    return (
        <Box mt={4} mb={4}>
            <Typography variant="h5" gutterBottom>Тесты производительности</Typography>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Framework</TableCell>
                            {testResults.map((test) => (
                                <TableCell key={test.test}>
                                    <SortButton
                                        testName={test.test}
                                        handleSort={handleSort}
                                        sortConfig={sortConfig}
                                    />
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {frameworks.map((framework) => (
                            <TableRow key={framework}>
                                <TableCell>{framework}</TableCell>
                                {testResults.map((test) => (
                                    <TableCell key={`${framework}-${test.test}`}>
                                        {test.results[framework]?.averageTime || '-'} ms
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default BenchmarkResultsTable;
