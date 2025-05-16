const { getStore } = require('@netlify/blobs');

exports.handler = async (event, context) => {
  // Only allow DELETE requests
  if (event.httpMethod !== 'DELETE') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    // Get the key from the path parameter
    const key = event.path.split('/').pop();
    
    if (!key) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          error: 'No file key provided' 
        })
      };
    }

    // Get the blob store using the context
    const store = getStore('calendar-uploads', {
      siteID: process.env.NETLIFY_SITE_ID,
      token: process.env.NETLIFY_API_TOKEN
    });

    // Check if the blob exists first
    // Use get instead of head which might not be available
    try {
      const exists = await store.get(key);
      if (!exists) {
        return {
          statusCode: 404,
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ 
            error: 'Calendar not found' 
          })
        };
      }
    } catch (err) {
      // If error, assume not found
      return {
        statusCode: 404,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          error: 'Calendar not found' 
        })
      };
    }

    // Delete the blob
    await store.delete(key);

    // Check if this was the latest calendar
    const latestMetadata = await store.get('latest-upload');
    
    if (latestMetadata) {
      const metadata = JSON.parse(latestMetadata);
      
      // Check if fileKey is available, if not use filename (for backward compatibility)
      const fileKey = metadata.fileKey || metadata.filename;
      
      // If this was the latest calendar, remove the latest-upload blob
      if (fileKey === key) {
        await store.delete('latest-upload');
      }
    }

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        message: 'Calendar deleted successfully' 
      })
    };
  } catch (error) {
    console.error('Error deleting calendar:', error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        error: 'Failed to delete calendar' 
      })
    };
  }
};