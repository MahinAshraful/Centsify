import { useState } from 'react';
import { Alert, AlertDescription } from './ui/alert';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';

const API_KEY = import.meta.env.VITE_ALPHA_VANTAGE_KEY;

interface Portfolio {
  [key: string]: number;
}

export default function PaperTrader() {
  const [ticker, setTicker] = useState<string>('');
  const [shares, setShares] = useState<number>(0);
  const [cash, setCash] = useState<number>(10000);
  const [portfolio, setPortfolio] = useState<Portfolio>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

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

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Paper Trader</h1>
      <div className="mb-4">
        <Label>Cash: ${cash.toFixed(2)}</Label>
      </div>
      <div className="mb-4">
        <Label htmlFor="ticker">Ticker:</Label>
        <Input
          id="ticker"
          type="text"
          value={ticker}
          onChange={(e) => setTicker(e.target.value.toUpperCase())}
        />
      </div>
      <div className="mb-4">
        <Label htmlFor="shares">Shares:</Label>
        <Input
          id="shares"
          type="number"
          value={shares}
          onChange={(e) => setShares(parseInt(e.target.value) || 0)}
        />
      </div>
      <div className="mb-4 flex space-x-2">
        <Button
          onClick={buyStock}
          disabled={loading}
          variant="default"
        >
          Buy
        </Button>
        <Button
          onClick={sellStock}
          disabled={loading}
          variant="destructive"
        >
          Sell
        </Button>
      </div>
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <div className="mt-4">
        <h2 className="text-xl font-bold mb-2">Portfolio:</h2>
        <ul>
          {Object.entries(portfolio).map(([stock, amount]) => (
            <li key={stock}>{stock}: {amount} shares</li>
          ))}
        </ul>
      </div>
    </div>
  );
}