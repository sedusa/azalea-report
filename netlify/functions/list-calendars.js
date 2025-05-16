// list-calendars.js - Fixed version with better debugging

const { readFileSync, existsSync } = require('fs');
const { join } = require('path');

// Set up the storage directory in the Netlify Functions tmp folder
const STORAGE_DIR = join('/tmp', 'calendar-uploads');
const getAllCalendarsPath = () => join(STORAGE_DIR, 'all-calendars.json');
const getMetadataPath = () => join(STORAGE_DIR, 'latest-upload.json');

exports.handler = async (event, context) => {
  console.log("List calendars function called");
  try {
    const allCalendarsPath = getAllCalendarsPath();
    console.log("Looking for all-calendars.json at:", allCalendarsPath);
    
    // Check if all-calendars.json exists
    if (existsSync(allCalendarsPath)) {
      console.log("all-calendars.json exists, reading file");
      
      // Read the calendars list
      const allCalendarsStr = readFileSync(allCalendarsPath, 'utf8');
      let calendars = [];
      
      try {
        calendars = JSON.parse(allCalendarsStr);
        console.log(`Found ${calendars.length} calendars in all-calendars.json`);
        
        // Verify file existence and add list-specific properties
        const existingCalendars = calendars.filter(calendar => {
          const filePath = join(STORAGE_DIR, calendar.fileKey);
          const exists = existsSync(filePath);
          if (!exists) {
            console.log(`Calendar ${calendar.fileKey} file does not exist`);
          }
          return exists;
        });
        
        console.log(`${existingCalendars.length} calendars have existing files`);
        
        // Add download URLs to each calendar
        calendars = existingCalendars.map(calendar => ({
          ...calendar,
          downloadUrl: `${calendar.fileUrl}?download=true`
        }));
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
    } else {
      console.log("all-calendars.json doesn't exist, checking for latest-upload.json");
      
      // If all-calendars.json doesn't exist, try to get the latest calendar
      const metadataPath = getMetadataPath();
      
      if (existsSync(metadataPath)) {
        console.log("latest-upload.json exists, using it as a fallback");
        
        try {
          const metadataStr = readFileSync(metadataPath, 'utf8');
          const metadata = JSON.parse(metadataStr);
          
          // Check if the file still exists
          const filePath = join(STORAGE_DIR, metadata.fileKey);
          if (existsSync(filePath)) {
            console.log("Latest calendar file exists, returning it");
            
            // Return just this one calendar
            return {
              statusCode: 200,
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({ 
                calendars: [{
                  ...metadata,
                  downloadUrl: `${metadata.fileUrl}?download=true`
                }]
              })
            };
          } else {
            console.log("Latest calendar file doesn't exist");
          }
        } catch (err) {
          console.error('Error reading latest metadata:', err);
        }
      } else {
        console.log("No latest-upload.json found either");
      }
      
      // If we reach here, no calendars were found
      console.log("No calendars found");
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
  } catch (error) {
    console.error('Error listing calendars:', error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        error: 'Failed to list calendars',
        details: error.message
      })
    };
  }
};