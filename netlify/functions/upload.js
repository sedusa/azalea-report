// upload.js - Fixed version with better debugging

const { writeFileSync, mkdirSync, existsSync, readFileSync } = require('fs');
const { join } = require('path');
const { v4: uuid } = require('uuid');

// Set up the storage directory in the Netlify Functions tmp folder
const STORAGE_DIR = join('/tmp', 'calendar-uploads');

// Ensure the storage directory exists
if (!existsSync(STORAGE_DIR)) {
  try {
    console.log(`Creating directory: ${STORAGE_DIR}`);
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
  console.log("Upload function called");
  
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    // Parse the multipart form data
    console.log("Parsing multipart form data");
    const formData = await parseMultipartForm(event);
    const file = formData.file;

    if (!file) {
      console.log("No file found in form data");
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'No file provided' })
      };
    }

    console.log(`File received: ${file.filename}, type: ${file.contentType}, size: ${file.buffer.length} bytes`);

    const monthYear = new Date().toLocaleString('default', {
      month: 'long',
      year: 'numeric',
    });

    // Generate a unique key for the file
    const key = uuid();
    const filePath = getFilePath(key);
    console.log(`Saving file to: ${filePath}`);

    // Save the file
    writeFileSync(filePath, file.buffer);
    console.log("File saved successfully");

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
    const metadataPath = getMetadataPath();
    console.log(`Saving latest metadata to: ${metadataPath}`);
    writeFileSync(metadataPath, JSON.stringify(metadata));
    console.log("Latest metadata saved");

    // Add to all calendars list
    let allCalendars = [];
    const allCalendarsPath = getAllCalendarsPath();
    
    if (existsSync(allCalendarsPath)) {
      console.log("all-calendars.json exists, reading it");
      try {
        const allCalendarsData = readFileSync(allCalendarsPath, 'utf8');
        allCalendars = JSON.parse(allCalendarsData);
        console.log(`Found ${allCalendars.length} existing calendars`);
      } catch (err) {
        console.error('Error reading all calendars:', err);
        // Start fresh if the file is corrupted
        allCalendars = [];
      }
    } else {
      console.log("all-calendars.json doesn't exist, creating new list");
    }
    
    // Add the new calendar to the list
    allCalendars.push(metadata);
    console.log(`Now have ${allCalendars.length} calendars total`);
    
    // Sort by uploadedAt in descending order (newest first)
    allCalendars.sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt));
    
    // Save the updated list
    console.log(`Saving updated calendar list to: ${allCalendarsPath}`);
    writeFileSync(allCalendarsPath, JSON.stringify(allCalendars));
    console.log("Calendar list saved");

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
  console.log("Starting to parse multipart form data");
  
  const contentType = event.headers['content-type'] || '';
  if (!contentType.includes('multipart/form-data')) {
    console.error(`Invalid content type: ${contentType}`);
    throw new Error('Invalid content type, expected multipart/form-data');
  }
  
  const boundaryMatch = contentType.match(/boundary=(?:"([^"]+)"|([^;]+))/);
  if (!boundaryMatch) {
    console.error('No boundary found in content-type');
    throw new Error('No boundary found in content-type');
  }
  
  const boundary = boundaryMatch[1] || boundaryMatch[2];
  console.log(`Found boundary: ${boundary}`);
  
  const body = Buffer.from(event.body, 'base64');
  console.log(`Body length: ${body.length} bytes`);
  
  const parts = body.toString().split(`--${boundary}`);
  console.log(`Found ${parts.length} parts`);

  const formData = {};

  for (const part of parts) {
    if (part.includes('Content-Disposition: form-data')) {
      const [header, ...content] = part.split('\r\n\r\n');
      const nameMatch = header.match(/name="([^"]+)"/);
      
      if (!nameMatch) {
        console.log('Part has no name, skipping');
        continue;
      }
      
      const name = nameMatch[1];
      console.log(`Processing part with name: ${name}`);

      if (header.includes('filename=')) {
        const filenameMatch = header.match(/filename="([^"]+)"/);
        const filename = filenameMatch ? filenameMatch[1] : 'unnamed_file';
        
        const contentTypeMatch = header.match(/Content-Type: ([^\r\n]+)/);
        const contentType = contentTypeMatch ? contentTypeMatch[1] : 'application/octet-stream';
        
        const buffer = Buffer.from(content.join('\r\n\r\n').trim());
        
        console.log(`File part: ${filename}, type: ${contentType}, size: ${buffer.length} bytes`);

        formData[name] = {
          filename,
          contentType,
          buffer,
        };
      } else {
        const value = content.join('\r\n\r\n').trim();
        console.log(`Field part: ${name}=${value}`);
        formData[name] = value;
      }
    }
  }

  console.log(`Parsed ${Object.keys(formData).length} form fields`);
  return formData;
}