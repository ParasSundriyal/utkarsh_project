import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => (
  <div style={{
    minHeight: '80vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#222',
    color: '#fff',
    borderRadius: '10px',
    margin: '2rem',
    padding: '2rem',
  }}>
    <h1 style={{ fontSize: '3rem', marginBottom: '1rem', textAlign: 'center' }}>Welcome to Snap & Solve</h1>
    <p style={{ fontSize: '1.2rem', marginBottom: '2rem', textAlign: 'center' }}>
      AI-based citizen grievance redressal platform.
    </p>
    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
      <Link to="/login" style={{
        background: '#3498db',
        color: '#fff',
        padding: '0.75rem 2rem',
        borderRadius: '5px',
        textDecoration: 'none',
        fontWeight: 600,
        fontSize: '1.1rem',
        transition: 'background 0.2s',
      }}>Login</Link>
      <Link to="/signup" style={{
        background: '#2ecc71',
        color: '#fff',
        padding: '0.75rem 2rem',
        borderRadius: '5px',
        textDecoration: 'none',
        fontWeight: 600,
        fontSize: '1.1rem',
        transition: 'background 0.2s',
      }}>Sign Up</Link>
      <Link to="/status" style={{
        background: '#f1c40f',
        color: '#222',
        padding: '0.75rem 2rem',
        borderRadius: '5px',
        textDecoration: 'none',
        fontWeight: 600,
        fontSize: '1.1rem',
        transition: 'background 0.2s',
      }}>Check Status</Link>
    </div>
  </div>
);

export default Home; 