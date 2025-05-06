import React, { useRef } from 'react';
import styles from './FileUpload.module.css';

const FileUpload = ({ onFileSelect }) => {
  const fileInputRef = useRef();

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      onFileSelect(e.target.files[0]);
    }
  };

  return (
    <div className={styles.uploadContainer}>
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleFileChange}
        className={styles.fileInput}
      />
    </div>
  );
};

export default FileUpload; 