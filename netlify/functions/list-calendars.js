const { getStore } = require('@netlify/blobs');

exports.handler = async (event, context) => {
  try {
    // Get the blob store using the context
    const store = getStore('calendar-uploads', {
      siteID: process.env.NETLIFY_SITE_ID,
      token: process.env.NETLIFY_API_TOKEN
    });

    // List all blobs in the store, excluding metadata
    // Check if list method is available
    let fileKeys = [];
    
    if (typeof store.list === 'function') {
      // If list is available, use it
      const blobs = await store.list();
      fileKeys = blobs.blobs
        .filter(blob => blob.key !== 'latest-upload')
        .map(blob => blob.key);
    } else {
      // If list is not available, we can still get the latest calendar
      const metadataBlob = await store.get('latest-upload');
      if (metadataBlob) {
        const metadata = JSON.parse(metadataBlob);
        // Check if fileKey is available, if not use filename (for backward compatibility)
        const fileKey = metadata.fileKey || metadata.filename;
        if (fileKey) {
          fileKeys = [fileKey];
        }
      }
    }
    
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
        // Get metadata using get since getMetadata might not be available
        // Try to get the blob first to see if it exists
        const blob = await store.get(key);
        if (!blob) {
          return { key, error: 'Blob not found' };
        }
        
        // For metadata, we'll use what we know about the latest calendar
        // since older versions might not support metadata retrieval
        let monthYear, originalFilename, uploadedAt;
        
        // Try to get metadata if latestUpload exists and matches this key
        const latestUpload = await store.get('latest-upload');
        if (latestUpload) {
          const metadata = JSON.parse(latestUpload);
          if ((metadata.fileKey || metadata.filename) === key) {
            monthYear = metadata.monthYear;
            originalFilename = metadata.originalFilename;
            uploadedAt = metadata.uploadedAt;
          }
        }
        
        // Default values if not found
        monthYear = monthYear || 'Unknown Month/Year';
        originalFilename = originalFilename || `calendar-${key}.pdf`;
        uploadedAt = uploadedAt || new Date().toISOString();
        
        // Generate a URL for the file
        const url = await store.getURL(key);
        
        return {
          key,
          monthYear,
          originalFilename,
          uploadedAt,
          url
        };
      } catch (err) {
        console.error(`Error fetching data for ${key}:`, err);
        return {
          key,
          error: 'Failed to retrieve data'
        };
      }
    }));

    // Sort calendars by uploadedAt date (newest first) if available
    const sortedCalendars = calendars
      .filter(cal => !cal.error)
      .sort((a, b) => {
        // If uploadedAt is available, sort by it
        if (a.uploadedAt && b.uploadedAt) {
          return new Date(b.uploadedAt) - new Date(a.uploadedAt);
        }
        return 0; // Keep original order if no dates
      });

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