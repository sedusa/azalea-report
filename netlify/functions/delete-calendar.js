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

    // Initialize the blob store with the namespace
    const store = getStore({
      name: 'calendar-uploads',
      siteID: process.env.NETLIFY_SITE_ID,
      token: process.env.NETLIFY_API_TOKEN
    });

    // Check if the blob exists first
    const exists = await store.head(key);
    
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

    // Delete the blob
    await store.delete(key);

    // Check if this was the latest calendar
    const latestMetadata = await store.get('latest-upload');
    
    if (latestMetadata) {
      const metadata = JSON.parse(latestMetadata);
      
      // If this was the latest calendar, update the latest-upload blob
      if (metadata.fileKey === key) {
        // List remaining calendars
        const blobs = await store.list();
        const remainingFileKeys = blobs.blobs
          .filter(blob => blob.key !== 'latest-upload')
          .map(blob => blob.key);
        
        if (remainingFileKeys.length > 0) {
          // Get the newest calendar file based on metadata
          const newestCalendar = await Promise.all(remainingFileKeys.map(async (fileKey) => {
            const metadata = await store.getMetadata(fileKey);
            return {
              fileKey,
              uploadedAt: metadata.metadata.uploadedAt,
              monthYear: metadata.metadata.monthYear,
              originalFilename: metadata.metadata.originalFilename
            };
          }))
          .then(calendars => 
            calendars.sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt))[0]
          );
          
          if (newestCalendar) {
            // Update latest-upload with the new latest calendar
            const url = await store.getURL(newestCalendar.fileKey, { expiresIn: 3600 });
            
            const newLatestMetadata = {
              monthYear: newestCalendar.monthYear,
              fileUrl: url,
              fileKey: newestCalendar.fileKey,
              originalFilename: newestCalendar.originalFilename,
              uploadedAt: newestCalendar.uploadedAt
            };
            
            await store.set('latest-upload', JSON.stringify(newLatestMetadata), {
              contentType: 'application/json'
            });
          } else {
            // No more calendars, delete the latest-upload blob
            await store.delete('latest-upload');
          }
        } else {
          // No more calendars, delete the latest-upload blob
          await store.delete('latest-upload');
        }
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