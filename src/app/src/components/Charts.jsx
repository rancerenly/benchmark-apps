import React, { useState } from 'react';
import {
    Box,
    Typography,
    Paper,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Grid
} from '@mui/material';
import {
    BarChart,
    LineChart,
    Bar,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    Cell
} from 'recharts';

const COLORS = ['#f637e3', '#61DBFB', '#34495E', '#aa1e1e'];

const ChartsComponent = ({ testResults, frameworks }) => {
    const [chartType, setChartType] = useState('bar');
    const [selectedTest, setSelectedTest] = useState(testResults[0]?.test || 'Create 1,000 Rows');

    const prepareChartData = () => {
        if (!selectedTest) return [];

        const testData = testResults.find(t => t.test === selectedTest);
        if (!testData) return [];

        return frameworks.map(framework => ({
            name: framework,
            value: testData.results[framework]?.averageTime || 0
        }));
    };

    const chartData = prepareChartData();

    const renderChart = () => {
        switch(chartType) {
            case 'bar':
                return (
                    <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis label={{ value: 'Time (ms)', angle: -90, position: 'insideLeft' }} />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="value" fill="#8884d8" name="Execution time">
                            {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Bar>
                    </BarChart>
                );
            case 'line':
                return (
                    <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis label={{ value: 'Time (ms)', angle: -90, position: 'insideLeft' }} />
                        <Tooltip />
                        <Legend />
                        <Line
                            type="monotone"
                            dataKey="value"
                            stroke="#8884d8"
                            name="Execution time"
                            activeDot={{ r: 8 }}
                        />
                    </LineChart>
                );
            default:
                return null;
        }
    };

    return (
        <Box mt={4}>
            <Typography variant="h5" gutterBottom>
                Сравнение производительности (график)
            </Typography>

            <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                        <InputLabel>Chart Type</InputLabel>
                        <Select
                            value={chartType}
                            label="Chart Type"
                            onChange={(e) => setChartType(e.target.value)}
                        >
                            <MenuItem value="bar">Bar Chart</MenuItem>
                            <MenuItem value="line">Line Chart</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                        <InputLabel>Select Test</InputLabel>
                        <Select
                            value={selectedTest}
                            label="Select Test"
                            onChange={(e) => setSelectedTest(e.target.value)}
                        >
                            {testResults.map(test => (
                                <MenuItem key={test.test} value={test.test}>{test.test}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
            </Grid>

            <Paper elevation={3} style={{ padding: '20px', height: '400px' }}>
                <ResponsiveContainer width="100%" height="100%">
                    {renderChart()}
                </ResponsiveContainer>
            </Paper>
        </Box>
    );
};

export default ChartsComponent;