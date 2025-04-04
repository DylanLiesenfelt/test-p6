import { useEffect, useState } from 'react';
import './compare.css'
import sp500 from '../data/sp500list.json';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Legend,
  Tooltip
} from 'chart.js';

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Legend, Tooltip);

const Compare = ({ticker}) => {
  const [ticker1, setTicker1] = useState(ticker || 'AAPL');
  const [ticker2, setTicker2] = useState('MSFT');
  const [chartData, setChartData] = useState(null)

  useEffect(() => {
    const getChartData = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/compare?ticker1=${ticker1}&ticker2=${ticker2}`);
        const data = await response.json();
        const labels = data.stock1.dates;
        const chart = {
          labels: labels,
          datasets: [
            {
              label: ticker1,
              data: data.stock1.returns,
              borderColor: '#0f3854',
              borderWidth: 5,
              pointRadius: 2,
              tension: 0.3
            },
            {
              label: ticker2,
              data: data.stock2.returns,
              borderColor: '#fa7d2f',
              borderWidth: 5,
              pointRadius: 2,
              tension: 0.3
            }
          ]
        };

        setChartData(chart);
      } catch (error) {
        console.error('Error getting data:', error);
      }
    };

    getChartData();
  }, [ticker1, ticker2]);

  return (
    <>
      <div id='compare-container'>
        <header id='compare-header'>
          <h3>Compare {ticker1} - {ticker2} 1 Year Performance</h3>
          <div className="dropdowns">
            <select value={ticker1} onChange={e => setTicker1(e.target.value)}>
              {sp500.map(stock => (
                <option key={stock.ticker} value={stock.ticker}>
                  {stock.ticker} - {stock.name}
                </option>
              ))}
            </select>

            <select value={ticker2} onChange={e => setTicker2(e.target.value)}>
              {sp500.map(stock => (
                <option key={stock.ticker} value={stock.ticker}>
                  {stock.ticker} - {stock.name}
                </option>
              ))}
            </select>
          </div>
        </header>
        <div id='chart-wrap'>
          <div id='chart'>
            {chartData ? <Line
                          data={chartData}options={{
                            scales: {
                            x: {
                                ticks: {
                                color: 'black',    
                                font: {
                                    size: 12,
                                    weight: 'bold',
                                }
                                }
                            },
                            y: {
                                ticks: {
                                color: 'black',     
                                font: {
                                    size: 12,
                                    weight: 'bold',
                                }
                                }
                            }
                            },
                            plugins: {
                            legend: {
                                labels: {
                                color: 'black', 
                                }
                            }
                            }
                        }}
            ></Line> : <p>Loading...</p>}
          </div>
        </div>
      </div>
    </>
  )

} 

export default Compare