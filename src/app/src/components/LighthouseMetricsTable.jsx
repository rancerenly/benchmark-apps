import React from 'react';
import {Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography} from '@mui/material';

const LighthouseMetricsTable = ({ lighthouseData, frameworks }) => {
    const lighthouseMetrics = [
        'performanceScore', 'firstContentfulPaint', 'largestContentfulPaint',
        'totalBlockingTime', 'cumulativeLayoutShift', 'speedIndex', 'timeToInteractive'
    ];

    const metricLabels = {
        performanceScore: 'Performance Score',
        firstContentfulPaint: 'First Contentful Paint (ms)',
        largestContentfulPaint: 'Largest Contentful Paint (ms)',
        totalBlockingTime: 'Total Blocking Time (ms)',
        cumulativeLayoutShift: 'Cumulative Layout Shift',
        speedIndex: 'Speed Index',
        timeToInteractive: 'Time to Interactive (ms)'
    };

    const renderLighthouseValue = (value) => {
        if (value === undefined || value === null) return '-';
        if (typeof value === 'number') {
            return value;
        }
        return value;
    };

    return (
        <Box mt={4} mb={4}>
            <Typography variant="h5" gutterBottom>Lighthouse Performance Metrics</Typography>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Framework</TableCell>
                            {lighthouseMetrics.map(metric => (
                                <TableCell key={metric}>{metricLabels[metric]}</TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {frameworks.map((framework) => (
                            <TableRow key={`lh-${framework}`}>
                                <TableCell><strong>{framework}</strong></TableCell>
                                {lighthouseMetrics.map(metric => (
                                    <TableCell key={`${framework}-${metric}`}>
                                        {renderLighthouseValue(lighthouseData[framework]?.[metric])}
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

export default LighthouseMetricsTable;
