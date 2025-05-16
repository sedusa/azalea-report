// get-calendar.js - Get the latest calendar

const { readFileSync, existsSync } = require('fs');
const { join } = require('path');

// Set up the storage directory in the Netlify Functions tmp folder
const STORAGE_DIR = join('/tmp', 'calendar-uploads');
const getMetadataPath = () => join(STORAGE_DIR, 'latest-upload.json');

exports.handler = async (event, context) => {
  try {
    const metadataPath = getMetadataPath();
    
    // Check if metadata exists
    if (!existsSync(metadataPath)) {
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
    
    // Read metadata
    const metadataStr = readFileSync(metadataPath, 'utf8');
    const metadata = JSON.parse(metadataStr);
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        monthYear: metadata.monthYear,
        url: metadata.fileUrl,
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