import { useEffect, useState } from 'react'
import './chart.css'
import { Line } from 'react-chartjs-2'
import {
    Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement,
} from 'chart.js';
  
ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement);


const Chart = ({ticker}) => {

    const [chartData, setChartData] = useState(null);
    const [currentPrice, setCurrentPrice] = useState(null);
    const [change, setChange] = useState(null);
    const [timeframe, setTimeframe] = useState('1D');

    const timeframes = {
        '1D': { period: '1d', interval: '5m' },
        '1W': { period: '5d', interval: '1h' },
        '1M': { period: '1mo', interval: '1d' },
        '1Y': { period: '1y', interval: '1wk' },
    };

    useEffect(() => {
        const getChartData = async () => {
          try {
            const { period, interval } = timeframes[timeframe];
            const response = await fetch(`http://localhost:5000/api/chartData?ticker=${ticker}&period=${period}&interval=${interval}`);
            const data = await response.json();
      
            setChartData({
              labels: data.dates,
              datasets: [{
                label: `${ticker} Price`,
                data: data.prices,
                borderColor: '#0f3854',
                borderWidth: 5,
                pointRadius: 2,
                tension: 0.3,
              }],
            });
      
            setCurrentPrice(data.current);
            setChange(data.change);
          } catch (error) {
            console.error('Error getting chart data:', error);
          }
        };
      
        getChartData();
    }, [ticker, timeframe]);      
      
    return (
        <>
            <div id='chart-container'>
                <header id='chart-header'>
                    <h3>{ticker} ${currentPrice?.toFixed(2)} || {change > 0 ? '+' : ''}{change}% - [{timeframe}] Chart</h3>
                    <div id='timeframe-container'>
                        {Object.keys(timeframes).map(label => (
                            <button
                            key={label}
                            className={`timeframe-btn ${timeframe === label ? 'active' : ''}`}
                            onClick={() => setTimeframe(label)}
                            >
                            {label}
                            </button>
                        ))}
                    </div>
                </header>
                <div id='chart-wrap'>
                    <div id='chart'>
                        {chartData ? <Line
                                            data={chartData}
                                            options={{
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
                                            />
                                            : <p>Loading...</p>}
                    </div>
                </div>
            </div>
        </>
    )
}

export default Chart