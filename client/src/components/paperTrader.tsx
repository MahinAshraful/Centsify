import React, { useState, useEffect } from 'react';
import { DollarSign, HelpCircle, TrendingUp, TrendingDown, BarChart2 } from 'lucide-react';
import './PaperTrader.css';

const API_KEY = import.meta.env.VITE_ALPHA_VANTAGE_KEY;

interface Portfolio {
  [key: string]: number;
}

export default function PaperTrader() {
  const [ticker, setTicker] = useState('');
  const [shares, setShares] = useState(0);
  const [cash, setCash] = useState(10000);
  const [portfolio, setPortfolio] = useState<Portfolio>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showChart, setShowChart] = useState(false);


  const fetchStockPrice = async (symbol: string): Promise<number | null> => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${API_KEY}`);
      const data = await response.json();
      if (data['Global Quote']) {
        return parseFloat(data['Global Quote']['05. price']);
      } else {
        throw new Error('Unable to fetch stock price');
      }
    } catch (err) {
      setError('Error fetching stock price. Please try again.');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const buyStock = async () => {
    if (!ticker || shares <= 0) {
      setError('Please enter a valid ticker and number of shares.');
      return;
    }
    
    const price = await fetchStockPrice(ticker);
    if (price) {
      const totalCost = price * shares;
      if (totalCost > cash) {
        setError('Insufficient funds to complete this purchase.');
        return;
      }
      
      setCash(prevCash => prevCash - totalCost);
      setPortfolio(prevPortfolio => ({
        ...prevPortfolio,
        [ticker]: (prevPortfolio[ticker] || 0) + shares
      }));
      setError('');
    }
  };

  const sellStock = async () => {
    if (!ticker || shares <= 0) {
      setError('Please enter a valid ticker and number of shares.');
      return;
    }
    
    if (!portfolio[ticker] || portfolio[ticker] < shares) {
      setError('You do not own enough shares to complete this sale.');
      return;
    }
    
    const price = await fetchStockPrice(ticker);
    if (price) {
      const totalSale = price * shares;
      setCash(prevCash => prevCash + totalSale);
      setPortfolio(prevPortfolio => ({
        ...prevPortfolio,
        [ticker]: prevPortfolio[ticker] - shares
      }));
      setError('');
    }
  };

  useEffect(() => {
    // Add a paper texture to the background
    document.body.style.backgroundImage = "url('https://www.transparenttextures.com/patterns/paper-fibers.png')";
    return () => {
      document.body.style.backgroundImage = '';
    };
  }, []);

  return (
    <div className="paper-trader">
      <header className="header">
        <div className="logo">
          <DollarSign className="icon" />
          <h1 className="title">Centsify</h1>
        </div>
        <div className="user-info">
          <span>Hello, Trader</span>
        </div>
      </header>

      <main className="main-content">
        <h2 className="section-title">Paper Trader</h2>
        <div className="balance card">
          <label>Cash Balance:</label>
          <div className="balance-amount">${cash.toFixed(2)}</div>
        </div>
        <div className="trading-panel card">
          <div className="input-group">
            <label>Ticker:</label>
            <input
              type="text"
              value={ticker}
              onChange={(e) => setTicker(e.target.value.toUpperCase())}
              className="input"
              placeholder="Enter stock symbol"
            />
          </div>
          <div className="input-group">
            <label>Shares:</label>
            <div className="shares-input">
              <input
                type="number"
                value={shares}
                onChange={(e) => setShares(parseInt(e.target.value) || 0)}
                className="input"
                placeholder="0"
              />
              <div className="share-buttons">
                <button onClick={() => setShares(s => s + 1)} className="share-button">▲</button>
                <button onClick={() => setShares(s => Math.max(0, s - 1))} className="share-button">▼</button>
              </div>
            </div>
          </div>
          <div className="action-buttons">
            <button onClick={buyStock} className="action-button buy">
              <TrendingUp className="button-icon" /> Buy
            </button>
            <button onClick={sellStock} className="action-button sell">
              <TrendingDown className="button-icon" /> Sell
            </button>
          </div>
        </div>
        {error && <div className="error-message card">{error}</div>}
        <div className="portfolio card">
          <h3 className="portfolio-title">
            Portfolio
            <button className="chart-toggle" onClick={() => setShowChart(!showChart)}>
              <BarChart2 className="icon" />
            </button>
          </h3>
          {showChart ? (
            <div className="chart-placeholder">
              Portfolio performance chart closed
            </div>
          ) : (
            <ul className="portfolio-list">
              {Object.entries(portfolio).map(([stock, amount]) => (
                <li key={stock} className="portfolio-item">{stock}: {amount} shares</li>
              ))}
            </ul>
          )}
        </div>
      </main>

    </div>
  );
}