
import { useSpring, animated } from 'react-spring';
import { BarChart2, TrendingUp, Users, Globe } from 'lucide-react';
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

const data = {
  labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
  datasets: [
    {
      label: 'Monthly Sales',
      data: [65, 59, 80, 81, 56, 55, 40],
      fill: false,
      borderColor: 'rgb(75, 192, 192)',
      tension: 0.1
    }
  ]
}




const options: ChartOptions<'line'> = {
  responsive: true,
  plugins: {
    legend: {
      position: 'bottom' as const,
      
    },
    title: {
      display: true,
      text: 'Monthly Sales Data',
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      title: {
        display: true,
        text: 'Sales ($)',
      },
    },
    x: {
      title: {
        display: true,
        text: 'Month',
      },
    },
  },
}


const Analytics = () => {
  ChartJS.defaults.backgroundColor = '#000';
  ChartJS.defaults.color = '#fff';
  ChartJS.defaults.borderColor = "#6c757d"

  const fadeIn = useSpring({
    from: { opacity: 0 },
    to: { opacity: 1 },
    config: { duration: 500 }
  });

  // Mock data for demonstration
  const stats = {
    totalClicks: 245,
    dailyAverage: 35,
    uniqueVisitors: 189,
    topCountries: [
      { country: 'United States', visits: 98 },
      { country: 'United Kingdom', visits: 45 },
      { country: 'Germany', visits: 32 },
    ],
    dailyStats: [
      { date: '2024-03-10', visits: 28 },
      { date: '2024-03-11', visits: 35 },
      { date: '2024-03-12', visits: 42 },
      { date: '2024-03-13', visits: 38 },
      { date: '2024-03-14', visits: 45 },
    ],
    referrers: [
      { source: 'Direct', visits: 120 },
      { source: 'Twitter', visits: 85 },
      { source: 'LinkedIn', visits: 40 },
    ],
  };



  return (
    <animated.div style={fadeIn} className="container py-4">

      <div className="row g-4 mb-4">
        <div className="col-md-4">
          <div className="card h-100">
            <div className="card-body">
              <div className="d-flex align-items-center mb-3">
                <BarChart2 size={24} className="text-primary me-2" />
                <h5 className="card-title mb-0 text-light">Total Clicks</h5>
              </div>
              <h3 className="mb-0 text-light">{stats.totalClicks}</h3>
              <small className="text-secondary">All time clicks</small>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card h-100">
            <div className="card-body">
              <div className="d-flex align-items-center mb-3">
                <TrendingUp size={24} className="text-success me-2" />
                <h5 className="card-title mb-0 text-light">Daily Average</h5>
              </div>
              <h3 className="mb-0 text-light">{stats.dailyAverage}</h3>
              <small className="text-secondary">Clicks per day</small>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card h-100">
            <div className="card-body">
              <div className="d-flex align-items-center mb-3">
                <Users size={24} className="text-info me-2" />
                <h5 className="card-title mb-0 text-light">Unique Visitors</h5>
              </div>
              <h3 className="mb-0 text-light">{stats.uniqueVisitors}</h3>
              <small className="text-secondary">Distinct users</small>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-md-6">
          <div className="card h-100">
            <div className="card-body">
              <div className="d-flex align-items-center mb-3">
                <Globe size={24} className="text-primary me-2" />
                <h5 className="card-title mb-0 text-light">Top Countries</h5>
              </div>
              <div className="list-group list-group-flush">
                {stats.topCountries.map((country, index) => (
                  <div key={index} className="list-group-item bg-transparent d-flex justify-content-between align-items-center">
                    <span className='text-light'>{country.country}</span>
                    <span className="badge bg-primary">{country.visits}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card h-100">
            <div className="card-body">
              <h5 className="card-title mb-3 text-light">Top Referrers</h5>
              <div className="list-group list-group-flush">
                {stats.referrers.map((referrer, index) => (
                  <div key={index} className="list-group-item bg-transparent d-flex justify-content-between align-items-center">
                    <span className='text-light'>{referrer.source}</span>
                    <span className="badge bg-primary">{referrer.visits}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card h-100">
            <div className="card-body">
              <h5 className="card-title mb-3 text-light">Top Referrers</h5>
              <div className="w-full h-[400px]">
            <Line data={data} options={options} />
          </div>
            </div>
          </div>
        </div>
      </div>
    </animated.div>
  );
};

export default Analytics;