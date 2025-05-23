'use client';

import { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import styles from './upload.module.css';
import { FaStar, FaRegStar, FaEye, FaDownload, FaTrash } from 'react-icons/fa';

export default function CalendarUpload() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [calendars, setCalendars] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeView, setActiveView] = useState('upload'); // 'upload' or 'list'
  const [latestCalendar, setLatestCalendar] = useState(null);
  const [debugInfo, setDebugInfo] = useState(null);

  // Function to fetch calendars
  const fetchCalendars = async () => {
    setIsLoading(true);
    setError('');
    try {
      console.log('Fetching calendars...');
      const response = await fetch('/.netlify/functions/list-calendars');
      const data = await response.json();
      
      if (response.ok) {
        setCalendars(data.calendars || []);
        setDebugInfo(
          `Found ${data.calendars?.length || 0} calendars. ` +
            (data.message ? `Message: ${data.message}` : '')
        );
      } else {
        throw new Error(data.error || 'Failed to fetch calendars');
      }
    } catch (err) {
      console.error('Error fetching calendars:', err);
      setError(err.message || 'Failed to fetch calendars');
      setDebugInfo(`Error: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to fetch latest calendar
  const fetchLatestCalendar = async () => {
    try {
      console.log('Fetching latest calendar...');
      const response = await fetch('/.netlify/functions/get-calendar');
      const data = await response.json();

      console.log('Latest calendar data:', data);

      if (response.ok) {
        setLatestCalendar(data);
      } else {
        // No calendars yet - that's ok
        setLatestCalendar(null);
      }
    } catch (err) {
      console.error('Error fetching latest calendar:', err);
      setLatestCalendar(null);
    }
  };

  // Function to delete a calendar
  const deleteCalendar = async (key) => {
    if (!window.confirm('Are you sure you want to delete this calendar?')) {
      return;
    }

    try {
      console.log(`Deleting calendar with key: ${key}`);
      const response = await fetch(
        `/.netlify/functions/delete-calendar/${key}`,
        {
          method: 'DELETE',
        }
      );

      const data = await response.json();
      console.log('Delete response:', data);

      if (response.ok) {
        setSuccess('Calendar deleted successfully');
        // Refresh the calendars list
        fetchCalendars();
        fetchLatestCalendar();
      } else {
        throw new Error(data.error || 'Failed to delete calendar');
      }
    } catch (err) {
      console.error('Error deleting calendar:', err);
      setError(err.message || 'Failed to delete calendar');
    }
  };

  // Load calendars when logged in and view changes to list
  useEffect(() => {
    if (isLoggedIn && activeView === 'list') {
      fetchCalendars();
    }
  }, [isLoggedIn, activeView]);

  // Load latest calendar when logged in
  useEffect(() => {
    if (isLoggedIn) {
      fetchCalendars();
      fetchLatestCalendar();
    }
  }, [isLoggedIn]);

  // Clear success message after 5 seconds
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        setSuccess('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  const onDrop = useCallback(
    async (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (!file) return;

      // Check if file is PDF or image
      if (!file.type.match(/^(application\/pdf|image\/(jpeg|png|jpg))$/)) {
        setError('Please upload a PDF or image file (JPEG, PNG)');
        return;
      }

      setIsUploading(true);
      setError('');
      setSuccess('');

      const formData = new FormData();
      formData.append('file', file);

      try {
        console.log(
          `Uploading file: ${file.name}, type: ${file.type}, size: ${file.size} bytes`
        );
        const response = await fetch('/.netlify/functions/upload', {
          method: 'POST',
          body: formData,
        });

        const data = await response.json();
        console.log('Upload response:', data);

        if (response.ok) {
          setSuccess(`File uploaded successfully for ${data.monthYear}`);
          // Update latest calendar after successful upload
          fetchLatestCalendar();

          // Always refresh the list after upload
          fetchCalendars();
        } else {
          throw new Error(data.error || 'Upload failed');
        }
      } catch (err) {
        console.error('Error uploading file:', err);
        setError(err.message || 'Failed to upload file');
      } finally {
        setIsUploading(false);
      }
    },
    [activeView]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
    },
    maxFiles: 1,
  });

  const handleLogin = (e) => {
    e.preventDefault();
    if (username === 'chief' && password === 'current2025!') {
      setIsLoggedIn(true);
      setError('');
    } else {
      setError('Invalid credentials');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername('');
    setPassword('');
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  if (!isLoggedIn) {
    return (
      <div className={styles.loginSplitContainer}>
        <div className={styles.loginImageSection}>
          <img src="/valdosta-mural.jpeg" alt="Greetings from Downtown Valdosta mural" className={styles.loginImage} />
        </div>
        <div className={styles.loginFormSection}>
          <div className={styles.loginFormBox}>
            <h2 className={styles.loginTitle}>Login</h2>
            <p className={styles.loginSubtitle}>Enter your credentials to proceed</p>
            {error && <div className={styles.error}>{error}</div>}
            <form onSubmit={handleLogin}>
              <div className={styles.formGroup}>
                <label htmlFor="username" className={styles.loginLabel}>Username</label>
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className={styles.loginInput}
                  autoComplete="username"
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="password" className={styles.loginLabel}>Password</label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className={styles.loginInput}
                  autoComplete="current-password"
                />
              </div>
              <button type="submit" className={styles.loginButton}>Login</button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header} style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
        <button onClick={handleLogout} className={styles.logoutButton}>
          Logout
        </button>
      </div>

      {error && <div className={styles.error}>{error}</div>}
      {success && <div className={styles.success}>{success}</div>}

      {/* Calendar List Section */}
      <div className={styles.calendarList}>
        <h2>All Calendars</h2>
        {isLoading ? (
          <div className={styles.loading}>Loading calendars...</div>
        ) : calendars.length === 0 ? (
          <div className={styles.noCalendars}>
            No calendars found
            {debugInfo && (
              <div className={styles.debugInfo}>
                <p>{debugInfo}</p>
                <button
                  onClick={fetchCalendars}
                  className={styles.refreshButton}
                >
                  Refresh
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className={styles.calendarsGrid}>
            <table className={styles.calendarsTable}>
              <thead>
                <tr>
                  <th>Original Filename</th>
                  <th>Uploaded</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {calendars.map((calendar) => (
                  <tr key={calendar.id}>
                    <td>{calendar.original_filename}</td>
                    <td>{formatDate(calendar.uploaded_at)}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                        {calendar.is_current ? (
                          <span title="Current" className={styles.currentBadge} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                            <FaStar style={{ color: '#13c2c2' }} /> Current
                          </span>
                        ) : (
                          <button
                            title="Set as Current"
                            onClick={async () => {
                              await fetch(
                                '/.netlify/functions/set-current-calendar',
                                {
                                  method: 'POST',
                                  headers: {
                                    'Content-Type': 'application/json',
                                  },
                                  body: JSON.stringify({ id: calendar.id }),
                                }
                              );
                              fetchCalendars();
                              fetchLatestCalendar();
                            }}
                            className={styles.setCurrentButton}
                            style={{ padding: '0.3rem 0.5rem', display: 'flex', alignItems: 'center' }}
                          >
                            <FaRegStar style={{ color: '#2f54eb' }} />
                          </button>
                        )}
                        <a
                          href={calendar.file_url}
                          target='_blank'
                          rel='noopener noreferrer'
                          title="View"
                          className={styles.viewButton}
                          style={{ padding: '0.3rem 0.5rem', display: 'flex', alignItems: 'center' }}
                        >
                          <FaEye style={{ color: '#40a9ff' }} />
                        </a>
                        <a
                          href={calendar.downloadUrl}
                          title="Download"
                          className={styles.downloadButton}
                          style={{ padding: '0.3rem 0.5rem', display: 'flex', alignItems: 'center' }}
                        >
                          <FaDownload style={{ color: '#52c41a' }} />
                        </a>
                        <button
                          title="Delete"
                          onClick={() => deleteCalendar(calendar.id)}
                          className={styles.deleteButton}
                          style={{ padding: '0.3rem 0.5rem', display: 'flex', alignItems: 'center' }}
                        >
                          <FaTrash style={{ color: '#ff7875' }} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Upload Section */}
      <div className={styles.uploadBox}>
        <h2>Upload Calendar</h2>
        <div
          {...getRootProps()}
          className={`${styles.dropzone} ${isDragActive ? styles.active : ''}`}
        >
          <input {...getInputProps()} />
          {isUploading ? (
            <p>Uploading...</p>
          ) : isDragActive ? (
            <p>Drop the file here...</p>
          ) : (
            <div className={styles.uploadPrompt}>
              <p>
                Drag and drop a PDF or image file here, or click to select
              </p>
              <p className={styles.supportedFormats}>
                Supported formats: PDF, JPEG, PNG
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}