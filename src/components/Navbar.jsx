import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './Navbar.module.css';

const Navbar = () => {
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/login');
  };

  if (!isLoggedIn) return null;

  return (
    <nav className={styles.navbar}>
      <Link to="/status">Check Status</Link>
      {localStorage.getItem('role') === 'admin' && (
        <Link to="/admin">Admin Dashboard</Link>
      )}
      {localStorage.getItem('role') === 'superadmin' && (
        <Link to="/superadmin">Super Admin Dashboard</Link>
      )}
      <button onClick={handleLogout} className={styles.logoutButton}>
        Logout
      </button>
    </nav>
  );
};

export default Navbar; 