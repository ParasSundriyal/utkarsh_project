import React, { useState } from 'react';
import FileUpload from '../components/FileUpload';
import { classifyImage } from '../api/mlApi';

const Submit = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleFileSelect = async (file) => {
    setSelectedFile(file);
    setLoading(true);
    const res = await classifyImage(file);
    setResult(res);
    setLoading(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Store complaint in localStorage for demo
    const complaints = JSON.parse(localStorage.getItem('complaints') || '[]');
    complaints.push({
      id: Date.now(),
      description,
      location,
      image: selectedFile ? selectedFile.name : '',
      issueType: result ? result.issueType : '',
      department: result ? result.department : '',
      status: 'Pending',
      date: new Date().toLocaleString(),
    });
    localStorage.setItem('complaints', JSON.stringify(complaints));
    setSubmitted(true);
    setDescription('');
    setLocation('');
    setSelectedFile(null);
    setResult(null);
  };

  return (
    <div>
      <h1>Submit a Complaint</h1>
      {submitted && <p style={{ color: 'green' }}>Complaint submitted successfully!</p>}
      <form onSubmit={handleSubmit}>
        <FileUpload onFileSelect={handleFileSelect} />
        {loading && <p>Detecting issue type...</p>}
        {result && !loading && (
          <div>
            <h3>Detected Issue: {result.issueType}</h3>
            <p>Confidence: {(result.confidence * 100).toFixed(1)}%</p>
            <p>Suggested Department: {result.department}</p>
          </div>
        )}
        <div style={{ margin: '1rem 0' }}>
          <label>Description:<br />
            <textarea value={description} onChange={e => setDescription(e.target.value)} required rows={3} style={{ width: '100%' }} />
          </label>
        </div>
        <div style={{ margin: '1rem 0' }}>
          <label>Location:<br />
            <input value={location} onChange={e => setLocation(e.target.value)} required style={{ width: '100%' }} />
          </label>
        </div>
        <button type="submit" disabled={loading || !result}>Submit Complaint</button>
      </form>
    </div>
  );
};

export default Submit; 