import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Status from './pages/Status';
import Admin from './pages/Admin';
import SuperAdmin from './pages/SuperAdmin';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('userRole');
    if (token) {
      setIsAuthenticated(true);
      setUserRole(role);
    }
  }, []);

  return (
    <Router>
      <div className="min-vh-100 bg-light">
        <Navbar isAuthenticated={isAuthenticated} userRole={userRole} />
        <div className="container py-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} setUserRole={setUserRole} />} />
            <Route path="/signup" element={<Signup />} />
            <Route 
              path="/status" 
              element={
                isAuthenticated ? 
                <Status /> : 
                <Navigate to="/login" replace />
              } 
            />
            <Route 
              path="/admin" 
              element={
                isAuthenticated && userRole === 'admin' ? 
                <Admin /> : 
                <Navigate to="/login" replace />
              } 
            />
            <Route 
              path="/super-admin" 
              element={
                isAuthenticated && userRole === 'super_admin' ? 
                <SuperAdmin /> : 
                <Navigate to="/login" replace />
              } 
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
