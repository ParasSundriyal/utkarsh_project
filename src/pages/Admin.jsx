import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Admin.module.css';

const departments = ['Public Works', 'Sanitation', 'Water Supply', 'Electricity', 'Other'];
const statuses = ['Pending', 'In Progress', 'Resolved'];

const Admin = () => {
  const [grievances, setGrievances] = useState([]);
  const [error, setError] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('');
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    fetchGrievances();
  }, [navigate]);

  const fetchGrievances = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/grievances', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch grievances');
      }

      setGrievances(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      const response = await fetch(`http://localhost:5000/api/grievances/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update status');
      }

      fetchGrievances();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this grievance?')) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/grievances/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to delete grievance');
      }

      fetchGrievances();
    } catch (err) {
      setError(err.message);
    }
  };

  // Analytics
  const statusCounts = statuses.reduce((acc, st) => {
    acc[st] = grievances.filter((c) => c.status === st).length;
    return acc;
  }, {});
  const departmentCounts = departments.reduce((acc, dep) => {
    acc[dep] = grievances.filter((c) => c.department === dep).length;
    return acc;
  }, {});

  // Filtering
  const filteredGrievances = grievances.filter((c) => {
    return (
      (!filterStatus || c.status === filterStatus) &&
      (!filterDepartment || c.department === filterDepartment) &&
      (!search ||
        c.description.toLowerCase().includes(search.toLowerCase()) ||
        c.location.toLowerCase().includes(search.toLowerCase()) ||
        c.issueType.toLowerCase().includes(search.toLowerCase()))
    );
  });

  return (
    <div className={styles.adminContainer}>
      <h1 className={styles.adminTitle}>Admin Dashboard</h1>
      {error && <p className={styles.errorMessage}>{error}</p>}
      
      <div className={styles.grievanceList}>
        {filteredGrievances.map((grievance) => (
          <div key={grievance.id} className={styles.grievanceCard}>
            <div className={styles.grievanceHeader}>
              <span className={styles.grievanceId}>ID: {grievance.id}</span>
              <span className={`${styles.grievanceStatus} ${styles[`status${grievance.status}`]}`}>
                {grievance.status}
              </span>
            </div>
            <div className={styles.grievanceDetails}>
              <p><strong>Subject:</strong> {grievance.subject}</p>
              <p><strong>Description:</strong> {grievance.description}</p>
              <p><strong>Submitted On:</strong> {new Date(grievance.createdAt).toLocaleDateString()}</p>
            </div>
            <div className={styles.grievanceActions}>
              <button
                onClick={() => handleStatusUpdate(grievance.id, 'In Progress')}
                className={`${styles.actionButton} ${styles.updateButton}`}
                disabled={grievance.status === 'In Progress'}
              >
                Mark In Progress
              </button>
              <button
                onClick={() => handleStatusUpdate(grievance.id, 'Resolved')}
                className={`${styles.actionButton} ${styles.updateButton}`}
                disabled={grievance.status === 'Resolved'}
              >
                Mark Resolved
              </button>
              <button
                onClick={() => handleDelete(grievance.id)}
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

export default Admin; 