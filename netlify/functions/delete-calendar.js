// delete-calendar.js - Delete a calendar

const { supabase } = require('../../utils/supabaseClient');

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
    
    // Get the calendar metadata from Supabase
    const { data, error: fetchError } = await supabase
      .from('calendars')
      .select('*')
      .eq('id', key)
      .single();
    if (fetchError || !data) {
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
    
    // Delete the file from Supabase Storage
    const fileUrl = data.file_url;
    const storagePath = fileUrl.split('/calendars/')[1];
    if (storagePath) {
      const { error: storageError } = await supabase.storage.from('calendars').remove([storagePath]);
      if (storageError) {
        return {
          statusCode: 500,
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ error: 'Failed to delete file from storage', details: storageError.message })
        };
      }
    }
    
    // Delete the metadata from Supabase DB
    const { error: dbError } = await supabase.from('calendars').delete().eq('id', key);
    if (dbError) {
      return {
        statusCode: 500,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ error: 'Failed to delete calendar metadata', details: dbError.message })
      };
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
        error: 'Failed to delete calendar',
        details: error.message
      })
    };
  }
};