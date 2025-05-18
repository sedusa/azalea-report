// serve-file.js - Function to serve uploaded files

const { supabase } = require('../../utils/supabaseClient');

exports.handler = async (event, context) => {
  try {
    // Log the incoming event path
    console.log('event.path:', event.path);
    // Get the file key from the path
    const key = event.path.split('/').pop();
    console.log('Extracted key:', key);
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
    console.log('Supabase fetch data:', data);
    if (fetchError || !data) {
      console.error('Supabase fetch error:', fetchError);
      return {
        statusCode: 404,
        body: JSON.stringify({ error: 'File not found' })
      };
    }
    let fileUrl = data.file_url;
    console.log('Original fileUrl from DB:', fileUrl);
    // If fileUrl is just a path (does not start with http), generate a public URL
    if (fileUrl && !fileUrl.startsWith('http')) {
      const { data: publicUrlData, error: publicUrlError } = supabase.storage.from('calendars').getPublicUrl(fileUrl);
      if (publicUrlError) {
        console.error('Error generating public URL:', publicUrlError);
        return {
          statusCode: 500,
          body: JSON.stringify({ error: 'Failed to generate public URL', details: publicUrlError.message })
        };
      }
      fileUrl = publicUrlData.publicUrl;
      console.log('Generated public fileUrl:', fileUrl);
    }
    if (!fileUrl) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'No file URL found for this calendar' })
      };
    }
    // If download param, append ?download=true
    const downloadParam = event.queryStringParameters && event.queryStringParameters.download;
    const redirectUrl = downloadParam ? `${fileUrl}?download=true` : fileUrl;
    console.log('Redirecting to:', redirectUrl);
    return {
      statusCode: 302,
      headers: {
        Location: redirectUrl
      },
      body: ''
    };
  } catch (error) {
    console.error('Handler error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to serve file', details: error.message })
    };
  }
};