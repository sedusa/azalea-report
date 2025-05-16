'use client';

import { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import styles from './upload.module.css';

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

    // Function to fetch calendars
    const fetchCalendars = async () => {
        setIsLoading(true);
        try {
            const response = await fetch('/.netlify/functions/list-calendars');
            const data = await response.json();

            if (response.ok) {
                setCalendars(data.calendars || []);
            } else {
                throw new Error(data.error || 'Failed to fetch calendars');
            }
        } catch (err) {
            setError(err.message || 'Failed to fetch calendars');
        } finally {
            setIsLoading(false);
        }
    };

    // Function to fetch latest calendar
    const fetchLatestCalendar = async () => {
        try {
            const response = await fetch('/.netlify/functions/get-calendar');
            const data = await response.json();

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
            const response = await fetch(`/.netlify/functions/delete-calendar/${key}`, {
                method: 'DELETE'
            });

            const data = await response.json();

            if (response.ok) {
                setSuccess('Calendar deleted successfully');
                // Refresh the calendars list
                fetchCalendars();
                fetchLatestCalendar();
            } else {
                throw new Error(data.error || 'Failed to delete calendar');
            }
        } catch (err) {
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

    const onDrop = useCallback(async (acceptedFiles) => {
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
            const response = await fetch('/.netlify/functions/upload', {
                method: 'POST',
                body: formData
            });

            const data = await response.json();

            if (response.ok) {
                setSuccess(`File uploaded successfully for ${data.monthYear}`);
                // Update latest calendar after successful upload
                fetchLatestCalendar();
            } else {
                throw new Error(data.error || 'Upload failed');
            }
        } catch (err) {
            setError(err.message || 'Failed to upload file');
        } finally {
            setIsUploading(false);
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'application/pdf': ['.pdf'],
            'image/jpeg': ['.jpg', '.jpeg'],
            'image/png': ['.png']
        },
        maxFiles: 1
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
            <div className={styles.container}>
                <div className={styles.loginBox}>
                    <h2>Login</h2>
                    {error && <div className={styles.error}>{error}</div>}
                    <form onSubmit={handleLogin}>
                        <div className={styles.formGroup}>
                            <label htmlFor="username">Username:</label>
                            <input
                                type="text"
                                id="username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="password">Password:</label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit" className={styles.submitButton}>Login</button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div className={styles.tabs}>
                    <button
                        className={`${styles.tabButton} ${activeView === 'upload' ? styles.activeTab : ''}`}
                        onClick={() => setActiveView('upload')}
                    >
                        Upload Calendar
                    </button>
                    <button
                        className={`${styles.tabButton} ${activeView === 'list' ? styles.activeTab : ''}`}
                        onClick={() => {
                            setActiveView('list');
                            fetchCalendars(); // Refresh calendars when tab is clicked
                        }}
                    >
                        View Calendars
                    </button>
                </div>
                <button onClick={handleLogout} className={styles.logoutButton}>Logout</button>
            </div>

            {error && <div className={styles.error}>{error}</div>}
            {success && <div className={styles.success}>{success}</div>}

            {activeView === 'upload' && (
                <div className={styles.uploadBox}>
                    <h2>Upload Calendar</h2>

                    {latestCalendar && (
                        <div className={styles.latestCalendar}>
                            <h3>Current Calendar: {latestCalendar.monthYear}</h3>
                            <div className={styles.previewContainer}>
                                <a
                                    href={latestCalendar.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={styles.viewButton}
                                >
                                    View Calendar
                                </a>
                                <a
                                    href={`${latestCalendar.url}?download=true`}
                                    className={styles.downloadButton}
                                >
                                    Download
                                </a>
                            </div>
                        </div>
                    )}

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
                                <p>Drag and drop a PDF or image file here, or click to select</p>
                                <p className={styles.supportedFormats}>
                                    Supported formats: PDF, JPEG, PNG
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {activeView === 'list' && (
                <div className={styles.calendarList}>
                    <h2>All Calendars</h2>

                    {isLoading ? (
                        <div className={styles.loading}>Loading calendars...</div>
                    ) : calendars.length === 0 ? (
                        <div className={styles.noCalendars}>No calendars found</div>
                    ) : (
                        <div className={styles.calendarsGrid}>
                            <table className={styles.calendarsTable}>
                                <thead>
                                    <tr>
                                        <th>Month/Year</th>
                                        <th>Original Filename</th>
                                        <th>Uploaded</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {calendars.map((calendar) => (
                                        <tr key={calendar.fileKey}>
                                            <td>{calendar.monthYear}</td>
                                            <td>{calendar.originalFilename}</td>
                                            <td>{formatDate(calendar.uploadedAt)}</td>
                                            <td>
                                                <a
                                                    href={calendar.fileUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className={styles.viewButton}
                                                >
                                                    View
                                                </a>
                                                <a
                                                    href={calendar.downloadUrl}
                                                    className={styles.downloadButton}
                                                >
                                                    Download
                                                </a>
                                                <button
                                                    onClick={() => deleteCalendar(calendar.fileKey)}
                                                    className={styles.deleteButton}
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}