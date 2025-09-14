import React, { useState, useEffect } from 'react';
import Navbar from '../Navbar';
import Footer from '../Footer';
import 'bootstrap/dist/css/bootstrap.min.css';
import './ReportPage.css';
import { authFetch } from '../services/authService.js';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    LineElement,
    PointElement,
} from 'chart.js';
import { Bar, Pie, Line } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    LineElement,
    PointElement
);

// ReportPage component to display dynamic form statistics based on new report endpoint
const ReportPage = () => {
    const [forms, setForms] = useState([]);
    const [selectedFormId, setSelectedFormId] = useState(null);
    const [report, setReport] = useState(null);
    const [selectedFieldId, setSelectedFieldId] = useState(null);
    const [selectedChart, setSelectedChart] = useState('pieChart');

    const chartOptions = ['pieChart', 'barChart', 'lineChart'];

    // Load all forms at mount
    useEffect(() => {
        authFetch('https://webproject404-backend.darkube.app/api/forms/report')
            .then(res => {
                if (!res.ok) throw new Error('Failed to fetch forms');
                return res.json();
            })
            .then(data => {
                setForms(data);
                if (data.length > 0) setSelectedFormId(data[0].id);
            })
            .catch(() => setForms([]));
    }, []);


    // Load report (fields+stats) when selectedFormId changes
    useEffect(() => {
        if (!selectedFormId) {
            setReport(null);
            setSelectedFieldId(null);
            return;
        }

        authFetch(`https://webproject404-backend.darkube.app/api/forms/${selectedFormId}/report`)
            .then(res => {
                if (!res.ok) throw new Error('Failed to fetch report');
                return res.json();
            })
            .then(data => {
                setReport(data);
                if (data.fields && data.fields.length > 0) setSelectedFieldId(data.fields[0].id);
                else setSelectedFieldId(null);
            })
            .catch(() => {
                setReport(null);
                setSelectedFieldId(null);
            });
    }, [selectedFormId]);


    // Find selected field object from report
    const selectedField = report?.fields?.find(f => f.id === selectedFieldId);

    // Generate colors for charts
    const generateColors = (count) => {
        const colors = [
            '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
            '#FF9F40', '#FF6384', '#C9CBCF', '#4BC0C0', '#FF6384'
        ];
        return colors.slice(0, count);
    };

    // Prepare chart data based on field type and stats
    const prepareChartData = () => {
        if (!selectedField || !selectedField.stats) return null;

        const stats = selectedField.stats;
        const labels = Object.keys(stats);
        const data = Object.values(stats);
        const colors = generateColors(labels.length);

        // For text fields, show top responses only
        if (selectedField.type === 'short-text' || selectedField.type === 'long-text') {
            // Sort by count and take top 10
            const sortedEntries = Object.entries(stats)
                .sort(([,a], [,b]) => b - a)
                .slice(0, 10);

            return {
                labels: sortedEntries.map(([label]) => label.length > 30 ? label.substring(0, 30) + '...' : label),
                datasets: [{
                    label: 'Responses',
                    data: sortedEntries.map(([,count]) => count),
                    backgroundColor: colors,
                    borderColor: colors.map(color => color.replace('0.2', '1')),
                    borderWidth: 1
                }]
            };
        }

        // For multiple choice, yes-no, and number fields
        return {
            labels: labels,
            datasets: [{
                label: 'Responses',
                data: data,
                backgroundColor: colors,
                borderColor: colors.map(color => color.replace('0.2', '1')),
                borderWidth: 1
            }]
        };
    };

    // Chart options
    const chartOptionsConfig = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: selectedField ? `${selectedField.label} - Response Distribution` : 'Chart'
            }
        },
        scales: selectedChart !== 'pieChart' ? {
            y: {
                beginAtZero: true,
                ticks: {
                    stepSize: 1
                }
            }
        } : {}
    };

    // Check if field type is suitable for charts
    const isChartableField = (field) => {
        return field && field.type !== 'long-text' && Object.keys(field.stats || {}).length > 0;
    };

    // Render the appropriate chart based on selection
    const renderChart = () => {
        if (!selectedField) {
            return <div className="mt-3 text-center text-muted">No question selected.</div>;
        }

        const stats = selectedField.stats || {};
        const noAnswers = Object.keys(stats).length === 0;

        if (noAnswers) {
            return (
                <div className="mt-3 text-center text-muted">
                    <p>No answers yet for this question.</p>
                </div>
            );
        }

        // Show statistics list
        const statsDisplay = (
            <div className="mb-4">
                <h5>Statistics Summary</h5>
                <div className="row">
                    <div className="col-md-6">
                        <ul className="list-group">
                            {Object.entries(stats).slice(0, Math.ceil(Object.keys(stats).length / 2)).map(([answer, count]) => (
                                <li key={answer} className="list-group-item d-flex justify-content-between align-items-center">
                                    <span>{answer.length > 50 ? answer.substring(0, 50) + '...' : answer}</span>
                                    <span className="badge bg-primary rounded-pill">{count}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="col-md-6">
                        <ul className="list-group">
                            {Object.entries(stats).slice(Math.ceil(Object.keys(stats).length / 2)).map(([answer, count]) => (
                                <li key={answer} className="list-group-item d-flex justify-content-between align-items-center">
                                    <span>{answer.length > 50 ? answer.substring(0, 50) + '...' : answer}</span>
                                    <span className="badge bg-primary rounded-pill">{count}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        );

        // Don't show charts for fields with too many unique text responses
        if (!isChartableField(selectedField)) {
            return (
                <div className="mt-3">
                    {statsDisplay}
                    <div className="alert alert-info">
                        <p>Charts are not available for this field type or there are too many unique responses.</p>
                    </div>
                </div>
            );
        }

        const chartData = prepareChartData();

        if (!chartData) {
            return (
                <div className="mt-3">
                    {statsDisplay}
                    <div className="alert alert-warning">Unable to generate chart data.</div>
                </div>
            );
        }

        return (
            <div className="mt-3">
                {statsDisplay}
                <div className="chart-container" style={{ height: '400px', marginTop: '20px' }}>
                    {selectedChart === 'pieChart' && (
                        <Pie data={chartData} options={chartOptionsConfig} />
                    )}
                    {selectedChart === 'barChart' && (
                        <Bar data={chartData} options={chartOptionsConfig} />
                    )}
                    {selectedChart === 'lineChart' && (
                        <Line data={chartData} options={chartOptionsConfig} />
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className="min-vh-100 d-flex flex-column">
            {/* Navbar/Header */}
            <Navbar />
            {/* Page content */}
            <div className="survey-report d-flex flex-grow-1">
                {/* Sidebar: List of forms */}
                <div className="report-sidebar p-3">
                    <h3>Forms</h3>
                    <ul className="list-group">
                        {forms.length === 0 && (
                            <li className="list-group-item text-danger">No Forms</li>
                        )}
                        {forms.map(form => (
                            <li
                                key={form.id}
                                className={`list-group-item ${selectedFormId === form.id ? 'active' : ''}`}
                                onClick={() => setSelectedFormId(form.id)}
                                style={{ cursor: 'pointer' }}
                            >
                                {form.title || form.name}
                            </li>
                        ))}
                    </ul>
                    {report && (
                        <div className="mt-3">
                            <b>Total submissions:</b> {report.submissionCount}
                        </div>
                    )}
                </div>

                {/* Main content area */}
                <div className="content p-3 flex-grow-1">
                    <h3>
                        {report ? `${report.formTitle} Report` : 'Select a form'}
                    </h3>

                    {/* Question selection */}
                    <div className="mb-4">
                        <h4>Select Question</h4>
                        {!report?.fields?.length && <div className="text-danger">No Questions</div>}
                        <ul className="list-group">
                            {report?.fields?.map(field => (
                                <li
                                    key={field.id}
                                    className={`list-group-item ${selectedFieldId === field.id ? 'active' : ''}`}
                                    onClick={() => setSelectedFieldId(field.id)}
                                    style={{ cursor: 'pointer' }}
                                >
                                    {field.label} <span style={{ color: '#888' }}>({field.type})</span>
                                    {field.stats && Object.keys(field.stats).length > 0 && (
                                        <span className="badge bg-success ms-2">
                                            {Object.values(field.stats).reduce((a, b) => a + b, 0)} responses
                                        </span>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Chart type selection */}
                    <div className="mb-4">
                        <h4>Select Chart Type</h4>
                        <div className="btn-group" role="group">
                            {chartOptions.map((chart) => (
                                <button
                                    key={chart}
                                    className={`btn btn-outline-primary ${selectedChart === chart ? 'active' : ''}`}
                                    onClick={() => setSelectedChart(chart)}
                                    disabled={!isChartableField(selectedField)}
                                >
                                    {chart === 'pieChart' ? 'Pie Chart' : chart === 'barChart' ? 'Bar Chart' : 'Line Chart'}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Statistics and chart display */}
                    <div className="mt-4">
                        <h4>
                            {selectedField ? selectedField.label : "Select a question"}
                        </h4>
                        {renderChart()}
                    </div>
                </div>
            </div>
            {/*Footer*/}
            <Footer/>
        </div>
    );
};

export default ReportPage;
