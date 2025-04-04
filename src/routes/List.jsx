import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import sp500list from '../data/sp500list.json';
import "../routes/list.css";

const List = ({setTicker}) => {
    const [selectedSector, setSelectedSector] = useState("All");
    const [selectedCap, setSelectedCap] = useState("All");

    const sectors = ["All", ...Array.from(new Set(sp500list.map(stock => stock.sector))).sort()];
    const marketCaps = ["All", "Mega-cap", "Large-cap", "Mid-cap"];

    const navigate = useNavigate();

    const getMarketCapCategory = (cap) => {
        if (!cap) return "Unknown";
        if (cap >= 200_000_000_000) return "Mega-cap";
        if (cap >= 10_000_000_000) return "Large-cap";
        return "Mid-cap";
    };

    const filteredList = sp500list.filter(stock => {
        const matchesSector = selectedSector === "All" || stock.sector === selectedSector;
        const capCategory = getMarketCapCategory(stock.marketCap);
        const matchesCap = selectedCap === "All" || capCategory === selectedCap;
        return matchesSector && matchesCap;
    });

    return (
        <>
            <div id='list-container'>
                <header id="list-header">
                    <h3>S&P 500 List</h3>
                    <div id="filters">
                        <label>
                            Sector:
                            <select value={selectedSector} onChange={(e) => setSelectedSector(e.target.value)}>
                                {sectors.map((sector, i) => (
                                    <option key={i} value={sector}>{sector}</option>
                                ))}
                            </select>
                        </label>
                        <label>
                            Market Cap:
                            <select value={selectedCap} onChange={(e) => setSelectedCap(e.target.value)}>
                                {marketCaps.map((cap, i) => (
                                    <option key={i} value={cap}>{cap}</option>
                                ))}
                            </select>
                        </label>
                    </div>
                </header>
                <ul>
                    {filteredList.map((stock, index) => (
                        <li key={index} onClick={() => {
                                            setTicker(stock.ticker);
                                            navigate('/chart');
                                        }}>
                            <strong>${stock.ticker}</strong> {stock.name}
                        </li>                  
                    ))}
                </ul>
            </div>
        </>
    );
};

export default List;
