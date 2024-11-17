import { useState, useEffect } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { PieChartIcon, BarChart2Icon } from 'lucide-react'

// Registering chart.js elements
ChartJS.register(ArcElement, Tooltip, Legend);

const ViewLocationChart = ({ history }: any) => {
    const [activeCategory, setActiveCategory] = useState('country');
    const [selectedCountry, setSelectedCountry] = useState('');
    const [selectedState, setSelectedState] = useState('');
    const [selectedCity, setSelectedCity] = useState('');
    const [chartSelection, setChartSelection] = useState('pie');
    const [filteredData, setFilteredData] = useState<any[]>([]);
    const [statesList, setStatesList] = useState<string[]>([]);
    const [citiesList, setCitiesList] = useState<string[]>([]);

    const filterData = () => {
        let filtered = [...history];
        const statesForCountry: any = getUniqueValuesForCountry(selectedCountry);
        setStatesList(statesForCountry);
        const cityForCountry: any = getUniqueValuesForState();
        setCitiesList(cityForCountry);
        if (activeCategory === 'country' && selectedCountry) {
            filtered = filtered.filter((item: any) => item.country === selectedCountry);
        } else if (activeCategory === 'state' && selectedCountry !== '' && selectedState === '') {
            filtered = filtered.filter((item: any) => item.country === selectedCountry);
        } else if (activeCategory === 'state' && selectedState !== '' && selectedCountry === '') {
            filtered = filtered.filter((item: any) => item.state === selectedState);
        } else if (activeCategory === 'state' && selectedState !== '' && selectedCountry !== '') {
            filtered = filtered.filter((item: any) => item.state === selectedState && item.country === selectedCountry);
        } else if (activeCategory === 'city' && selectedCountry !== '' && selectedState !== '') {
            filtered = filtered.filter((item: any) => item.country === selectedCountry && item.state === selectedState);
        } else if (activeCategory === 'city' && selectedCountry !== '' && selectedState === '') {
            filtered = filtered.filter((item: any) => item.country === selectedCountry);
        } else if (activeCategory === 'city' && selectedCountry === '' && selectedState !== '') {
            filtered = filtered.filter((item: any) => item.state === selectedState);
        }

        // Set the filtered data
        setFilteredData(filtered);
    };

    // Get unique values for country, state, or city
    const getUniqueValues = (key: string) => {
        return [...new Set(history.map((item: any) => item[key]))];
    };


    const getUniqueValuesForState = () => {
        if (selectedCountry !== '' && selectedState !== '') {
            return [...new Set(history.filter((item: any) => item.country === selectedCountry && item.state == selectedState).map((item: any) => item.city))];
        } else if (selectedCountry === '' && selectedState !== '') {
            return [...new Set(history.filter((item: any) => item.state == selectedState).map((item: any) => item.city))];
        } else if (selectedCountry !== '' && selectedState === '') {
            return [...new Set(history.filter((item: any) => item.country == selectedCountry).map((item: any) => item.city))];
        } else {
            return [...new Set(history.map((item: any) => item.city))];
        }
    };


    const getUniqueValuesForCountry = (country: string) => {
        if (country !== '' && selectedCity !== '') {
            return [...new Set(history.filter((item: any) => item.country === country && item.state == selectedState).map((item: any) => item.state))];
        } else if (country === '' && selectedCity !== '') {
            return [...new Set(history.filter((item: any) => item.state == selectedState).map((item: any) => item.state))];
        } else if (country !== '' && selectedCity === '') {
            return [...new Set(history.filter((item: any) => item.country == selectedCountry).map((item: any) => item.state))];
        } else {
            return [...new Set(history.map((item: any) => item.state))];
        }
    };

    // Handle toggle between country, state, and city tabs
    const handleToggle = (category: string) => {
        setActiveCategory(category);
        setFilteredData(history); // Reset filtered data
    };

    // Handle country change
    const handleCountryChange = (country: string) => {
        setSelectedCountry(country);
        setSelectedState('');
        setSelectedCity('');
        const states: any = getUniqueValuesForCountry(country);
        setStatesList(states);
        setCitiesList([]); // Reset cities list
    };

    // Handle state change
    const handleStateChange = (state: string) => {
        setSelectedState(state);
        setSelectedCity('');
        const cities: any = getUniqueValuesForState();
        setCitiesList(cities);
    };
    const options: any = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom',
            },
        },
    }
    // Chart data based on filtered data
    const chartData = () => {
        const countData: any = filteredData.reduce((acc: any, item: any) => {
            const key =
                activeCategory === 'country'
                    ? item.country
                    : activeCategory === 'state'
                        ? item.state
                        : item.city;
            acc[key] = (acc[key] || 0) + 1;
            return acc;
        }, {});

        const labels = Object.keys(countData);
        const data = labels.map((label) => countData[label]);

        return {
            labels,
            datasets: [
                {
                    label: `Views by ${activeCategory}`,
                    data,
                    backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'],
                    borderColor: '#fff',
                    borderWidth: 1,
                },
            ],

        };
    };

    useEffect(() => {
        filterData();
    }, [activeCategory, selectedCountry, selectedState, selectedCity, history]);

    return (
        <div>

            <div className='d-flex justify-content-between mb-2'>
                <h5 className="card-title text-light">All time view counts</h5>
                <div className='d-flex'>
                    <div className='px-2 chart-option-icon-container'
                    onClick={()=>{setChartSelection('pie')}}>
                        <PieChartIcon size={20} className={`${chartSelection === 'pie' ? 'selected-chart' : 'text-light'}`} />
                    </div>
                    <div className='chart-option-icon-container' 
                     onClick={()=>{setChartSelection('bar')}}>
                        <BarChart2Icon size={20} className={`${chartSelection === 'bar' ? 'selected-chart' : 'text-light'}`} />
                    </div>
                </div>
            </div>
            <div className='d-flex justify-content-end'>
                {/* Toggle Buttons for Country | State | City */}
                <div className='btn-group'>
                    <button className={`btn btn-custom-group btn-sm px-3 ${activeCategory === 'country' ? 'btn-custom-group-selected' : ''}`} onClick={() => handleToggle('country')}>
                        Country
                    </button>
                    <button className={`btn btn-custom-group btn-sm px-3 ${activeCategory === 'state' ? 'btn-custom-group-selected' : ''}`} onClick={() => handleToggle('state')}>
                        State
                    </button>
                    <button className={`btn btn-custom-group btn-sm px-3 ${activeCategory === 'city' ? 'btn-custom-group-selected' : ''}`} onClick={() => handleToggle('city')}>
                        City
                    </button>
                </div>
            </div>

            <div className='d-flex justify-content-end mt-2'>

                {/* Dropdown for Country, State, or City based on active category */}
                {activeCategory === 'country' && (
                    <select className='form-select-sm' onChange={(e) => handleCountryChange(e.target.value)} value={selectedCountry}>
                        <option value="">All Countries</option>
                        {getUniqueValues('country')?.map((country: any) => (
                            <option key={country} value={country}>
                                {country}
                            </option>
                        ))}
                    </select>
                )}

                {activeCategory === 'state' && (
                    <select className='form-select-sm' onChange={(e) => handleStateChange(e.target.value)} value={selectedState}>
                        <option value="">All States</option>
                        {statesList.map((state: any) => (
                            <option key={state} value={state}>
                                {state}
                            </option>
                        ))}
                    </select>
                )}

                {activeCategory === 'city' && (
                    <select className='form-select-sm' onChange={(e) => setSelectedCity(e.target.value)} value={selectedCity}>
                        <option value="">All Cities</option>
                        {citiesList.map((city: any) => (
                            <option key={city} value={city}>
                                {city}
                            </option>
                        ))}
                    </select>
                )}
            </div>

            {/* Pie Chart */}
            {
                chartSelection === 'pie' ?
                    <div style={{ width: '100%', height: '250px', marginTop: '20px' }}>
                        <Pie data={chartData()} options={options} />
                    </div> : ""
            }
            {
                chartSelection === 'bar' ?
                    <div style={{ width: '100%', height: '250px', marginTop: '20px' }}>
                        <Bar data={chartData()} options={options} />
                    </div> : ""
            }

        </div>
    );
};

export default ViewLocationChart;
