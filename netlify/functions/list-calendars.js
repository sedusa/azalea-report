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
    // Add downloadUrl for each calendar, ensuring file_url is a public URL
    const calendarsWithDownload = await Promise.all(calendars.map(async calendar => {
      let fileUrl = calendar.file_url;
      if (fileUrl && !fileUrl.startsWith('http')) {
        const { data: publicUrlData, error: publicUrlError } = supabase.storage.from('calendars').getPublicUrl(fileUrl);
        if (!publicUrlError && publicUrlData && publicUrlData.publicUrl) {
          fileUrl = publicUrlData.publicUrl;
        }
      }
      return {
        ...calendar,
        file_url: fileUrl,
        downloadUrl: `${fileUrl}?download=true`
      };
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