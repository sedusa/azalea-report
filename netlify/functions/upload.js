const { getStore } = require('@netlify/blobs');
const { v4: uuid } = require('uuid');
const busboy = require('busboy');
const { PassThrough } = require('stream');

exports.handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    // Initialize the blob store with the namespace
    const store = getStore({
      name: 'calendar-uploads',
      siteID: process.env.NETLIFY_SITE_ID,
      token: process.env.NETLIFY_API_TOKEN
    });

    // Parse the multipart form data using busboy
    const { file, fileDetails } = await parseMultipartForm(event);

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

    // Upload file to Netlify Blobs
    // Using the new stream-based API for larger file support
    await store.setStream(key, file, {
      contentType: fileDetails.contentType,
      metadata: {
        monthYear: monthYear,
        originalFilename: fileDetails.filename,
        uploadedAt: new Date().toISOString(),
      },
      expiryTTL: 365 * 24 * 60 * 60, // 1 year in seconds (optional)
    });

    // Get the URL for the uploaded file (valid for 1 hour by default)
    const url = await store.getURL(key, { expiresIn: 3600 });

    // Store metadata in a separate blob
    const metadata = {
      monthYear,
      fileUrl: url,
      fileKey: key,
      originalFilename: fileDetails.filename,
      uploadedAt: new Date().toISOString(),
    };

    // Store the latest upload metadata
    await store.set('latest-upload', JSON.stringify(metadata), {
      contentType: 'application/json',
    });

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: 'File uploaded successfully',
        monthYear,
        url: url,
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

// Helper function to parse multipart form data using busboy
async function parseMultipartForm(event) {
  return new Promise((resolve, reject) => {
    const contentType = event.headers['content-type'] || event.headers['Content-Type'];
    const bb = busboy({ headers: { 'content-type': contentType } });
    
    let fileDetails = {};
    let fileStream = new PassThrough();
    
    bb.on('file', (name, file, info) => {
      const { filename, mimeType } = info;
      
      fileDetails = {
        fieldname: name,
        filename: filename,
        contentType: mimeType
      };
      
      file.pipe(fileStream);
    });
    
    bb.on('finish', () => {
      resolve({ file: fileStream, fileDetails });
    });
    
    bb.on('error', (error) => {
      reject(error);
    });
    
    bb.write(Buffer.from(event.body, 'base64'));
    bb.end();
  });
}