// set-current-calendar.js - Set a calendar as the current one

const { supabase } = require('../../utils/supabaseClient');

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { id } = JSON.parse(event.body || '{}');
    if (!id) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'No calendar id provided' })
      };
    }

    // Set all calendars to is_current = false
    const { error: clearError } = await supabase
      .from('calendars')
      .update({ is_current: false })
      .neq('id', id);
    if (clearError) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Failed to clear current calendar', details: clearError.message })
      };
    }

    // Set the selected calendar to is_current = true
    const { error: setError } = await supabase
      .from('calendars')
      .update({ is_current: true })
      .eq('id', id);
    if (setError) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Failed to set current calendar', details: setError.message })
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Current calendar set successfully' })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to set current calendar', details: error.message })
    };
  }
}; 