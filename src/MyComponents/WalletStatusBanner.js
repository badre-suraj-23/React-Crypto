import React, { useState, useEffect } from 'react';

const WalletStatusBanner = () => {
  const [isEnergiNetwork, setIsEnergiNetwork] = useState(false);
  const [isEthereumAvailable, setIsEthereumAvailable] = useState(true);

  useEffect(() => {
    // Check if Ethereum (MetaMask) is installed
    if (!window.ethereum) {
      setIsEthereumAvailable(false);
      return;
    }

    const checkNetwork = async () => {
      const chainId = await window.ethereum.request({ method: 'eth_chainId' });
      setIsEnergiNetwork(chainId === '0x4e454152'); // Energi chain ID
    };

    checkNetwork();

    // Listen for network changes
    window.ethereum?.on('chainChanged', checkNetwork);

    // Cleanup event listener
    return () => {
      window.ethereum?.removeListener('chainChanged', checkNetwork);
    };
  }, []);

  return (
    <div
      className="text-center py-2"
      style={{
        backgroundColor: isEnergiNetwork ? '#d4edda' : '#f8d7da',
        color: isEnergiNetwork ? '#155724' : '#721c24',
        borderBottom: '2px solid',
        fontSize: '16px',
        padding: '10px',
        marginBottom: '20px',
      }}
    >
      {!isEthereumAvailable ? (
        <span style={{ color: '#721c24' }}>
          MetaMask is not installed. Please install it to use the app.
        </span>
      ) : (
        <>
          <span
            style={{
              display: 'inline-block',
              width: 10,
              height: 10,
              borderRadius: '50%',
              marginRight: 8,
              backgroundColor: isEnergiNetwork ? 'green' : 'red',
            }}
          ></span>
          {isEnergiNetwork ? 'Connected to Energi Network' : 'Not connected to Energi Network'}
        </>
      )}
    </div>
  );
};

export default WalletStatusBanner;
