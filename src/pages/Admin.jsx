import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const departments = ['Public Works', 'Sanitation', 'Water Supply', 'Electricity', 'Other'];
const statuses = ['Pending', 'In Progress', 'Resolved'];

const Admin = () => {
  const [complaints, setComplaints] = useState([]);
  const [filterStatus, setFilterStatus] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [status, setStatus] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const session = JSON.parse(sessionStorage.getItem('session'));
    if (!session || session.role !== 'admin') {
      navigate('/login');
    }
    fetchComplaints();
  }, [navigate]);

  const fetchComplaints = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/complaints', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch complaints');
      }

      const data = await response.json();
      setComplaints(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (complaintId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/complaints/${complaintId}/status`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status })
      });

      if (!response.ok) {
        throw new Error('Failed to update status');
      }

      await fetchComplaints();
      setSelectedComplaint(null);
      setStatus('');
    } catch (err) {
      setError(err.message);
    }
  };

  // Analytics
  const statusCounts = statuses.reduce((acc, st) => {
    acc[st] = complaints.filter((c) => c.status === st).length;
    return acc;
  }, {});
  const departmentCounts = departments.reduce((acc, dep) => {
    acc[dep] = complaints.filter((c) => c.department === dep).length;
    return acc;
  }, {});

  // Filtering
  const filteredComplaints = complaints.filter((c) => {
    return (
      (!filterStatus || c.status === filterStatus) &&
      (!filterDepartment || c.department === filterDepartment) &&
      (!search ||
        c.description.toLowerCase().includes(search.toLowerCase()) ||
        c.location.toLowerCase().includes(search.toLowerCase()) ||
        c.issueType.toLowerCase().includes(search.toLowerCase()))
    );
  });

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        {error}
      </div>
    );
  }

  return (
    <div>
      <h2 className="mb-4">Admin Dashboard</h2>
      {/* Analytics */}
      <div style={{ margin: '1rem 0', display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
        <div>
          <strong>Status Counts:</strong>
          <ul>
            {statuses.map((st) => (
              <li key={st}>{st}: {statusCounts[st]}</li>
            ))}
          </ul>
        </div>
        <div>
          <strong>Department Counts:</strong>
          <ul>
            {departments.map((dep) => (
              <li key={dep}>{dep}: {departmentCounts[dep]}</li>
            ))}
          </ul>
        </div>
      </div>
      {/* Filters */}
      <div style={{ margin: '1rem 0', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
          <option value="">All Statuses</option>
          {statuses.map(st => <option key={st} value={st}>{st}</option>)}
        </select>
        <select value={filterDepartment} onChange={e => setFilterDepartment(e.target.value)}>
          <option value="">All Departments</option>
          {departments.map(dep => <option key={dep} value={dep}>{dep}</option>)}
        </select>
        <input
          type="text"
          placeholder="Search by description, location, or issue type"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>
      {filteredComplaints.length === 0 ? (
        <div className="alert alert-info" role="alert">
          No complaints to manage.
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped table-hover">
            <thead>
              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Description</th>
                <th>Status</th>
                <th>Submitted On</th>
                <th>Last Updated</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredComplaints.map((complaint) => (
                <tr key={complaint._id}>
                  <td>{complaint._id}</td>
                  <td>{complaint.title}</td>
                  <td>{complaint.description}</td>
                  <td>
                    <span className={`badge bg-${getStatusColor(complaint.status)}`}>
                      {complaint.status}
                    </span>
                  </td>
                  <td>{new Date(complaint.createdAt).toLocaleDateString()}</td>
                  <td>{new Date(complaint.updatedAt).toLocaleDateString()}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-primary"
                      onClick={() => {
                        setSelectedComplaint(complaint);
                        setStatus(complaint.status);
                      }}
                    >
                      Update Status
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selectedComplaint && (
        <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Update Complaint Status</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => {
                    setSelectedComplaint(null);
                    setStatus('');
                  }}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label htmlFor="status" className="form-label">Status</label>
                  <select
                    className="form-select"
                    id="status"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                  >
                    <option value="">Select Status</option>
                    <option value="pending">Pending</option>
                    <option value="in progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setSelectedComplaint(null);
                    setStatus('');
                  }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => handleStatusUpdate(selectedComplaint._id)}
                  disabled={!status}
                >
                  Update
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

function getStatusColor(status) {
  switch (status.toLowerCase()) {
    case 'pending':
      return 'warning';
    case 'in progress':
      return 'info';
    case 'resolved':
      return 'success';
    case 'rejected':
      return 'danger';
    default:
      return 'secondary';
  }
}

export default Admin; 