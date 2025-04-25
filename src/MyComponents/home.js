import React, { useContext, useEffect, useState } from 'react';
import { ThemeContext } from '../context/ThemeContext';

function Home() {
  const { theme } = useContext(ThemeContext);
  const [tokens, setTokens] = useState([]);
  const [sortAsc, setSortAsc] = useState(true);

  useEffect(() => {
    const apiURL = (process.env.REACT_APP_API_URL); 

    fetch(apiURL)
      .then((res) => res.json())
      .then((data) => {
        const tokenArray = Object.entries(data).map(([address, details]) => ({
          address,
          name: details.name,
          symbol: details.symbol,
          price: details.last_price,
        }));
        setTokens(tokenArray);
      })
      .catch((err) => console.error("Failed to fetch tokens:", err));
  }, []);

  const sortByPrice = () => {
    const sorted = [...tokens].sort((a, b) => sortAsc ? a.price - b.price : b.price - a.price);
    setTokens(sorted);
    setSortAsc(!sortAsc);
  };

  return (
    <div className={`container mt-5 ${theme === 'dark' ? 'bg-dark text-white' : 'bg-light text-dark'} p-4 rounded`}>
      <h2 className="text-center mb-4">Cryptocurrency Prices</h2>
      <div className="d-flex justify-content-center">
        <table className={`table table-hover table-bordered ${theme === 'dark' ? 'table-dark' : ''} w-75`}>
          <thead>
            <tr>
              <th scope="col">Icon</th>
              <th scope="col">Ticker Symbol</th>
              <th scope="col">Name</th>
              <th scope="col" style={{ cursor: 'pointer' }} onClick={sortByPrice}>
                Price (USD) {sortAsc ? '↑' : '↓'}
              </th>
            </tr>
          </thead>
          <tbody>
            {tokens.map((token, index) => (
              <tr key={index}>
                <td>
                  <img
                    src={`/icons/${token.symbol.toUpperCase()}.svg`}
                    alt={token.name}
                    width="28"
                    height="28"
                    onError={(e) => e.target.style.display = 'none'} // hide if icon not found
                  />
                </td>
                <td>{token.symbol}</td>
                <td>{token.name}</td>
                <td>${token.price.toFixed(4)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Home;
