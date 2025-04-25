import React, { useState, useEffect, useCallback, useContext } from 'react';
import { Web3Provider } from '@ethersproject/providers';
import { formatEther } from 'ethers';
import metamaskLogo from '../assets/metamask.png';
import { ThemeContext } from '../context/ThemeContext';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function CryptoWallet() {
  const { theme } = useContext(ThemeContext);
  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState(0);
  const [usdValue, setUsdValue] = useState(0);
  const [ethPrice, setEthPrice] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  // Formatting function
  const formatCurrency = (num) =>
    new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(num || 0);

  const formatNumber = (num) =>
    new Intl.NumberFormat('en-US', { 
      maximumFractionDigits: 4,
      minimumFractionDigits: 1 
    }).format(num || 0);

  // Wallet connect/disconnect
  const connectWallet = async () => {
    if (!window.ethereum) {
      alert('Please install MetaMask!');
      return;
    }

    try {
      const [account] = await window.ethereum.request({ 
        method: 'eth_requestAccounts' 
      });
      setAccount(account);
      setIsConnected(true);
    } catch (error) {
      console.error('Error connecting:', error);
    }
  };

  const disconnectWallet = () => {
    setAccount(null);
    setBalance(0);
    setUsdValue(0);
    setIsConnected(false);
  };

  // Fetch balance and price
  const fetchBalance = useCallback(async (address) => {
    try {
      const provider = new Web3Provider(window.ethereum);
      const balanceWei = await provider.getBalance(address);
      const ethBalance = parseFloat(formatEther(balanceWei));
      
      if (!isNaN(ethBalance)) {
        setBalance(ethBalance);
        if (ethPrice) {
          setUsdValue(ethBalance * ethPrice);
        }
      }
    } catch (error) {
      console.error('Error fetching balance:', error);
    }
  }, [ethPrice]);

  const fetchEthPrice = useCallback(async () => {
    try {
      const response = await fetch(
        process.env.REACT_APP_COINGECKO_API || 
        'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=ethereum'
      );
      const data = await response.json();
      if (data[0]?.current_price) {
        setEthPrice(data[0].current_price);
      }
    } catch (error) {
      console.error('Error fetching ETH price:', error);
    }
  }, []);

  // Effects
  useEffect(() => {
    const handleAccountsChanged = (accounts) => {
      if (accounts.length === 0) disconnectWallet();
      else setAccount(accounts[0]);
    };

    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      }
    };
  }, []);

  useEffect(() => {
    if (account) {
      fetchBalance(account);
      fetchEthPrice();
    }
  }, [account, fetchBalance, fetchEthPrice]);

  useEffect(() => {
    // Ensure USD value is updated when ethPrice or balance changes
    if (ethPrice && balance) {
      setUsdValue(balance * ethPrice);
    }
  }, [ethPrice, balance]);

  // Theme styling
  const cardStyle = {
    borderRadius: '20px',
    border: theme === 'dark' ? '1px solid #444' : 'none',
    background: theme === 'dark' ? '#1a1a1a' : '#fff',
    color: theme === 'dark' ? '#fff' : '#000',
  };

  const textColor = theme === 'dark' ? '#fff' : '#000';
  const mutedTextColor = theme === 'dark' ? '#b0b0b0' : '#666'; // Lighter muted text color for better visibility in dark mode

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="text-center">
        <img 
          src={metamaskLogo} 
          alt="MetaMask" 
          className="mb-4"
          style={{ width: '100px' }}
        />

        <div className="card p-4 shadow-lg" style={{ ...cardStyle, width: '400px' }}>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div className="d-flex align-items-center">
              <div 
                className="status-indicator"
                style={{
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  backgroundColor: isConnected ? '#28a745' : '#dc3545',
                  marginRight: '10px'
                }}
              ></div>
              <h5 className="m-0" style={{ color: textColor }}>Energi Network</h5>
            </div>
            {isConnected && (
              <button 
                className="btn btn-sm btn-outline-danger"
                onClick={disconnectWallet}
              >
                Disconnect
              </button>
            )}
          </div>

          {isConnected ? (
            <>
              <div className="my-4">
                <h3 className="text-primary">{formatNumber(balance)} ETH</h3>
                <h2 className="text-success">{formatCurrency(usdValue)}</h2>
              </div>

              <div className="wallet-info text-start">
                <div className="d-flex align-items-center mb-3">
                  <span className="text-muted" style={{ color: mutedTextColor }}></span>
                  <span className="ms-2" style={{ color: textColor }}>
                    {account.slice(0, 6)}...{account.slice(-4)}
                  </span>
                </div>
                <div className="d-flex justify-content-between">
                  <span className="text-muted" style={{ color: mutedTextColor }}></span>
                </div>
              </div>
            </>
          ) : (
            <div className="py-4">
              <button 
                className="btn btn-lg btn-success px-5 py-3"
                onClick={connectWallet}
              >
                Connect Wallet
              </button>
              <p className="text-muted mt-3" style={{ color: mutedTextColor }}>
                Please connect your MetaMask wallet
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
