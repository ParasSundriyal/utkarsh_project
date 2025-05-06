import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Navbar({ isAuthenticated, userRole }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <div className="container">
        <Link className="navbar-brand" to="/">Snap & Solve</Link>
        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/">Home</Link>
            </li>
            {isAuthenticated && (
              <li className="nav-item">
                <Link className="nav-link" to="/status">Track Status</Link>
              </li>
            )}
            {isAuthenticated && userRole === 'admin' && (
              <li className="nav-item">
                <Link className="nav-link" to="/admin">Admin Dashboard</Link>
              </li>
            )}
            {isAuthenticated && userRole === 'super_admin' && (
              <li className="nav-item">
                <Link className="nav-link" to="/super-admin">Super Admin</Link>
              </li>
            )}
          </ul>
          <div className="navbar-nav">
            {!isAuthenticated ? (
              <>
                <Link className="nav-link" to="/login">Login</Link>
                <Link className="nav-link" to="/signup">Sign Up</Link>
              </>
            ) : (
              <button 
                className="btn btn-outline-light" 
                onClick={handleLogout}
              >
                Logout
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar; 