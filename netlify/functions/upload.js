// upload.js - Fixed version with better debugging

const { supabase } = require('../../utils/supabaseClient');
const { v4: uuid } = require('uuid');
const Busboy = require('busboy');
const { Readable } = require('stream');

exports.handler = async (event, context) => {
  console.log("Upload function called");
  
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    // Parse the multipart form data
    console.log("Parsing multipart form data");
    const formData = await parseMultipartForm(event);
    const file = formData.file;

    if (!file) {
      console.log("No file found in form data");
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'No file provided' })
      };
    }

    console.log(`File received: ${file.filename}, type: ${file.contentType}, size: ${file.buffer.length} bytes`);

    const monthYear = new Date().toLocaleString('default', {
      month: 'long',
      year: 'numeric',
    });

    const key = uuid();
    const fileExt = file.filename.split('.').pop();
    const storagePath = `${key}.${fileExt}`;

    // Convert Node.js Buffer to Uint8Array before upload
    const uint8Array = new Uint8Array(file.buffer);

    // Upload file to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from('calendars')
      .upload(storagePath, uint8Array, {
        contentType: file.contentType,
        upsert: false
      });
    if (uploadError) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Failed to upload file to storage', details: uploadError.message })
      };
    }

    // Get public URL
    const { data: publicUrlData } = supabase.storage.from('calendars').getPublicUrl(storagePath);
    const fileUrl = publicUrlData.publicUrl;

    // Insert metadata into Supabase DB
    const { error: dbError } = await supabase.from('calendars').insert([
      {
        id: key,
        month_year: monthYear,
        file_url: fileUrl,
        content_type: file.contentType,
        original_filename: file.filename,
        uploaded_at: new Date().toISOString(),
      }
    ]);
    if (dbError) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Failed to save metadata', details: dbError.message })
      };
    }

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: 'File uploaded successfully',
        monthYear,
        url: fileUrl,
      })
    };
  } catch (error) {
    console.error('Upload error:', error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        error: error.message || 'Failed to upload file' 
      })
    };
  }
};

// Helper function to parse multipart form data using busboy
async function parseMultipartForm(event) {
  return new Promise((resolve, reject) => {
    const contentType = event.headers['content-type'] || event.headers['Content-Type'];
    if (!contentType || !contentType.includes('multipart/form-data')) {
      return reject(new Error('Invalid content type, expected multipart/form-data'));
    }
    const busboy = new Busboy({ headers: { 'content-type': contentType } });
    const formData = {};
    busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
      const buffers = [];
      file.on('data', (data) => buffers.push(data));
      file.on('end', () => {
        formData[fieldname] = {
          filename,
          contentType: mimetype,
          buffer: Buffer.concat(buffers),
        };
      });
    });
    busboy.on('field', (fieldname, value) => {
      formData[fieldname] = value;
    });
    busboy.on('finish', () => resolve(formData));
    busboy.on('error', reject);
    // Netlify provides the body as base64-encoded string
    const body = Buffer.from(event.body, 'base64');
    Readable.from(body).pipe(busboy);
  });
}