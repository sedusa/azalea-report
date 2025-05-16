const { getStore } = require('@netlify/blobs');

exports.handler = async (event, context) => {
  try {
    // Initialize the blob store with the namespace
    const store = getStore({
      name: 'calendar-uploads',
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
    
    // Generate a fresh URL for the file that will be valid for the next hour
    const freshUrl = await store.getURL(metadata.fileKey, { expiresIn: 3600 });
    
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