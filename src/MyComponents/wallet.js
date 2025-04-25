import React, { useState, useEffect, useCallback } from 'react';
import { Web3Provider } from '@ethersproject/providers';
import { formatEther } from 'ethers';
import metamaskLogo from '../assets/metamask.png';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function Wallet() {
  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState(0);
  const [usdValue, setUsdValue] = useState(0);
  const [ethPrice, setEthPrice] = useState(null);

  const formatCurrency = (num) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(num || 0);

  const formatNumber = (num) =>
    new Intl.NumberFormat('en-US', { maximumFractionDigits: 4 }).format(num || 0);

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const [selectedAccount] = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setAccount(selectedAccount);
      } catch (err) {
        console.error('User rejected request', err);
      }
    } else {
      alert('MetaMask not installed!');
    }
  };

  // ✅ useCallback for stable function reference
  const fetchBalance = useCallback(async (address) => {
    if (!window.ethereum) return; // Ensure Ethereum is available
    const provider = new Web3Provider(window.ethereum);
    
    try {
      const balanceInWei = await provider.getBalance(address);
      
      // Check if balance is valid
      if (balanceInWei && balanceInWei.toString() !== '0x00') {
        const etherValue = parseFloat(formatEther(balanceInWei));
        setBalance(etherValue);

        if (ethPrice) {
          setUsdValue(etherValue * ethPrice);
        }
      } else {
        // Handle case when balance is zero or invalid
        setBalance(0);
        setUsdValue(0);
      }
    } catch (error) {
      console.error('Error fetching balance:', error);
      setBalance(0);
      setUsdValue(0);
    }
  }, [ethPrice]);

  const fetchEthPrice = useCallback(async () => {
    try {
      const response = await fetch((process.env.REACT_APP_API_URL));
      const data = await response.json();
      const ethAsset = data.find((asset) => asset.symbol === 'ETH');
      
      if (ethAsset && ethAsset.price_usd) {
        setEthPrice(ethAsset.price_usd);
        if (balance) {
          setUsdValue(balance * ethAsset.price_usd);
        }
      }
    } catch (error) {
      console.error('Error fetching price:', error);
    }
  }, [balance]);

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts) => {
        setAccount(accounts[0]);
        fetchBalance(accounts[0]);
      });
    }
  }, [fetchBalance]);

  useEffect(() => {
    if (account) {
      fetchEthPrice();
      fetchBalance(account);
    }
  }, [account, fetchBalance, fetchEthPrice]);

  return (
    <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
      <div className="text-center">
        <img
          src={metamaskLogo}
          alt="MetaMask Logo"
          className="img-fluid mb-4"
          style={{ maxWidth: '150px' }}
        />
        <h2 className="mb-4">METAMASK</h2>

        {!account ? (
          <button className="btn btn-success" onClick={connectWallet}>
            Connect Wallet
          </button>
        ) : (
          <div className="card shadow p-4 bg-light">
            <p><strong>Account:</strong> {account.slice(0, 6)}...{account.slice(-4)}</p>
            <p><strong>ETH Balance:</strong> {formatNumber(balance)} ETH</p>
            <p><strong>$ USD Value:</strong> {formatCurrency(usdValue)}</p>
          </div>
        )}
      </div>
    </div>
  );
}
