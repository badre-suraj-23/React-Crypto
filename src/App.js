import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Home from './MyComponents/home';
import Cryptocurrency from './MyComponents/Cryptocurrency';
import Wallet from './MyComponents/wallet';
import Navbar from './MyComponents/navbar';
import Footer from './MyComponents/Footer';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import News from './MyComponents/News';
import FloatingLogos from './MyComponents/FloatingLogos'; // Import the floating animation component

// ✅ Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user, authChecked } = useAuth();
  const location = useLocation();
  
  if (!authChecked) {
    return (
      <div className="container d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }
  
  return user ? children : <Navigate to="/login" state={{ from: location }} replace />;
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="d-flex flex-column min-vh-100">
            <FloatingLogos /> {/* Add the floating animation */}
            <Navbar />
            <main className="flex-grow-1" style={{ position: 'relative', zIndex: 1 }}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/cryptocurrency" element={<Cryptocurrency />} />
                <Route 
                  path="/wallet" 
                  element={
                    <ProtectedRoute>
                      <Wallet />
                    </ProtectedRoute>
                  } 
                />
                <Route path="/news" element={<News />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;