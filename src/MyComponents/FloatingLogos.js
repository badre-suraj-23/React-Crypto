import React from 'react';
import { useTheme } from '../context/ThemeContext';

const FloatingLogos = () => {
  const { theme } = useTheme();
  
  // List of cryptocurrency symbols (file names without .svg extension)
  const cryptoSymbols = [
    'INCH', 'AAVE', 'ZRX', 'ZKS', 'ZIL', 'ZEN', 'ZEC', 'YFII', 'YFI', 'XTZ',
    'USDC', 'UBT', 'TRB', 'TOMO', 'THETA', 'ADA', 'AION', 'AKRO', 'ALGO', 'ALPHA',
    'AMP', 'AMPL', 'ANKR', 'ANT', 'AR', 'ARDS', 'ARK', 'ATOM', 'AUDIO', 'AXS',
    'BADGER', 'BAL', 'BAND', 'BAO', 'BAT', 'BCL', 'BLZ', 'BNB', 'BNT', 'BSV',
    'BTC', 'BTMX', 'BTS', 'BTT', 'BZRX', 'CAKE', 'CEL', 'CELO', 'CELR', 'CHSB',
    'CHZ', 'CKB', 'COMP', 'COTI', 'CREAM', 'CRO', 'CRV', 'CTK', 'CVC', 'DAI',
    'DASH', 'DCR', 'DF', 'DGB', 'DNT', 'DODO', 'DOGE', 'DOT', 'DIP', 'DUSK',
    'EGLD', 'ELON', 'ENJ', 'EOS', 'ETC', 'ETH', 'EWT', 'FARM', 'FIL', 'FLOW',
    'FRM', 'FTM', 'FTT', 'FUN', 'GHST', 'GLM', 'GOM', 'GRT', 'HARD', 'HBAR',
    'HEGIC', 'HIFI', 'HIVE', 'HNT', 'HOT', 'HT', 'HXRO', 'ICX', 'ILV', 'INJ',
    'IOST', 'IOTX', 'KAVA', 'KEEP', 'KMD', 'KNC', 'KP3R', 'KSM', 'LEO', 'LINK',
    'LOOM', 'LRC', 'LSK', 'LTC', 'LUNA', 'MANA', 'MAPS', 'MASK', 'MATIC', 'MCO',
    'MDT', 'MDX', 'MFT', 'MIOT', 'MIR', 'MKR', 'MTL', 'NANO', 'NEAR', 'NEO',
    'NEXO', 'NMR', 'NPXS', 'NRG', 'NU', 'NXM', 'NXS', 'OCEAN', 'OGN', 'OKB',
    'OMI', 'ONE', 'ONT', 'ORN', 'PAXG', 'PERP', 'POLS', 'POLY', 'POWR', 'PPT',
    'PREMIA', 'QKC', 'QNR', 'QTUM', 'RARI', 'REEF', 'REN', 'REP', 'RFOX', 'RGT',
    'RIF', 'RLC', 'ROOK', 'ROSE', 'RSR', 'RUNE', 'RVN', 'SAND', 'SC', 'SCRT',
    'SFI', 'SHIB', 'SFP', 'SNT', 'SNX', 'SOL', 'SPELL', 'SRM', 'STAKE', 'STEEM',
    'STORJ', 'STX', 'SUPER', 'SUSHI', 'SWAP', 'SYS', 'TRX', 'TWT', 'UMA', 'UNI',
    'VET', 'VGX', 'WAN', 'WAVES', 'WRX', 'XEM', 'XLM', 'XMR', 'XRP'
  ];

  // Generate random floating elements
  const generateFloatingElements = () => {
    const elements = [];
    const numElements = 25; // Number of floating elements
    
    for (let i = 0; i < numElements; i++) {
      const symbolIndex = Math.floor(Math.random() * cryptoSymbols.length);
      const symbol = cryptoSymbols[symbolIndex];
      const size = Math.random() * 40 + 30; // Size range (30-70px)
      const duration = Math.random() * 40 + 30; // Duration range (30-70s)
      const delay = Math.random() * 20;
      const left = Math.random() * 100;
      const top = Math.random() * 100;
      
      // Opacity settings
      const opacity = theme === 'dark' 
        ? Math.random() * 0.3 + 0.2 // 0.2-0.5 for dark theme
        : Math.random() * 0.4 + 0.3; // 0.3-0.7 for light theme

      // Add some random rotation
      const rotation = Math.random() * 20 - 10; // -10 to 10 degrees

      elements.push(
        <div
          key={i}
          className="floating-logo"
          style={{
            left: `${left}%`,
            top: `${top}%`,
            width: `${size}px`,
            height: `${size}px`,
            animationDuration: `${duration}s`,
            animationDelay: `${delay}s`,
            opacity: opacity,
            position: 'absolute',
            zIndex: 0,
            pointerEvents: 'none',
            transform: `rotate(${rotation}deg)`,
            filter: theme === 'dark' 
              ? 'invert(1) brightness(1.5) drop-shadow(0 0 5px rgba(255, 215, 0, 0.5))' 
              : 'drop-shadow(0 0 5px rgba(0, 0, 0, 0.3))',
          }}
        >
          <img 
            src={`/icons/${symbol}.svg`} 
            alt={`${symbol} logo`}
            style={{ 
              width: '100%', 
              height: '100%',
              objectFit: 'contain'
            }}
            onError={(e) => {
              // Fallback to a generic crypto icon if the specific SVG fails to load
              e.target.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNDAgMjQwIj48Y2lyY2xlIGN4PSIxMjAiIGN5PSIxMjAiIHI9IjEyMCIgZmlsbD0iI2ZmZCIgLz48L3N2Zz4=';
            }}
          />
        </div>
      );
    }
    
    return elements;
  };

  return <div className="floating-logos-container">{generateFloatingElements()}</div>;
};

export default FloatingLogos;