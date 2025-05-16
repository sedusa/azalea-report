// upload.js - Upload a calendar file

const { writeFileSync, mkdirSync, existsSync, readFileSync } = require('fs');
const { join } = require('path');
const { v4: uuid } = require('uuid');

// Set up the storage directory in the Netlify Functions tmp folder
const STORAGE_DIR = join('/tmp', 'calendar-uploads');

// Ensure the storage directory exists
if (!existsSync(STORAGE_DIR)) {
  try {
    mkdirSync(STORAGE_DIR, { recursive: true });
  } catch (err) {
    console.error('Failed to create storage directory:', err);
  }
}

// Helper to get file paths
const getFilePath = (key) => join(STORAGE_DIR, `${key}`);
const getMetadataPath = () => join(STORAGE_DIR, 'latest-upload.json');
const getAllCalendarsPath = () => join(STORAGE_DIR, 'all-calendars.json');

exports.handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    // Parse the multipart form data
    const formData = await parseMultipartForm(event);
    const file = formData.file;

    if (!file) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'No file provided' })
      };
    }

    const monthYear = new Date().toLocaleString('default', {
      month: 'long',
      year: 'numeric',
    });

    // Generate a unique key for the file
    const key = uuid();
    const filePath = getFilePath(key);

    // Save the file
    writeFileSync(filePath, file.buffer);

    // Create a URL (this will be a function URL that serves the file)
    const url = `/.netlify/functions/serve-file/${key}`;

    // Create metadata
    const metadata = {
      monthYear,
      fileUrl: url,
      fileKey: key,
      contentType: file.contentType,
      originalFilename: file.filename,
      uploadedAt: new Date().toISOString(),
    };

    // Save metadata as the latest upload
    writeFileSync(getMetadataPath(), JSON.stringify(metadata));

    // Add to all calendars list
    let allCalendars = [];
    const allCalendarsPath = getAllCalendarsPath();
    
    if (existsSync(allCalendarsPath)) {
      try {
        const allCalendarsData = readFileSync(allCalendarsPath, 'utf8');
        allCalendars = JSON.parse(allCalendarsData);
      } catch (err) {
        console.error('Error reading all calendars:', err);
      }
    }
    
    // Add the new calendar to the list
    allCalendars.push(metadata);
    
    // Sort by uploadedAt in descending order (newest first)
    allCalendars.sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt));
    
    // Save the updated list
    writeFileSync(allCalendarsPath, JSON.stringify(allCalendars));

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: 'File uploaded successfully',
        monthYear,
        url,
      })
    };
  } catch (error) {
    console.error('Upload error:', error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        error: error.message || 'Failed to upload file' 
      })
    };
  }
};

// Helper function to parse multipart form data
async function parseMultipartForm(event) {
  const boundary = event.headers['content-type'].split('boundary=')[1];
  const body = Buffer.from(event.body, 'base64');
  const parts = body.toString().split(`--${boundary}`);

  const formData = {};

  for (const part of parts) {
    if (part.includes('Content-Disposition: form-data')) {
      const [header, ...content] = part.split('\r\n\r\n');
      const name = header.match(/name="([^"]+)"/)?.[1];

      if (name) {
        if (header.includes('filename=')) {
          const filename = header.match(/filename="([^"]+)"/)?.[1] || 'unnamed_file';
          const contentTypeMatch = header.match(/Content-Type: ([^\r\n]+)/);
          const contentType = contentTypeMatch ? contentTypeMatch[1] : 'application/octet-stream';
          const buffer = Buffer.from(content.join('\r\n\r\n').trim());

          formData[name] = {
            filename,
            contentType,
            buffer,
          };
        } else {
          formData[name] = content.join('\r\n\r\n').trim();
        }
      }
    }
  }

  return formData;
}