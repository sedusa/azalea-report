// serve-file.js - Function to serve uploaded files

const { readFileSync, existsSync } = require('fs');
const { join } = require('path');

// Set up the storage directory in the Netlify Functions tmp folder
const STORAGE_DIR = join('/tmp', 'calendar-uploads');
const getFilePath = (key) => join(STORAGE_DIR, `${key}`);
const getMetadataPath = () => join(STORAGE_DIR, 'latest-upload.json');

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
    
    // Try to get content type from metadata if this is the latest file
    if (existsSync(getMetadataPath())) {
      try {
        const metadataStr = readFileSync(getMetadataPath(), 'utf8');
        const metadata = JSON.parse(metadataStr);
        
        if (metadata.fileKey === key && metadata.contentType) {
          contentType = metadata.contentType;
        }
      } catch (err) {
        console.error('Error reading metadata:', err);
      }
    }
    
    // Read the file
    const fileData = readFileSync(filePath);
    
    // Return the file with appropriate headers
    return {
      statusCode: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': 'inline',
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