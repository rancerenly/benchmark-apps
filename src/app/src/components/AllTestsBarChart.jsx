import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const frameworkColors = {
    'Angular': '#f637e3',
    'React': '#61DBFB',
    'Vue': '#34495E',
    'Svelte': '#aa1e1e'
};

const AllTestsBarChart = ({ testResults, frameworks }) => {
    const filteredTests = testResults.filter(test =>
        !test.test.includes('10,000') &&
        !test.test.includes('10000')
    );

    const prepareChartData = () => {
        return filteredTests.map(test => {
            const testData = { test: test.test };
            frameworks.forEach(framework => {
                testData[framework] = test.results[framework]?.averageTime || 0;
            });
            return testData;
        });
    };

    const chartData = prepareChartData();

    return (
        <Box mt={4}>
            <Typography variant="h5" gutterBottom>
                Сравнение производительности по тесту (групповая столбчатая диаграмма)
            </Typography>
            <Paper elevation={3} style={{ padding: '20px', height: '500px' }}>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={chartData}
                        layout="vertical"
                        margin={{ top: 20, right: 30, left: 100, bottom: 5 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" label={{ value: 'Time (ms)', position: 'insideBottom' }} />
                        <YAxis
                            type="category"
                            dataKey="test"
                            width={80}
                            tick={{ fontSize: 12 }}
                        />
                        <Tooltip />
                        <Legend />
                        {frameworks.map(framework => (
                            <Bar
                                key={framework}
                                dataKey={framework}
                                fill={frameworkColors[framework]}
                                name={framework}
                            />
                        ))}
                    </BarChart>
                </ResponsiveContainer>
            </Paper>
        </Box>
    );
};

export default AllTestsBarChart;