import { useEffect, useState, useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";
import ReactPaginate from "react-paginate";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function Home() {
  const { theme } = useContext(ThemeContext);
  const [coins, setCoins] = useState([]);
  const [filteredCoins, setFilteredCoins] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [usdToInr, setUsdToInr] = useState(83);
  const itemsPerPage = 10;
  const [totalCoins, setTotalCoins] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });

  useEffect(() => {
    const fetchCoins = async () => {
      try {
        setLoading(true);
        // Fetch exchange rate with better error handling
        let exchangeRate = 83; // Default fallback value
        
        try {
          const rateResponse = await fetch(
            "https://api.exchangerate.host/latest?base=USD&symbols=INR"
          );
          const rateData = await rateResponse.json();
          
          if (rateData && rateData.rates && rateData.rates.INR) {
            exchangeRate = rateData.rates.INR;
          } else {
            console.warn("Exchange rate API response unexpected, using default value");
          }
        } catch (rateError) {
          console.warn("Failed to fetch exchange rate, using default value", rateError);
        }
        
        setUsdToInr(exchangeRate);

        // Fetch coins for the current page
        const apiURL = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${itemsPerPage}&page=${page}&sparkline=false`;
        
        const tokenResponse = await fetch(apiURL);
        
        if (!tokenResponse.ok) {
          throw new Error(`API request failed with status ${tokenResponse.status}`);
        }

        const tokens = await tokenResponse.json();
        
        // If we don't have total coins count yet, set it (assuming first page)
        if (totalCoins === 0 && page === 1) {
          // This is an approximation since the API doesn't give us the exact total
          setTotalCoins(100); // We'll assume 100 coins as per the original implementation
        }

        const formatted = tokens.map((coin, index) => ({
          id: coin.id,
          name: coin.name,
          symbol: coin.symbol.toUpperCase(),
          value: coin.current_price * exchangeRate,
          usdValue: coin.current_price,
          change24h: coin.price_change_percentage_24h || 0,
          marketCap: coin.market_cap,
          // Assign a color based on index
          color: COLORS[index % COLORS.length],
        }));

        setCoins(formatted);
        setFilteredCoins(formatted);
        setError(null);
      } catch (error) {
        console.error("Error fetching coin data:", error);
        setError(error.message);
        // Fallback data in case API fails
        if (page === 1) {
          const fallbackData = [
            { id: "bitcoin", name: "Bitcoin", symbol: "BTC", value: 5000000, usdValue: 60000, change24h: 2.5, color: "#FF6384" },
            { id: "ethereum", name: "Ethereum", symbol: "ETH", value: 300000, usdValue: 3600, change24h: 1.8, color: "#36A2EB" },
            { id: "cardano", name: "Cardano", symbol: "ADA", value: 100, usdValue: 1.2, change24h: -0.5, color: "#FFCE56" },
            { id: "solana", name: "Solana", symbol: "SOL", value: 8000, usdValue: 96, change24h: 5.2, color: "#4BC0C0" },
            { id: "polkadot", name: "Polkadot", symbol: "DOT", value: 500, usdValue: 6, change24h: -2.1, color: "#9966FF" },
            { id: "dogecoin", name: "Dogecoin", symbol: "DOGE", value: 10, usdValue: 0.12, change24h: 3.7, color: "#FF9F40" },
            { id: "shiba-inu", name: "Shiba Inu", symbol: "SHIB", value: 0.001, usdValue: 0.000012, change24h: 8.9, color: "#C9CBCF" },
            { id: "ripple", name: "Ripple", symbol: "XRP", value: 50, usdValue: 0.6, change24h: -1.3, color: "#FF6384" },
            { id: "litecoin", name: "Litecoin", symbol: "LTC", value: 800, usdValue: 9.6, change24h: 0.7, color: "#36A2EB" },
            { id: "chainlink", name: "Chainlink", symbol: "LINK", value: 600, usdValue: 7.2, change24h: 2.4, color: "#FFCE56" },
          ];
          setCoins(fallbackData);
          setFilteredCoins(fallbackData);
        } else {
          setCoins([]);
          setFilteredCoins([]);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCoins();
  }, [page]);

  // Handle search functionality
  useEffect(() => {
    if (searchQuery) {
      const filtered = coins.filter(
        (coin) =>
          coin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          coin.symbol.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredCoins(filtered);
    } else {
      setFilteredCoins(coins);
    }
  }, [searchQuery, coins]);

  // Handle sorting
  const handleSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    
    setSortConfig({ key, direction });
    
    const sortedCoins = [...filteredCoins].sort((a, b) => {
      if (a[key] < b[key]) {
        return direction === "ascending" ? -1 : 1;
      }
      if (a[key] > b[key]) {
        return direction === "ascending" ? 1 : -1;
      }
      return 0;
    });
    
    setFilteredCoins(sortedCoins);
  };

  const totalPages = Math.ceil(totalCoins / itemsPerPage);

  const COLORS = [
    "#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#AA336A",
    "#6633FF", "#FF6666", "#33CC99", "#FF9933", "#3399FF",
    "#FF6699", "#66FF99", "#9966FF", "#FF9966", "#66FFFF"
  ];

  const formatCurrency = (value) => {
    if (!value && value !== 0) return "₹0.00";
    
    if (value >= 1000000) {
      return `₹${(value / 1000000).toFixed(2)}M`;
    } else if (value >= 1000) {
      return `₹${(value / 1000).toFixed(2)}K`;
    }
    return `₹${value.toFixed(2)}`;
  };

  // Function to handle page changes with validation
  const handlePageChange = (selectedItem) => {
    const newPage = selectedItem.selected + 1;
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  // Render sort indicator
  const renderSortDirection = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === "ascending" ? "↑" : "↓";
    }
    return null;
  };

  // Custom tooltip for the chart
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const totalValue = filteredCoins.reduce((sum, coin) => sum + coin.value, 0);
      const percentage = ((data.value / totalValue) * 100).toFixed(2);
      
      return (
        <div className={`custom-tooltip p-2 rounded ${theme === "dark" ? "bg-dark text-light" : "bg-light text-dark"}`}
          style={{ border: "1px solid #ccc" }}>
          <p className="mb-1">{data.name}</p>
          <p className="mb-0">Value: ₹{data.value.toLocaleString("en-IN")}</p>
          <p className="mb-0">Percentage: {percentage}%</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className={`container mt-5 pt-3 ${theme === "dark" ? "bg-dark text-light" : "bg-light text-dark"}`} style={{ minHeight: "100vh" }}>
      <div className="row justify-content-center">
        <div className="col-12 col-lg-10">
          <div className={`card shadow ${theme === "dark" ? "bg-secondary text-light" : ""}`}>
            <div className={`card-header ${theme === "dark" ? "bg-dark text-white" : "bg-primary text-white"}`}>
              <h2 className="text-center mb-0">Crypto Prices Dashboard</h2>
              <p className="text-center mb-0">
                Exchange Rate: 1 USD = ₹{usdToInr.toFixed(2)} INR
              </p>
            </div>

            <div className="card-body">
              {/* Search Bar */}
              <div className="row mb-4">
                <div className="col-12 col-md-8 col-lg-6 mx-auto">
                  <div className="input-group">
                    <span className={`input-group-text ${theme === "dark" ? "bg-dark text-light border-secondary" : ""}`}>
                      <i className="bi bi-search"></i>
                    </span>
                    <input
                      type="text"
                      className={`form-control ${theme === "dark" ? "bg-dark text-light border-secondary" : ""}`}
                      placeholder="Search by name or symbol..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      style={{ 
                        color: theme === "dark" ? "#fff" : "#000",
                      }}
                    />
                  </div>
                </div>
              </div>

              {error && (
                <div className="alert alert-warning" role="alert">
                  API Error: {error}. {page === 1 ? "Showing sample data for demonstration." : "No data available for this page."}
                </div>
              )}

              {loading ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <p className="mt-3">Loading crypto data...</p>
                </div>
              ) : (
                <>
                  {filteredCoins.length === 0 ? (
                    <div className="text-center py-5">
                      <p>No matching coins found.</p>
                      <button 
                        className="btn btn-primary"
                        onClick={() => {
                          setPage(1);
                          setSearchQuery("");
                        }}
                      >
                        Reset Search
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="row">
                        {/* Donut Chart with Custom Legend */}
                        <div className="col-12 col-lg-7 mb-4 mb-lg-0">
                          <div style={{ width: "100%", height: "300px" }}>
                            <ResponsiveContainer>
                              <PieChart>
                                <Pie
                                  data={filteredCoins}
                                  dataKey="value"
                                  nameKey="name"
                                  cx="50%"
                                  cy="50%"
                                  innerRadius={60}
                                  outerRadius={120}
                                >
                                  {filteredCoins.map((entry, index) => (
                                    <Cell
                                      key={`cell-${index}`}
                                      fill={entry.color || COLORS[index % COLORS.length]}
                                    />
                                  ))}
                                </Pie>
                                <Tooltip content={<CustomTooltip />} />
                              </PieChart>
                            </ResponsiveContainer>
                          </div>
                          
                          {/* Custom Legend */}
                          <div className="row mt-3">
                            {filteredCoins.map((coin, index) => (
                              <div key={coin.id} className="col-6 col-sm-4 col-md-3">
                                <div className="d-flex align-items-center mb-2">
                                  <div
                                    style={{
                                      width: "12px",
                                      height: "12px",
                                      backgroundColor: coin.color || COLORS[index % COLORS.length],
                                      marginRight: "6px",
                                      borderRadius: "3px",
                                    }}
                                  ></div>
                                  <small style={{ fontSize: "0.7rem" }}>
                                    {coin.symbol}: {formatCurrency(coin.value)}
                                  </small>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Table */}
                        <div className="col-12 col-lg-5">
                          <div
                            className="table-responsive"
                            style={{ maxHeight: "400px", overflowY: "auto" }}
                          >
                            <table
                              className={`table table-striped table-hover ${theme === "dark" ? "table-dark" : ""}`}
                            >
                              <thead className="sticky-top">
                                <tr>
                                  <th>Coin</th>
                                  <th 
                                    className="clickable"
                                    onClick={() => handleSort("value")}
                                  >
                                    Price (INR) {renderSortDirection("value")}
                                  </th>
                                  <th 
                                    className="clickable"
                                    onClick={() => handleSort("change24h")}
                                  >
                                    24h Change {renderSortDirection("change24h")}
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                {filteredCoins.map((coin) => (
                                  <tr key={coin.id}>
                                    <td>
                                      <span className="fw-bold">{coin.symbol}</span>
                                      <br />
                                      <small className="text-muted">{coin.name}</small>
                                    </td>
                                    <td className="fw-bold">
                                      ₹
                                      {coin.value ? coin.value.toLocaleString("en-IN", {
                                        maximumFractionDigits: 2,
                                      }) : "0.00"}
                                    </td>
                                    <td
                                      className={
                                        coin.change24h >= 0
                                          ? "text-success"
                                          : "text-danger"
                                      }
                                    >
                                      {coin.change24h >= 0 ? "↑" : "↓"}{" "}
                                      {Math.abs(coin.change24h || 0).toFixed(2)}%
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>

                      {/* Pagination with react-paginate */}
                      <div className="d-flex justify-content-center mt-4">
                        <ReactPaginate
                          previousLabel={"Previous"}
                          nextLabel={"Next"}
                          breakLabel={"..."}
                          breakClassName={"break-me"}
                          pageCount={totalPages}
                          marginPagesDisplayed={1}
                          pageRangeDisplayed={3}
                          onPageChange={handlePageChange}
                          containerClassName={`pagination ${theme === "dark" ? "pagination-dark" : ""}`}
                          pageClassName="page-item"
                          pageLinkClassName="page-link"
                          previousClassName="page-item"
                          previousLinkClassName="page-link"
                          nextClassName="page-item"
                          nextLinkClassName="page-link"
                          breakLinkClassName="page-link"
                          activeClassName="active"
                          forcePage={page - 1}
                        />
                      </div>

                      <div className="text-center mt-2">
                        <small className="text-muted">
                          Page {page} of {totalPages} | Showing {filteredCoins.length} coins
                          {searchQuery && ` (filtered from ${coins.length})`}
                        </small>
                      </div>
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .clickable {
          cursor: pointer;
        }
        .clickable:hover {
          background-color: ${theme === "dark" ? "#495057" : "#f8f9fa"};
        }
        .pagination-dark .page-link {
          background-color: #343a40;
          border-color: #6c757d;
          color: #f8f9fa;
        }
        .pagination-dark .page-item.active .page-link {
          background-color: #6c757d;
          border-color: #6c757d;
        }
        .pagination-dark .page-link:hover {
          background-color: #495057;
          border-color: #6c757d;
          color: #f8f9fa;
        }
        /* Fix for search input placeholder in dark mode */
        .bg-dark.form-control::placeholder {
          color: #adb5bd !important;
        }
        @media (max-width: 768px) {
          .card-header h2 {
            font-size: 1.5rem;
          }
          .table-responsive {
            font-size: 0.85rem;
          }
          .pagination {
            font-size: 0.8rem;
          }
        }
        @media (max-width: 576px) {
          .card-header h2 {
            font-size: 1.25rem;
          }
          .table-responsive {
            font-size: 0.75rem;
          }
          .pagination {
            font-size: 0.7rem;
          }
        }
      `}</style>
    </div>
  );
}

export default Home;