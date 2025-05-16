// list-calendars.js - List all uploaded calendars

const { readFileSync, existsSync } = require('fs');
const { join } = require('path');

// Set up the storage directory in the Netlify Functions tmp folder
const STORAGE_DIR = join('/tmp', 'calendar-uploads');
const getAllCalendarsPath = () => join(STORAGE_DIR, 'all-calendars.json');

exports.handler = async (event, context) => {
  try {
    const allCalendarsPath = getAllCalendarsPath();
    
    // Check if calendars list exists
    if (!existsSync(allCalendarsPath)) {
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
    
    // Read the calendars list
    const allCalendarsStr = readFileSync(allCalendarsPath, 'utf8');
    let calendars = [];
    
    try {
      calendars = JSON.parse(allCalendarsStr);
      
      // Verify file existence and add list-specific properties
      calendars = calendars.map(calendar => {
        const filePath = join(STORAGE_DIR, calendar.fileKey);
        const exists = existsSync(filePath);
        
        return {
          ...calendar,
          exists,
          // Add download URL variant
          downloadUrl: `${calendar.fileUrl}?download=true`
        };
      }).filter(calendar => calendar.exists); // Only include calendars that still exist
    } catch (err) {
      console.error('Error parsing calendars list:', err);
    }
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        calendars
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