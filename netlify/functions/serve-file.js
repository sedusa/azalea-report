// serve-file.js - Function to serve uploaded files

const { supabase } = require('../../utils/supabaseClient');

exports.handler = async (event, context) => {
  try {
    // Get the file key from the path
    const key = event.path.split('/').pop();
    if (!key) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'No file key provided' })
      };
    }
    // Get the calendar metadata from Supabase
    const { data, error: fetchError } = await supabase
      .from('calendars')
      .select('*')
      .eq('id', key)
      .single();
    if (fetchError || !data) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: 'File not found' })
      };
    }
    const fileUrl = data.file_url;
    // If download param, append ?download=true
    const downloadParam = event.queryStringParameters && event.queryStringParameters.download;
    const redirectUrl = downloadParam ? `${fileUrl}?download=true` : fileUrl;
    return {
      statusCode: 302,
      headers: {
        Location: redirectUrl
      },
      body: ''
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to serve file', details: error.message })
    };
  }
};