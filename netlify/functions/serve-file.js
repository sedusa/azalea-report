// serve-file.js - Function to serve uploaded files

const { readFileSync, existsSync } = require('fs');
const { join } = require('path');

// Set up the storage directory in the Netlify Functions tmp folder
const STORAGE_DIR = join('/tmp', 'calendar-uploads');
const getFilePath = (key) => join(STORAGE_DIR, `${key}`);
const getMetadataPath = () => join(STORAGE_DIR, 'latest-upload.json');
const getAllCalendarsPath = () => join(STORAGE_DIR, 'all-calendars.json');

exports.handler = async (event, context) => {
  try {
    // Get the file key from the path
    const key = event.path.split('/').pop();
    
    if (!key) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'No file key provided' })
      };
    }
    
    const filePath = getFilePath(key);
    
    // Check if the file exists
    if (!existsSync(filePath)) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: 'File not found' })
      };
    }
    
    // Determine content type
    let contentType = 'application/octet-stream'; // Default
    let originalFilename = key;
    
    // Try to get content type from all calendars metadata
    if (existsSync(getAllCalendarsPath())) {
      try {
        const allCalendarsStr = readFileSync(getAllCalendarsPath(), 'utf8');
        const allCalendars = JSON.parse(allCalendarsStr);
        
        const calendar = allCalendars.find(cal => cal.fileKey === key);
        if (calendar) {
          contentType = calendar.contentType || contentType;
          originalFilename = calendar.originalFilename || originalFilename;
        }
      } catch (err) {
        console.error('Error reading all calendars metadata:', err);
      }
    }
    
    // As a fallback, try the latest upload metadata
    if (contentType === 'application/octet-stream' && existsSync(getMetadataPath())) {
      try {
        const metadataStr = readFileSync(getMetadataPath(), 'utf8');
        const metadata = JSON.parse(metadataStr);
        
        if (metadata.fileKey === key) {
          contentType = metadata.contentType || contentType;
          originalFilename = metadata.originalFilename || originalFilename;
        }
      } catch (err) {
        console.error('Error reading latest metadata:', err);
      }
    }
    
    // Read the file
    const fileData = readFileSync(filePath);
    
    // Check the format - if download parameter is present, set as attachment
    const downloadParam = event.queryStringParameters && event.queryStringParameters.download;
    const contentDisposition = downloadParam 
      ? `attachment; filename="${originalFilename}"` 
      : 'inline';
    
    // Return the file with appropriate headers
    return {
      statusCode: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': contentDisposition,
        'Cache-Control': 'public, max-age=300' // Cache for 5 minutes
      },
      body: fileData.toString('base64'),
      isBase64Encoded: true
    };
  } catch (error) {
    console.error('Error serving file:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to serve file' })
    };
  }
};