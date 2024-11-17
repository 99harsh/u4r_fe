import { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto'; // Auto imports required chart.js modules
import { ChartOptions } from 'chart.js/auto';

const ViewCountChart = ({ history }: any) => {
    const [filter, setFilter] = useState('last7days');
    const [filteredData, setFilteredData] = useState([]);
    const [customRange, setCustomRange] = useState({ from: '', to: '' });

    // Function to filter data based on selected filter option
    const options: ChartOptions<'line'> = {
        responsive: true,
        plugins: {
            legend: {
                position: 'bottom' as const,
                display: false
            },
            title: {
                display: false,
                text: 'Monthly Sales Data',
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: false,
                    text: 'Sales ($)',
                },
            },
            x: {
                title: {
                    display: false,
                    text: 'Month',
                },
            },
        },
    }
    const filterData = () => {
        const today = new Date();
        let startDate = new Date();

        switch (filter) {
            case 'last7days':
                startDate.setDate(today.getDate() - 7);
                break;
            case 'lastmonth':
                startDate.setMonth(today.getMonth() - 1);
                break;
            case 'thisyear':
                startDate = new Date(today.getFullYear(), 0, 1);
                break;
            case 'custom':
                startDate = new Date(customRange.from);
                today.setTime(new Date(customRange.to).getTime());
                break;
            default:
                break;
        }

        // Filter history within the specified date range
        const filtered = history.filter((item: any) => {
            const clickDate = new Date(item.click_ts);
            return clickDate >= startDate && clickDate <= today;
        });

        setFilteredData(filtered);
    };

    // Handle filter changes
    useEffect(() => {
        filterData();
        console.log(history)
    }, [filter, customRange, history]);

    // Prepare data for the Line chart
    const chartData = () => {
        const dailyCounts: any = filteredData.reduce((acc: any, item: any) => {
            const date = item.click_ts.split('T')[0]; // Extract YYYY-MM-DD
            acc[date] = (acc[date] || 0) + 1;
            return acc;
        }, {});

        const labels = Object.keys(dailyCounts).sort(); // Sort dates chronologically
        const data = labels.map((date) => dailyCounts[date]);

        return {
            labels,
            datasets: [
                {
                    label: '',
                    data,
                    fill: true,
                    backgroundColor: 'rgba(75,192,192,0.2)',
                    borderColor: 'rgba(75,192,192,1)',
                    tension: 0.4, // Smooth curve
                },
            ],
        };
    };

    return (
        <div>
            {/* Filter Options */}
            <div className='row'>
                <div className='d-flex justify-content-end'>
                <select className='form-select-sm' value={filter} onChange={(e) => setFilter(e.target.value)}>
                    <option value="last7days">Last 7 Days</option>
                    <option value="lastmonth">Last Month</option>
                    <option value="thisyear">This Year</option>
                    <option value="custom">Custom Date Range</option>
                </select>
                </div>

                {filter === 'custom' && (
                    <div className='d-flex justify-content-end pt-2'>
                        <label className='text-light'>
                            From: <input className='form-control-sm' type="date" onChange={(e) => setCustomRange({ ...customRange, from: e.target.value })} />
                        </label>
                        <label className='text-light'>
                            &nbsp; To: <input className='form-control-sm' type="date" onChange={(e) => setCustomRange({ ...customRange, to: e.target.value })} />
                        </label>
                    </div>
                )}
            </div>

            {/* Line Chart */}
            <Line data={chartData()} options={options} />
        </div>
    );
};

export default ViewCountChart;
