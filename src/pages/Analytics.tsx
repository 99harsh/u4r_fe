
import { useSpring, animated } from 'react-spring';
import { BarChart2, TrendingUp, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { differenceInDays, subDays, isAfter } from "date-fns";
import ViewCountChart from '../components/ViewCountChart';
import ViewLocationChart from '../components/ViewLocationChart';
import ShimmerAnalyticsCard from '../components/ShimmerAnalyticsCard';
import ShimmerAnalyticsGraph from '../components/ShimmerAnalyticsGraph';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
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


const Analytics = () => {
  ChartJS.defaults.backgroundColor = '#000';
  ChartJS.defaults.color = '#fff';
  ChartJS.defaults.borderColor = "#6c757d"

  const fadeIn = useSpring({
    from: { opacity: 0 },
    to: { opacity: 1 },
    config: { duration: 500 }
  });

  const navigator = useNavigate();

  const [searchParams, setSearchParam] = useSearchParams();
  const [analytics, setAnalytics] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalClicks, setTotalClicks] = useState(0);
  const [dailyAverage, setDailyAverage] = useState(0);
  const [last7DaysClicks, setLast7DaysClicks] = useState(0);

  const calculateStats = (data: any) => {
    const history = data;
    // Total clicks
    const total = history.length;
    setTotalClicks(total);

    // Daily average clicks
    const sortedHistory = history.sort((a: any, b: any) =>
      new Date(a.click_ts).getTime() - new Date(b.click_ts).getTime()
    );
    const firstDate = new Date(sortedHistory[0].click_ts);
    const lastDate = new Date(sortedHistory[sortedHistory.length - 1].click_ts);
    const totalDays = Math.max(differenceInDays(lastDate, firstDate), 1);
    setDailyAverage(Number((total / totalDays).toFixed(2)));

    // Last 7 days click count
    const sevenDaysAgo = subDays(new Date(), 7);
    const recentClicks = history.filter((h: { click_ts: string }) =>
      isAfter(new Date(h.click_ts), sevenDaysAgo)
    );
    setLast7DaysClicks(recentClicks.length);

    // Group data for countries


  };

  const loadAnalytics = async (id: any) => {
    try {
      setIsLoading(true)
      const { data } = await axios.get(`https://u4r.in/v1/user/url/${id}`, {
        headers: {
          access_token: localStorage.getItem('token')
        }
      })
      if (data.status === 200) {
        calculateStats(data.data.history)
        setAnalytics(data.data.history);
      }

      console.log("Data From Analytics", data);
    } catch (error) {

    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    const id = searchParams.get("id");
    if (id) {
      loadAnalytics(id)
    } else {
      navigator("/dashboard")
    }
  }, [])



  return (
    <animated.div style={fadeIn} className="container py-4">

      {
        isLoading ?
          <div>
            <div className='row g-4 mb-4'>
              <div className='col-md-4'>
                <ShimmerAnalyticsCard />
              </div>
              <div className='col-md-4'>
                <ShimmerAnalyticsCard />
              </div>
              <div className='col-md-4'>
                <ShimmerAnalyticsCard />
              </div>
            </div>
            <div className='row g-4'>
              <div className='col-md-6'>
                <ShimmerAnalyticsGraph />
              </div>
              <div className='col-md-6'>
                <ShimmerAnalyticsGraph />
              </div>
            </div>
          </div> :
          <>
            <div className="row g-4 mb-4">
              <div className="col-md-4">
                <div className="card h-100">
                  <div className="card-body">
                    <div className="d-flex align-items-center mb-3">
                      <BarChart2 size={24} className="text-primary me-2" />
                      <h5 className="card-title mb-0 text-light">Total Clicks</h5>
                    </div>
                    <h3 className="mb-0 text-light">{totalClicks}</h3>
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
                    <h3 className="mb-0 text-light">{dailyAverage}</h3>
                    <small className="text-secondary">Clicks per day</small>
                  </div>
                </div>
              </div>

              <div className="col-md-4">
                <div className="card h-100">
                  <div className="card-body">
                    <div className="d-flex align-items-center mb-3">
                      <Users size={24} className="text-info me-2" />
                      <h5 className="card-title mb-0 text-light">Last 7 Days</h5>
                    </div>
                    <h3 className="mb-0 text-light">{last7DaysClicks}</h3>
                    <small className="text-secondary">Last 7 days clicks</small>
                  </div>
                </div>
              </div>
            </div>

            <div className="row g-4">
              {/* <div className="col-md-6">
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
        */}
              <div className="col-md-6">
                <div className="card h-100">
                  <div className="card-body">
                    <h5 className="card-title text-light">All time view counts</h5>
                    <div className="w-full h-[400px]">
                      {
                        analytics.length ?
                          <ViewCountChart history={analytics} /> : ""
                      }
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="card h-100">
                  <div className="card-body">

                    <div className="w-full h-[400px]">
                      {
                        analytics.length ?
                          <ViewLocationChart history={analytics} /> : ""
                      }
                    </div>
                  </div>
                </div>
              </div>
            </div></>
      }
    </animated.div>
  );
};

export default Analytics;