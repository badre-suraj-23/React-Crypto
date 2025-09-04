📊 Cryptocurrency Tracker

A React + Django REST Framework based web application that allows users to:

Monitor cryptocurrency prices (USD & INR).

Connect and view wallet balances (MetaMask).

Stay updated with latest crypto news.

Register/login with secure JWT authentication.

Switch between light/dark theme.

📋 Project Overview

Home: Token listing with sorting by price, symbol, or name.

Wallet: MetaMask integration to show balances + USD/INR value.

News: Latest crypto news with pagination & infinite scroll.

Authentication: JWT-based secure login & registration.

Theme System: Light/Dark toggle with persistent storage.

Visuals: Animated floating crypto logos + responsive UI.

🛠️ Technologies Used

Frontend: React.js, Bootstrap, CSS3

Routing: React Router DOM

State Management: React Context API

Backend: Django REST Framework (JWT Auth)

Authentication: JWT tokens (access + refresh)

Icons: Custom SVG icons + Bootstrap Icons

APIs:

Energiswap API
 → Token Data

CoinGecko API
 → Market Data

CryptoCompare API
 → Crypto News

Exchange Rate API
 → USD → INR Conversion

📂 Project Structure
src/
├── components/
│   ├── Home.js              # Token listing with sorting
│   ├── Cryptocurrency.js    # Detailed crypto information
│   ├── Wallet.js            # MetaMask integration
│   ├── News.js              # Crypto news with pagination
│   ├── Navbar.js            # Navigation with theme toggle
│   ├── Footer.js            # Site footer
│   └── FloatingLogos.js     # Animated background
├── context/
│   ├── AuthContext.js       # Authentication state management
│   └── ThemeContext.js      # Theme state management
├── pages/
│   ├── Login.js             # User login
│   └── Register.js          # User registration
├── App.js                   # Main app component
└── App.css                  # Global styles with theme support

🔌 API Integration
1. Authentication API (Django REST Backend)

Base URL: https://blogmedia.onrender.com/api

POST /auth/register/ → Register user

POST /auth/login/ → Login user

POST /auth/token/refresh/ → Refresh JWT token

GET /auth/user/ → Fetch current user

2. CoinGecko API (Market Data)

https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd

Fetch prices, market cap, volume, price change %

Used for Home page token table

3. Exchange Rate API (USD → INR Conversion)

https://api.exchangerate.host/latest?base=USD&symbols=INR

Convert all USD values to INR

4. CryptoCompare API (News)

https://min-api.cryptocompare.com/data/v2/news/

Fetch news (title, description, source, date, image)

🏗️ Application Flows
🔑 Authentication Flow

User registers/logs in via Django REST API.

JWT access + refresh tokens stored securely.

All API calls include Authorization: Bearer <token>.

Auto-refresh tokens on expiry.

📊 Cryptocurrency Data Flow

Fetch data from CoinGecko API.

Convert USD prices → INR via Exchange Rate API.

Show in Home table (sortable by price, symbol, name).

👛 Wallet Flow (MetaMask)

User clicks Connect Wallet.

App fetches wallet address & balances via MetaMask.

Balances converted to USD (CoinGecko) + INR (ExchangeRate API).

Display ETH + token balances in Wallet page.

📰 News Flow

Fetch crypto news from CryptoCompare API.

Display in responsive cards with pagination/infinite scroll.

Auto-adapt theme (light/dark).

🎨 Design & UX

Theme: Light/Dark with smooth transition

Visuals: Floating crypto logos, gradient backgrounds

Responsive: Mobile-first design (Bootstrap grid + CSS media queries)

Animations: Hover effects, loading spinners

🔒 Security

Password hashing + JWT authentication

Access tokens stored in memory, refresh tokens in HTTP-only cookies

CORS configured for APIs

Input validation & XSS protection