import React, { useEffect, useState, useMemo } from 'react';
import { Container, Paper, Typography, Box } from '@mui/material';
import BenchmarkResultsTable from "./components/BenchmarkResultsTable.jsx";
import LighthouseMetricsTable from "./components/LighthouseMetricsTable.jsx";
import ChartsComponent from "./components/Charts.jsx";
import AllTestsLineChart from "./components/AllTestsLineChart.jsx";
import AllTestsBarChart from "./components/AllTestsBarChart.jsx";

const BenchmarkPage = () => {
    const [data, setData] = useState([]);
    const [lighthouseData, setLighthouseData] = useState({});
    const [sortConfig, setSortConfig] = useState({
        testName: null,
        direction: 'asc'
    });
    const [testResults, setTestResults] = useState([]);
    const [myBenchmarks, setMyBenchmarks] = useState([]);
    const frameworks = ['Angular', 'React', 'Vue', 'Svelte'];

    useEffect(() => {
        const loadData = async () => {
            try {
                const benchmarkResponse = await fetch('./benchmark_results.json');
                const benchmarkResult = await benchmarkResponse.json();

                const lighthouseResponse = await fetch('./lighthouse_results.json');
                const lighthouseResult = await lighthouseResponse.json();

                setData(benchmarkResult);
                setLighthouseData(lighthouseResult);

                setMyBenchmarks(benchmarkResult);

                const testsMap = {};

                benchmarkResult.forEach(item => {
                    if (!item.test || !item.framework || item.averageTime === undefined) return;

                    if (!testsMap[item.test]) {
                        testsMap[item.test] = {
                            test: item.test,
                            results: {}
                        };
                    }
                    testsMap[item.test].results[item.framework] = {
                        averageTime: item.averageTime,
                        iterations: item.iterations
                    };
                });

                setTestResults(Object.values(testsMap));
            } catch (error) {
                console.error('Error loading data:', error);
            }
        };
        loadData();
    }, []);

    const handleSort = (testName) => {
        let direction = 'asc';
        if (sortConfig.testName === testName && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ testName, direction });
    };

    const sortedFrameworks = useMemo(() => {
        if (!sortConfig.testName) return frameworks;

        // Находим нужный тест
        const testData = testResults.find(t => t.test === sortConfig.testName);
        if (!testData) return frameworks;

        // Создаем массив для сортировки с данными фреймворков
        const frameworksWithData = frameworks.map(framework => ({
            name: framework,
            value: testData.results[framework]?.averageTime || 0
        }));

        // Сортируем по значению
        const sorted = frameworksWithData.sort((a, b) => {
            if (sortConfig.direction === 'asc') {
                return a.value - b.value;
            } else {
                return b.value - a.value;
            }
        });

        return sorted.map(item => item.name);
    }, [frameworks, testResults, sortConfig]);

    return (
        <Container component={Paper} style={{ padding: '20px', marginTop: '20px', marginBottom: '20px' }}>
            <Typography variant="h4" gutterBottom>Результаты бенчмарков</Typography>

            <BenchmarkResultsTable
                testResults={testResults}
                frameworks={sortedFrameworks}
                handleSort={handleSort}
                sortConfig={sortConfig}
            />

            <LighthouseMetricsTable
                lighthouseData={lighthouseData}
                frameworks={frameworks}
            />

            <AllTestsBarChart
                testResults={testResults}
                frameworks={frameworks}
            />

            <AllTestsLineChart
                testResults={testResults}
                frameworks={frameworks}
            />

            <ChartsComponent
                testResults={testResults}
                frameworks={frameworks}
            />

        </Container>
    );
};

export default BenchmarkPage;