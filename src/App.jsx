import { Routes, Route, useNavigate } from 'react-router-dom'
import List from './routes/List'
import Chart from './routes/Chart';
import Fundamentals from './routes/Compare';
import News from './routes/News';
import './App.css'
import { useState } from 'react';
import Compare from './routes/Compare';

function App() {

  const [ticker, setTicker] = useState('AAPL')
  const [searchInput, setSearchInput] = useState('');

  const navigate = useNavigate();

  
  return (
    <>
      <header>
        <nav>
          <img src="icon.png" alt="Site logo" />
          <h1>Stonks</h1>
        </nav>
        <div id='search-bar'>
          <input
            type="text"
            placeholder="AAPL"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
          <button
            type="submit"
            onClick={() => {
              const symbol = searchInput.trim().toUpperCase();
              if (symbol) {
                setTicker(symbol);
                navigate('/chart');
              }
            }}
          >
            Search
          </button>

        </div>
      </header>
      <main>
        <ul id='sidebar'>
          <li>
            <button className='sidebar-btn' onClick={() => navigate('/')}>S&P500 List</button>
          </li>
          <li>
            <button className='sidebar-btn' onClick={() => navigate('/chart')}>Chart</button>
          </li>
          <li>
            <button className='sidebar-btn' onClick={() => navigate('/compare')}>Compare</button>
          </li>
          <li>
            <button className='sidebar-btn' onClick={() => navigate('/news')}>News</button>
          </li>
        </ul>
        <div id='content-cont'>
          <div id='content'>
            <Routes>
              <Route path='/' element={<List setTicker={setTicker} />} />
              <Route path='/chart' element={<Chart ticker={ticker}/>} />
              <Route path='/compare' element={<Compare ticker={ticker}/>} /> 
              <Route path='/news' element={<News ticker={ticker}/>} /> 
            </Routes>
          </div>
        </div>
      </main>
    </>
  )
}

export default App
