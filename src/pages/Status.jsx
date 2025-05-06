import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Status.module.css';

const Status = () => {
  const [complaints, setComplaints] = useState([]);
  const navigate = useNavigate();
  const [grievanceId, setGrievanceId] = useState('');
  const [grievance, setGrievance] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const session = JSON.parse(sessionStorage.getItem('session'));
    if (!session || session.role !== 'user') {
      navigate('/login');
    }
    const stored = JSON.parse(localStorage.getItem('complaints') || '[]');
    setComplaints(stored);
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setGrievance(null);

    try {
      const response = await fetch(`http://localhost:5000/api/grievances/${grievanceId}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch grievance status');
      }

      setGrievance(data);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className={styles.statusContainer}>
      <h1 className={styles.statusTitle}>Track Complaint Status</h1>
      {complaints.length === 0 ? (
        <p>No complaints submitted yet.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th>Date</th>
              <th>Description</th>
              <th>Location</th>
              <th>Issue Type</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {complaints.map((c) => (
              <tr key={c.id} style={{ borderBottom: '1px solid #ccc' }}>
                <td>{c.date}</td>
                <td>{c.description}</td>
                <td>{c.location}</td>
                <td>{c.issueType}</td>
                <td>{c.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <form onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label htmlFor="grievanceId">Grievance ID</label>
          <input
            type="text"
            id="grievanceId"
            value={grievanceId}
            onChange={(e) => setGrievanceId(e.target.value)}
            required
          />
        </div>
        <button type="submit" className={styles.submitButton}>
          Check Status
        </button>
      </form>

      {error && <p className={styles.errorMessage}>{error}</p>}

      {grievance && (
        <div className={styles.statusResult}>
          <h3>Grievance Details</h3>
          <p><strong>ID:</strong> {grievance.id}</p>
          <p><strong>Subject:</strong> {grievance.subject}</p>
          <p><strong>Description:</strong> {grievance.description}</p>
          <p><strong>Status:</strong> {grievance.status}</p>
          <p><strong>Submitted On:</strong> {new Date(grievance.createdAt).toLocaleDateString()}</p>
          {grievance.updatedAt && (
            <p><strong>Last Updated:</strong> {new Date(grievance.updatedAt).toLocaleDateString()}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Status; 