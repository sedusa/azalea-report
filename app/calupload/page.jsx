'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import styles from './upload.module.css';

export default function CalendarUpload() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isUploading, setIsUploading] = useState(false);

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
                        <button type="submit">Login</button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.uploadBox}>
                <h2>Upload Calendar</h2>
                {error && <div className={styles.error}>{error}</div>}
                {success && <div className={styles.success}>{success}</div>}
                
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
        </div>
    );
} 