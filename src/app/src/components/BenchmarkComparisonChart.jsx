import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Paper,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    ToggleButton,
    ToggleButtonGroup
} from '@mui/material';
import {
    BarChart,
    Bar,
    LineChart,
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

const TEST_MAPPING = [
    { myTest: "Create 1,000 Rows", externalTest: "Create 1,000 Rows", displayName: "Create 1,000 Rows" },
    { myTest: "Update all rows", externalTest: "Update all rows", displayName: "Update All Rows" },
    { myTest: "Update every 10th Row", externalTest: "Update every 10th Row", displayName: "Update Every 10th Row" },
    { myTest: "Select row", externalTest: "Select row", displayName: "Select Row" },
    { myTest: "Swap Rows", externalTest: "Swap Rows", displayName: "Swap Rows" },
    { myTest: "Delete Row", externalTest: "Delete Row", displayName: "Delete Row" },
    { myTest: "Create 10,000 Rows", externalTest: "Create 10,000 Rows", displayName: "Create 10,000 Rows" },
    { myTest: "Append 1,000 Rows", externalTest: "Append 1,000 Rows", displayName: "Append 1,000 Rows" },
    { myTest: "Clear Rows", externalTest: "Clear Rows", displayName: "Clear Rows" }
];

const BenchmarkComparisonChart = ({ testResults }) => {
    const [externalData, setExternalData] = useState([]);
    const [selectedTest, setSelectedTest] = useState(null);
    const [chartType, setChartType] = useState('bar');
    const [availableTests, setAvailableTests] = useState([]);

    useEffect(() => {
        const loadExternalData = async () => {
            try {
                const response = await fetch('./external_benchmark.json');
                const data = await response.json();
                setExternalData(data);

                const commonTests = TEST_MAPPING.filter(mapping => {
                    const hasMyData = testResults.some(test => test.test === mapping.myTest);
                    const hasExternalData = data.some(test => test.test === mapping.externalTest);
                    return hasMyData && hasExternalData;
                });

                setAvailableTests(commonTests);
                if (commonTests.length > 0) {
                    setSelectedTest(commonTests[0]);
                }
            } catch (error) {
                console.error('Error loading external benchmark data:', error);
            }
        };

        loadExternalData();
    }, [testResults]);

    const prepareChartData = () => {
        if (!selectedTest) return [];

        const myResults = testResults
            .filter(test => test.test === selectedTest.myTest)
            .reduce((acc, test) => {
                acc[test.framework] = parseFloat(test.averageTime);
                return acc;
            }, {});

        const externalResults = externalData
            .filter(test => test.test === selectedTest.externalTest)
            .reduce((acc, test) => {
                acc[test.framework] = parseFloat(test.averageTime);
                return acc;
            }, {});

        return ['Angular', 'React', 'Vue', 'Svelte'].map(framework => ({
            name: framework,
            'My Benchmark': myResults[framework] || 0,
            'External Benchmark': externalResults[framework] || 0
        }));
    };

    const chartData = prepareChartData();

    const renderChart = () => {
        if (!selectedTest || chartData.length === 0) {
            return (
                <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                    <Typography>
                        {availableTests.length === 0 ?
                            "No matching test data found" :
                            "Select a test to compare"}
                    </Typography>
                </Box>
            );
        }

        const commonProps = {
            data: chartData,
            margin: { top: 20, right: 30, left: 20, bottom: 5 }
        };

        return chartType === 'bar' ? (
            <BarChart {...commonProps}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis label={{ value: 'Time (ms)', angle: -90, position: 'insideLeft' }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="My Benchmark" fill="#8884d8" name="My Benchmark">
                    {chartData.map((entry, index) => (
                        <Cell key={`cell-My-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Bar>
                <Bar dataKey="External Benchmark" fill="#82ca9d" name="External Benchmark">
                    {chartData.map((entry, index) => (
                        <Cell key={`cell-ext-${index}`} fill={COLORS[index % COLORS.length]} opacity={0.6} />
                    ))}
                </Bar>
            </BarChart>
        ) : (
            <LineChart {...commonProps}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis label={{ value: 'Time (ms)', angle: -90, position: 'insideLeft' }} />
                <Tooltip />
                <Legend />
                <Line
                    type="monotone"
                    dataKey="My Benchmark"
                    stroke="#8884d8"
                    strokeWidth={2}
                    activeDot={{ r: 8 }}
                    name="My Benchmark"
                />
                <Line
                    type="monotone"
                    dataKey="External Benchmark"
                    stroke="#82ca9d"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    activeDot={{ r: 8 }}
                    name="External Benchmark"
                />
            </LineChart>
        );
    };

    return (
        <Box mt={4}>
            <Typography variant="h5" gutterBottom>
                Сравнение результатов бенчмарков
            </Typography>

            <Box display="flex" justifyContent="space-between" mb={2}>
                <FormControl style={{ minWidth: 250, marginRight: '16px' }}>
                    <InputLabel>Select Test</InputLabel>
                    <Select
                        value={selectedTest?.myTest || ''}
                        onChange={(e) => {
                            const test = availableTests.find(t => t.myTest === e.target.value);
                            setSelectedTest(test);
                        }}
                        label="Select Test"
                    >
                        {availableTests.map(test => (
                            <MenuItem key={test.myTest} value={test.myTest}>
                                {test.displayName}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <ToggleButtonGroup
                    value={chartType}
                    exclusive
                    onChange={(e, newType) => setChartType(newType)}
                    aria-label="chart type"
                >
                    <ToggleButton value="bar" aria-label="bar chart">
                        Bar Chart
                    </ToggleButton>
                    <ToggleButton value="line" aria-label="line chart">
                        Line Chart
                    </ToggleButton>
                </ToggleButtonGroup>
            </Box>

            <Paper elevation={3} style={{ padding: '20px', height: '400px' }}>
                <ResponsiveContainer width="100%" height="100%">
                    {renderChart()}
                </ResponsiveContainer>
            </Paper>
        </Box>
    );
};

export default BenchmarkComparisonChart;