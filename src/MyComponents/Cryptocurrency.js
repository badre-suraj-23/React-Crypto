import React, { useContext, useEffect, useMemo, useState, useCallback } from 'react';
import { ThemeContext } from '../context/ThemeContext';

// Custom hook for data fetching
const useCryptoData = () => {
  const [tokens, setTokens] = useState([]);
  const [usdToInrRate, setUsdToInrRate] = useState(83.5);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch token data
        const apiURL = process.env.REACT_APP_API_URL || 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=200&page=1&sparkline=false';
        const [tokenResponse, rateResponse] = await Promise.all([
          fetch(apiURL),
          fetch('https://api.exchangerate.host/latest?base=USD&symbols=INR')
        ]);
        
        if (!tokenResponse.ok) throw new Error('Failed to fetch token data');
        if (!rateResponse.ok) throw new Error('Failed to fetch exchange rate');
        
        const [tokenData, rateData] = await Promise.all([
          tokenResponse.json(),
          rateResponse.json()
        ]);
        
        const tokenArray = tokenData.map((coin) => ({
          id: coin.id,
          name: coin.name,
          symbol: coin.symbol.toUpperCase(),
          priceUSD: coin.current_price,
          image: coin.image,
          priceChange24h: coin.price_change_percentage_24h,
          marketCap: coin.market_cap,
          volume: coin.total_volume,
        }));
        
        setTokens(tokenArray);
        
        if (rateData && rateData.rates && rateData.rates.INR) {
          setUsdToInrRate(rateData.rates.INR);
        }
      } catch (err) {
        console.error("API Error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { tokens, usdToInrRate, loading, error };
};

function Cryptocurrency() {
  const { theme } = useContext(ThemeContext);
  const { tokens, usdToInrRate, loading, error } = useCryptoData();
  const [sortConfig, setSortConfig] = useState({ key: 'marketCap', direction: 'desc' });
  const [showINR, setShowINR] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Filter tokens based on search term
  const filteredTokens = useMemo(() => {
    if (!searchTerm) return tokens;
    return tokens.filter(token => 
      token.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      token.symbol.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [tokens, searchTerm]);

  // Sort tokens based on sort configuration
  const sortedTokens = useMemo(() => {
    const sortableTokens = [...filteredTokens];
    if (!sortConfig.key) return sortableTokens;
    
    sortableTokens.sort((a, b) => {
      let aValue, bValue;
      
      if (sortConfig.key === 'price') {
        aValue = showINR ? a.priceUSD * usdToInrRate : a.priceUSD;
        bValue = showINR ? b.priceUSD * usdToInrRate : b.priceUSD;
      } else {
        aValue = a[sortConfig.key];
        bValue = b[sortConfig.key];
      }
      
      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
    
    return sortableTokens;
  }, [filteredTokens, sortConfig, showINR, usdToInrRate]);

  const requestSort = useCallback((key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  }, [sortConfig]);

  const toggleCurrency = useCallback(() => {
    setShowINR(prev => !prev);
  }, []);

  const handleSearchChange = useCallback((e) => {
    setSearchTerm(e.target.value);
  }, []);

  if (loading) {
    return (
      <div className={`d-flex justify-content-center align-items-center min-vh-100 ${theme === 'dark' ? 'bg-dark' : 'bg-light'}`}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <span className="ms-2">Loading cryptocurrency data...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`d-flex justify-content-center align-items-center min-vh-100 ${theme === 'dark' ? 'bg-dark text-white' : 'bg-light text-dark'}`}>
        <div className="text-center">
          <div className="text-danger mb-3" style={{ fontSize: '3rem' }}>
            <i className="bi bi-exclamation-triangle-fill"></i>
          </div>
          <h3>Error Loading Data</h3>
          <p>{error}</p>
          <button className="btn btn-primary mt-3" onClick={() => window.location.reload()}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-vh-100 py-4 ${theme === "dark" ? "bg-dark text-white" : "bg-light text-dark"}`}>
      <div className="container-fluid">
        <div className="row justify-content-center">
          <div className="col-12">
            <div className="card shadow-sm">
              <div className={`card-header ${theme === "dark" ? "bg-secondary text-white" : "bg-light text-dark"}`}>
                <div className="d-flex justify-content-between align-items-center flex-wrap">
                  <h2 className="h4 mb-2">Cryptocurrency Prices</h2>
                  <div className="d-flex gap-2 flex-wrap">
                    <div className="input-group" style={{ maxWidth: '300px' }}>
                      <span className={`input-group-text ${theme === "dark" ? "bg-dark text-white border-secondary" : ""}`}>
                        <i className="bi bi-search"></i>
                      </span>
                      <input
                        type="text"
                        className={`form-control ${theme === "dark" ? "bg-dark text-white border-secondary" : ""}`}
                        placeholder="Search coins..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                        style={{ 
                          color: theme === "dark" ? "#fff" : "#000",
                        }}
                      />
                    </div>
                    <button 
                      className={`btn ${showINR ? 'btn-warning' : 'btn-info'}`}
                      onClick={toggleCurrency}
                    >
                      {showINR ? (
                        <><i className="bi bi-currency-exchange me-1"></i> Show USD</>
                      ) : (
                        <><i className="bi bi-currency-rupee me-1"></i> Show INR</>
                      )}
                    </button>
                  </div>
                </div>
              </div>
              <div className="card-body p-0">
                <div className="table-responsive" style={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}>
                  <table className={`table table-hover mb-0 ${theme === "dark" ? "table-dark" : ""}`} style={{ minWidth: '800px' }}>
                    <thead>
                      <tr>
                        <th scope="col" className="ps-4">#</th>
                        <th scope="col">Coin</th>
                        <th 
                          scope="col" 
                          style={{ cursor: "pointer" }}
                          onClick={() => requestSort('symbol')}
                        >
                          Ticker
                          {sortConfig.key === 'symbol' && (
                            <span className="ms-1">{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                          )}
                        </th>
                        <th 
                          scope="col" 
                          style={{ cursor: "pointer", minWidth: '120px' }} 
                          onClick={() => requestSort('price')}
                          className="text-end pe-4"
                        >
                          Price ({showINR ? "INR" : "USD"}) 
                          {sortConfig.key === 'price' && (
                            <span className="ms-1">{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                          )}
                        </th>
                        <th 
                          scope="col" 
                          style={{ cursor: "pointer" }}
                          onClick={() => requestSort('priceChange24h')}
                          className="text-end pe-4"
                        >
                          24h Change
                          {sortConfig.key === 'priceChange24h' && (
                            <span className="ms-1">{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                          )}
                        </th>
                        <th 
                          scope="col" 
                          style={{ cursor: "pointer" }}
                          onClick={() => requestSort('marketCap')}
                          className="text-end pe-4"
                        >
                          Market Cap
                          {sortConfig.key === 'marketCap' && (
                            <span className="ms-1">{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                          )}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {sortedTokens.map((token, index) => (
                        <tr key={token.id}>
                          <td className={`ps-4 fw-bold ${theme === 'dark' ? 'text-white-50' : 'text-muted'}`}>
                            {index + 1}
                          </td>
                          <td>
                            <div className="d-flex align-items-center">
                              <img
                                src={token.image}
                                alt={token.name}
                                width="32"
                                height="32"
                                className="rounded-circle me-2"
                              />
                              <span className="fw-medium">{token.name}</span>
                            </div>
                          </td>
                          <td>
                            <span className="badge bg-secondary">{token.symbol}</span>
                          </td>
                          <td className="text-end pe-4 fw-bold">
                            {showINR
                              ? `₹${(token.priceUSD * usdToInrRate).toLocaleString('en-IN', { maximumFractionDigits: 2 })}`
                              : `$${token.priceUSD.toLocaleString('en-US', { maximumFractionDigits: 4 })}`}
                          </td>
                          <td className="text-end pe-4">
                            <span className={`badge ${token.priceChange24h >= 0 ? 'bg-success' : 'bg-danger'}`}>
                              {token.priceChange24h >= 0 ? '↑' : '↓'} {Math.abs(token.priceChange24h).toFixed(2)}%
                            </span>
                          </td>
                          <td className="text-end pe-4">
                            ${token.marketCap.toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className={`card-footer ${theme === "dark" ? "bg-secondary text-white" : "bg-light text-dark"} text-center`}>
                <small>
                  Exchange Rate: 1 USD = {usdToInrRate.toFixed(2)} INR
                  {sortedTokens.length > 0 && ` • ${sortedTokens.length} coins displayed`}
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        /* Fix for search input placeholder in dark mode */
        .bg-dark.form-control::placeholder {
          color: #adb5bd !important;
        }
        /* Custom scrollbar for table */
        .table-responsive::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        .table-responsive::-webkit-scrollbar-track {
          background: ${theme === "dark" ? "#343a40" : "#f1f1f1"};
        }
        .table-responsive::-webkit-scrollbar-thumb {
          background: ${theme === "dark" ? "#6c757d" : "#c1c1c1"};
          border-radius: 4px;
        }
        .table-responsive::-webkit-scrollbar-thumb:hover {
          background: ${theme === "dark" ? "#495057" : "#a8a8a8"};
        }
        @media (max-width: 768px) {
          .card-header h2 {
            font-size: 1.5rem;
          }
          .table {
            font-size: 0.85rem;
          }
          .input-group {
            max-width: 100% !important;
          }
        }
        @media (max-width: 576px) {
          .card-header h2 {
            font-size: 1.25rem;
          }
          .table {
            font-size: 0.75rem;
          }
          .btn {
            font-size: 0.8rem;
          }
        }
      `}</style>
    </div>
  );
}

export default Cryptocurrency;