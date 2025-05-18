// get-calendar.js - Get the latest calendar

const { supabase } = require('../../utils/supabaseClient');

exports.handler = async (event, context) => {
  try {
    // Fetch the latest calendar from Supabase
    const { data, error } = await supabase
      .from('calendars')
      .select('*')
      .order('uploaded_at', { ascending: false })
      .limit(1);
    if (error) {
      return {
        statusCode: 500,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Failed to fetch calendar', details: error.message })
      };
    }
    if (!data || data.length === 0) {
      return {
        statusCode: 404,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'No calendar found' })
      };
    }
    const calendar = data[0];
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        monthYear: calendar.month_year,
        url: calendar.file_url,
        filename: calendar.original_filename
      })
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Failed to fetch calendar', details: error.message })
    };
  }
};