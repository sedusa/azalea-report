// delete-calendar.js - Delete a calendar

const { readFileSync, writeFileSync, existsSync, unlinkSync } = require('fs');
const { join } = require('path');

// Set up the storage directory in the Netlify Functions tmp folder
const STORAGE_DIR = join('/tmp', 'calendar-uploads');
const getFilePath = (key) => join(STORAGE_DIR, `${key}`);
const getMetadataPath = () => join(STORAGE_DIR, 'latest-upload.json');
const getAllCalendarsPath = () => join(STORAGE_DIR, 'all-calendars.json');

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
    
    const filePath = getFilePath(key);
    
    // Check if the file exists
    if (!existsSync(filePath)) {
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
    
    // Delete the file
    unlinkSync(filePath);
    
    // Update all calendars list
    const allCalendarsPath = getAllCalendarsPath();
    if (existsSync(allCalendarsPath)) {
      try {
        const allCalendarsStr = readFileSync(allCalendarsPath, 'utf8');
        let allCalendars = JSON.parse(allCalendarsStr);
        
        // Remove this calendar from the list
        allCalendars = allCalendars.filter(cal => cal.fileKey !== key);
        
        // Save the updated list
        writeFileSync(allCalendarsPath, JSON.stringify(allCalendars));
        
        // If there are no more calendars, delete the file
        if (allCalendars.length === 0) {
          unlinkSync(allCalendarsPath);
        }
      } catch (err) {
        console.error('Error updating all calendars list:', err);
      }
    }
    
    // Check if this was the latest calendar
    const metadataPath = getMetadataPath();
    if (existsSync(metadataPath)) {
      try {
        const metadataStr = readFileSync(metadataPath, 'utf8');
        const metadata = JSON.parse(metadataStr);
        
        if (metadata.fileKey === key) {
          // This was the latest calendar, get the next latest from all calendars
          if (existsSync(allCalendarsPath)) {
            const allCalendarsStr = readFileSync(allCalendarsPath, 'utf8');
            const allCalendars = JSON.parse(allCalendarsStr);
            
            if (allCalendars.length > 0) {
              // The first calendar in the list is the most recent
              writeFileSync(metadataPath, JSON.stringify(allCalendars[0]));
            } else {
              // No more calendars, delete the latest-upload.json
              unlinkSync(metadataPath);
            }
          } else {
            // No more calendars, delete the latest-upload.json
            unlinkSync(metadataPath);
          }
        }
      } catch (err) {
        console.error('Error updating latest calendar metadata:', err);
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