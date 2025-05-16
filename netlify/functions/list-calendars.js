const { getStore } = require('@netlify/blobs');

exports.handler = async (event, context) => {
  try {
    // Initialize the blob store with the namespace
    const store = getStore({
      name: 'calendar-uploads',
      siteID: process.env.NETLIFY_SITE_ID,
      token: process.env.NETLIFY_API_TOKEN
    });

    // List all blobs in the store, excluding metadata
    const blobs = await store.list();
    
    // Filter out the latest-upload metadata entry
    const fileKeys = blobs.blobs
      .filter(blob => blob.key !== 'latest-upload')
      .map(blob => blob.key);
    
    if (fileKeys.length === 0) {
      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          calendars: [],
          message: 'No calendars found'
        })
      };
    }

    // Get metadata for each file
    const calendars = await Promise.all(fileKeys.map(async (key) => {
      try {
        // Get metadata from the blob
        const metadata = await store.getMetadata(key);
        
        // Generate a URL for the file that expires in 1 hour
        const url = await store.getURL(key, { expiresIn: 3600 });
        
        return {
          key,
          monthYear: metadata.metadata.monthYear,
          originalFilename: metadata.metadata.originalFilename,
          uploadedAt: metadata.metadata.uploadedAt,
          url
        };
      } catch (err) {
        console.error(`Error fetching metadata for ${key}:`, err);
        return {
          key,
          error: 'Failed to retrieve metadata'
        };
      }
    }));

    // Sort calendars by uploadedAt date (newest first)
    const sortedCalendars = calendars
      .filter(cal => !cal.error)
      .sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt));

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        calendars: sortedCalendars
      })
    };
  } catch (error) {
    console.error('Error listing calendars:', error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        error: 'Failed to list calendars' 
      })
    };
  }
};