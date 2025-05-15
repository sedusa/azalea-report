const { getStore } = require('@netlify/blobs');
const { v4: uuid } = require('uuid');

exports.handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    // Get the blob store using the context
    const store = getStore('calendar-uploads', {
      siteID: process.env.NETLIFY_SITE_ID,
      token: process.env.NETLIFY_API_TOKEN
    });

    console.log('Site ID:', process.env.NETLIFY_SITE_ID);
    console.log('Token:', process.env.NETLIFY_API_TOKEN);

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

    // Upload file to Netlify Blobs
    await store.set(key, file.buffer, {
      metadata: {
        contentType: file.contentType,
        monthYear: monthYear,
        originalFilename: file.filename,
        uploadedAt: new Date().toISOString(),
      },
    });

    // Get the URL for the uploaded file
    const url = await store.getURL(key);

    // Store metadata in a separate blob
    const metadata = {
      monthYear,
      fileUrl: url,
      filename: key,
      originalFilename: file.filename,
      uploadedAt: new Date().toISOString(),
    };

    // Store the latest upload metadata
    await store.set('latest-upload', JSON.stringify(metadata));

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

// Helper function to parse multipart form data
async function parseMultipartForm(event) {
  const boundary = event.headers['content-type'].split('boundary=')[1];
  const body = Buffer.from(event.body, 'base64');
  const parts = body.toString().split(`--${boundary}`);

  const formData = {};

  for (const part of parts) {
    if (part.includes('Content-Disposition: form-data')) {
      const [header, ...content] = part.split('\r\n\r\n');
      const name = header.match(/name="([^"]+)"/)[1];

      if (header.includes('filename=')) {
        const filename = header.match(/filename="([^"]+)"/)[1];
        const contentType = header.match(/Content-Type: ([^\r\n]+)/)[1];
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

  return formData;
}
