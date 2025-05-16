const { getStore } = require('@netlify/blobs');

exports.handler = async (event, context) => {
  try {
    // Get the blob store using the context with older format
    const store = getStore('calendar-uploads', {
      siteID: process.env.NETLIFY_SITE_ID,
      token: process.env.NETLIFY_API_TOKEN
    });

    // Get the latest upload metadata
    const metadataBlob = await store.get('latest-upload');

    if (!metadataBlob) {
      return {
        statusCode: 404,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          error: 'No calendar found' 
        })
      };
    }

    const metadata = JSON.parse(metadataBlob);
    
    // Generate a fresh URL for the file
    // Check if fileKey is available, if not use filename (for backward compatibility)
    const fileKey = metadata.fileKey || metadata.filename;
    const freshUrl = await store.getURL(fileKey);
    
    // Update the metadata with the fresh URL
    metadata.fileUrl = freshUrl;

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        monthYear: metadata.monthYear,
        url: freshUrl,
        filename: metadata.originalFilename
      })
    };
  } catch (error) {
    console.error('Error fetching calendar:', error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        error: 'Failed to fetch calendar' 
      })
    };
  }
};