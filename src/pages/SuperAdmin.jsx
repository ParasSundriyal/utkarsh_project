import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './SuperAdmin.module.css';

const SuperAdmin = () => {
  const [admins, setAdmins] = useState([]);
  const [error, setError] = useState('');
  const [newAdmin, setNewAdmin] = useState({
    email: '',
    password: '',
    name: '',
  });
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    fetchAdmins();
  }, [navigate]);

  const fetchAdmins = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/admins', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch admins');
      }

      setAdmins(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleInputChange = (e) => {
    setNewAdmin({
      ...newAdmin,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddAdmin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('http://localhost:5000/api/admins', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(newAdmin),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to add admin');
      }

      setNewAdmin({ email: '', password: '', name: '' });
      fetchAdmins();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this admin?')) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/admins/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to delete admin');
      }

      fetchAdmins();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className={styles.superAdminContainer}>
      <h1 className={styles.superAdminTitle}>Super Admin Dashboard</h1>
      {error && <p className={styles.errorMessage}>{error}</p>}

      <div className={styles.addAdminForm}>
        <h2 className={styles.formTitle}>Add New Admin</h2>
        <form onSubmit={handleAddAdmin}>
          <div className={styles.formGroup}>
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={newAdmin.name}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={newAdmin.email}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={newAdmin.password}
              onChange={handleInputChange}
              required
            />
          </div>
          <button type="submit" className={styles.addButton}>
            Add Admin
          </button>
        </form>
      </div>

      <div className={styles.adminList}>
        {admins.map((admin) => (
          <div key={admin.id} className={styles.adminCard}>
            <div className={styles.adminHeader}>
              <span className={styles.adminId}>ID: {admin.id}</span>
            </div>
            <div className={styles.adminDetails}>
              <p><strong>Name:</strong> {admin.name}</p>
              <p><strong>Email:</strong> {admin.email}</p>
            </div>
            <div className={styles.adminActions}>
              <button
                onClick={() => handleDelete(admin.id)}
                className={`${styles.actionButton} ${styles.deleteButton}`}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SuperAdmin; 