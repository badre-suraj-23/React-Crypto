import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useTheme } from '../context/ThemeContext';

const News = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState('pagination'); // 'pagination' or 'infinite'
  const [isFetching, setIsFetching] = useState(false);
  const { theme } = useTheme();
  const observer = useRef();
  const newsPerPage = 9;

  // Fetch news data
  useEffect(() => {
    const fetchNews = async () => {
      try {
        setIsFetching(true);
        const response = await fetch('https://min-api.cryptocompare.com/data/v2/news/?lang=EN');
        
        if (!response.ok) {
          throw new Error('Failed to fetch news');
        }
        
        const data = await response.json();
        setNews(data.Data || []);
      } catch (err) {
        console.error('Error fetching news:', err);
        // Fallback to mock data if API fails
        setNews([
          {
            id: 1,
            title: "Bitcoin Reaches New All-Time High",
            body: "Bitcoin has surpassed its previous record, reaching over $70,000 as institutional adoption increases.",
            url: "https://example.com/news/1",
            imageurl: "https://via.placeholder.com/300x200?text=Bitcoin+News",
            source: "CryptoNews",
            published_on: 1636963200
          },
          {
            id: 2,
            title: "Ethereum Foundation Announces Major Upgrade",
            body: "The Ethereum Foundation has revealed plans for a significant network upgrade that will improve scalability and reduce gas fees.",
            url: "https://example.com/news/2",
            imageurl: "https://via.placeholder.com/300x200?text=Ethereum+News",
            source: "Blockchain Daily",
            published_on: 1636876800
          },
          {
            id: 3,
            title: "New Regulation Proposal for Cryptocurrencies",
            body: "Government officials have proposed new regulations for the crypto market that aim to protect investors while fostering innovation.",
            url: "https://example.com/news/3",
            imageurl: "https://via.placeholder.com/300x200?text=Regulation+News",
            source: "Financial Times",
            published_on: 1636790400
          },
          {
            id: 4,
            title: "NFT Market Sees Record Sales",
            body: "The NFT market has experienced unprecedented growth with several high-profile sales breaking records in the past month.",
            url: "https://example.com/news/4",
            imageurl: "https://via.placeholder.com/300x200?text=NFT+News",
            source: "ArtNews",
            published_on: 1636704000
          },
          {
            id: 5,
            title: "DeFi Projects Attract Billions in Investments",
            body: "Decentralized finance platforms continue to attract significant investment as traditional finance institutions show increased interest.",
            url: "https://example.com/news/5",
            imageurl: "https://via.placeholder.com/300x200?text=DeFi+News",
            source: "Finance Weekly",
            published_on: 1636617600
          },
          {
            id: 6,
            title: "Central Banks Explore Digital Currencies",
            body: "Several central banks worldwide are accelerating their exploration of central bank digital currencies (CBDCs) as crypto adoption grows.",
            url: "https://example.com/news/6",
            imageurl: "https://via.placeholder.com/300x200?text=CBDC+News",
            source: "Economic Times",
            published_on: 1636531200
          },
          {
            id: 7,
            title: "Crypto Mining Industry Adapts to New Challenges",
            body: "Cryptocurrency mining companies are innovating with renewable energy solutions amid regulatory changes.",
            url: "https://example.com/news/7",
            imageurl: "https://via.placeholder.com/300x200?text=Mining+News",
            source: "Tech Review",
            published_on: 1636444800
          },
          {
            id: 8,
            title: "Stablecoins Gain Traction in Payment Systems",
            body: "Major payment processors are increasingly integrating stablecoins into their platforms for faster transactions.",
            url: "https://example.com/news/8",
            imageurl: "https://via.placeholder.com/300x200?text=Stablecoin+News",
            source: "Finance Today",
            published_on: 1636358400
          },
          {
            id: 9,
            title: "Crypto Exports Expand to New Markets",
            body: "Leading cryptocurrency exchanges are expanding their services to emerging markets with growing adoption.",
            url: "https://example.com/news/9",
            imageurl: "https://via.placeholder.com/300x200?text=Exchange+News",
            source: "Business Times",
            published_on: 1636272000
          },
          {
            id: 10,
            title: "Blockchain Technology Revolutionizes Supply Chain",
            body: "Companies across industries are implementing blockchain solutions to enhance supply chain transparency.",
            url: "https://example.com/news/10",
            imageurl: "https://via.placeholder.com/300x200?text=Blockchain+News",
            source: "Supply Chain Journal",
            published_on: 1636185600
          },
          {
            id: 11,
            title: "Crypto Education Programs Launch at Universities",
            body: "Top universities are introducing cryptocurrency and blockchain courses to meet growing student demand.",
            url: "https://example.com/news/11",
            imageurl: "https://via.placeholder.com/300x200?text=Education+News",
            source: "University Herald",
            published_on: 1636099200
          },
          {
            id: 12,
            title: "Institutional Investors Increase Crypto Allocations",
            body: "A new survey shows that institutional investors are planning to increase their cryptocurrency holdings.",
            url: "https://example.com/news/12",
            imageurl: "https://via.placeholder.com/300x200?text=Institutional+News",
            source: "Investment Weekly",
            published_on: 1636012800
          },
          {
            id: 13,
            title: "Crypto Gaming Sector Sees Explosive Growth",
            body: "Play-to-earn blockchain games are attracting millions of users and significant investment.",
            url: "https://example.com/news/13",
            imageurl: "https://via.placeholder.com/300x200?text=Gaming+News",
            source: "Gaming Magazine",
            published_on: 1635926400
          },
          {
            id: 14,
            title: "Privacy Coins Face Regulatory Scrutiny",
            body: "Regulators worldwide are examining privacy-focused cryptocurrencies amid concerns about illicit use.",
            url: "https://example.com/news/14",
            imageurl: "https://via.placeholder.com/300x200?text=Privacy+News",
            source: "Policy Review",
            published_on: 1635840000
          },
          {
            id: 15,
            title: "Crypto Tax Software Solutions Improve",
            body: "New software tools are making it easier for cryptocurrency investors to calculate and report taxes.",
            url: "https://example.com/news/15",
            imageurl: "https://via.placeholder.com/300x200?text=Tax+News",
            source: "Tax Advisor",
            published_on: 1635753600
          },
          {
            id: 16,
            title: "Crypto Donations to Charities Increase",
            body: "Non-profit organizations are reporting a significant rise in cryptocurrency donations.",
            url: "https://example.com/news/16",
            imageurl: "https://via.placeholder.com/300x200?text=Charity+News",
            source: "Philanthropy Journal",
            published_on: 1635667200
          },
          {
            id: 17,
            title: "Web3 Development Accelerates",
            body: "Developers are building the next generation of decentralized applications on blockchain platforms.",
            url: "https://example.com/news/17",
            imageurl: "https://via.placeholder.com/300x200?text=Web3+News",
            source: "Developer Weekly",
            published_on: 1635580800
          },
          {
            id: 18,
            title: "Crypto Insurance Products Expand",
            body: "Insurance companies are offering more products to protect cryptocurrency holdings against theft and loss.",
            url: "https://example.com/news/18",
            imageurl: "https://via.placeholder.com/300x200?text=Insurance+News",
            source: "Insurance Times",
            published_on: 1635494400
          }
        ]);
      } finally {
        setLoading(false);
        setIsFetching(false);
      }
    };

    fetchNews();
  }, []);

  // Calculate pagination
  const indexOfLastNews = currentPage * newsPerPage;
  const indexOfFirstNews = indexOfLastNews - newsPerPage;
  const currentNews = news.slice(indexOfFirstNews, indexOfLastNews);
  const totalPages = Math.ceil(news.length / newsPerPage);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Infinite scroll implementation
  const lastNewsElementRef = useCallback(node => {
    if (isFetching) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && viewMode === 'infinite' && currentPage < totalPages) {
        setCurrentPage(prevPage => prevPage + 1);
      }
    });
    if (node) observer.current.observe(node);
  }, [isFetching, viewMode, currentPage, totalPages]);

  if (loading) {
    return (
      <div className="container mt-5 pt-5">
        <div className="d-flex justify-content-center mt-5 pt-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  const itemsToRender = viewMode === 'pagination' ? currentNews : news;

  return (
    <div className={`container mt-5 pt-4 ${theme === 'dark' ? 'bg-dark text-light' : 'bg-light text-dark'}`} style={{ minHeight: '100vh' }}>
      <h2 className="mb-4 text-center">Latest Cryptocurrency News</h2>
      
      {/* View Mode Toggle */}
      <div className="d-flex justify-content-center mb-4">
        <div className="btn-group" role="group">
          <button 
            type="button" 
            className={`btn ${viewMode === 'pagination' ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => setViewMode('pagination')}
          >
            Pagination
          </button>
          <button 
            type="button" 
            className={`btn ${viewMode === 'infinite' ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => setViewMode('infinite')}
          >
            Infinite Scroll
          </button>
        </div>
      </div>
      
      {news.length === 0 ? (
        <div className={`alert ${theme === 'dark' ? 'alert-dark' : 'alert-info'}`} role="alert">
          No news available at the moment.
        </div>
      ) : (
        <>
          <div className="row">
            {itemsToRender.map((item, index) => {
              const isLastElement = viewMode === 'infinite' && index === itemsToRender.length - 1;
              return (
                <div 
                  ref={isLastElement ? lastNewsElementRef : null} 
                  key={item.id} 
                  className="col-md-6 col-lg-4 mb-4"
                >
                  <div className={`card h-100 shadow-sm ${theme === 'dark' ? 'bg-secondary text-light' : ''}`}>
                    {item.imageurl && (
                      <img 
                        src={item.imageurl} 
                        className="card-img-top" 
                        alt={item.title} 
                        style={{ height: '200px', objectFit: 'cover' }}
                      />
                    )}
                    <div className="card-body d-flex flex-column">
                      <h5 className="card-title">{item.title}</h5>
                      <p className="card-text flex-grow-1">{item.body || "No description available."}</p>
                      <div className="mt-auto">
                        <a 
                          href={item.url} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="btn btn-primary btn-sm"
                        >
                          Read more
                        </a>
                      </div>
                    </div>
                    <div className={`card-footer ${theme === 'dark' ? 'bg-dark text-light' : 'bg-transparent text-muted'}`}>
                      <small>
                        Source: {item.source} • {new Date(item.published_on * 1000).toLocaleDateString()}
                      </small>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination Controls */}
          {viewMode === 'pagination' && totalPages > 1 && (
            <nav aria-label="News pagination" className="mt-4">
              <ul className="pagination justify-content-center">
                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                  <button 
                    className={`page-link ${theme === 'dark' ? 'bg-dark text-light border-dark' : ''}`}
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </button>
                </li>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
                  <li key={number} className={`page-item ${currentPage === number ? 'active' : ''}`}>
                    <button 
                      className={`page-link ${theme === 'dark' ? 'bg-dark text-light border-dark' : ''} ${currentPage === number ? (theme === 'dark' ? 'bg-primary border-primary' : '') : ''}`}
                      onClick={() => paginate(number)}
                    >
                      {number}
                    </button>
                  </li>
                ))}
                
                <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                  <button 
                    className={`page-link ${theme === 'dark' ? 'bg-dark text-light border-dark' : ''}`}
                    onClick={() => paginate(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </button>
                </li>
              </ul>
            </nav>
          )}

          {/* Loading spinner for infinite scroll */}
          {viewMode === 'infinite' && isFetching && (
            <div className="d-flex justify-content-center mt-4">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading more news...</span>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default News;