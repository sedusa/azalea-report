// list-calendars.js - Fixed version with better debugging

const { supabase } = require('../../utils/supabaseClient');

exports.handler = async (event, context) => {
  console.log("List calendars function called");
  try {
    // Fetch all calendar metadata from Supabase
    const { data: calendars, error } = await supabase
      .from('calendars')
      .select('*')
      .order('uploaded_at', { ascending: false });
    if (error) {
      return {
        statusCode: 500,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Failed to fetch calendars', details: error.message })
      };
    }
    // Add downloadUrl for each calendar
    const calendarsWithDownload = calendars.map(calendar => ({
      ...calendar,
      downloadUrl: `${calendar.file_url}?download=true`
    }));
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ calendars: calendarsWithDownload })
    };
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