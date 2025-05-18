// get-calendar.js - Get the latest calendar

const { supabase } = require('../../utils/supabaseClient');

exports.handler = async (event, context) => {
  try {
    // Try to fetch the current calendar first
    let { data, error } = await supabase
      .from('calendars')
      .select('*')
      .eq('is_current', true)
      .limit(1);
    if (error) {
      return {
        statusCode: 500,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Failed to fetch calendar', details: error.message })
      };
    }
    // If no current calendar, fall back to latest
    if (!data || data.length === 0) {
      const fallback = await supabase
        .from('calendars')
        .select('*')
        .order('uploaded_at', { ascending: false })
        .limit(1);
      data = fallback.data;
    }
    if (!data || data.length === 0) {
      return {
        statusCode: 404,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'No calendar found' })
      };
    }
    const calendar = data[0];
    let fileUrl = calendar.file_url;
    // If fileUrl is just a path (does not start with http), generate a public URL
    if (fileUrl && !fileUrl.startsWith('http')) {
      const { data: publicUrlData, error: publicUrlError } = supabase.storage.from('calendars').getPublicUrl(fileUrl);
      if (!publicUrlError && publicUrlData && publicUrlData.publicUrl) {
        fileUrl = publicUrlData.publicUrl;
      }
    }
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        monthYear: calendar.month_year,
        url: fileUrl,
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