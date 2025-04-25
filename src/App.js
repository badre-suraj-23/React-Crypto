import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Home from './MyComponents/home';
import Wallet from './MyComponents/wallet';
import Navbar from './MyComponents/navbar';
import { ThemeProvider } from './context/ThemeContext';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/wallet" element={<Wallet />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
