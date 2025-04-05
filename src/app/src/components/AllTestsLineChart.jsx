import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const AllTestsLineChart = ({ testResults, frameworks }) => {
    // Фильтруем тесты, исключая тест с 10k записями
    const filteredTests = testResults.filter(test =>
        !test.test.includes('10,000') &&
        !test.test.includes('10000')
    );

    // Подготовка данных для графика
    const prepareChartData = () => {
        return frameworks.map(framework => {
            const frameworkData = { framework };
            filteredTests.forEach(test => {
                frameworkData[test.test] = test.results[framework]?.averageTime || 0;
            });
            return frameworkData;
        });
    };

    const chartData = prepareChartData();

    // Создаем линии для каждого теста
    const renderTestLines = () => {
        return filteredTests.map((test, index) => (
            <Line
                key={test.test}
                type="monotone"
                dataKey={test.test}
                stroke={`hsl(${index * 60}, 70%, 50%)`}
                activeDot={{ r: 6 }}
                name={test.test}
            />
        ));
    };

    return (
        <Box mt={4}>
            <Typography variant="h5" gutterBottom>
                Сравнение производительности (все тесты)
            </Typography>
            <Paper elevation={3} style={{ padding: '20px', height: '400px' }}>
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                        data={chartData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="framework" />
                        <YAxis label={{ value: 'Time (ms)', angle: -90, position: 'insideLeft' }} />
                        <Tooltip />
                        <Legend />
                        {renderTestLines()}
                    </LineChart>
                </ResponsiveContainer>
            </Paper>
        </Box>
    );
};

export default AllTestsLineChart;