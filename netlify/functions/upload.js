// upload.js - Fixed version with better debugging

const { supabase } = require('../../utils/supabaseClient');
const { v4: uuid } = require('uuid');

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

// Helper function to parse multipart form data
async function parseMultipartForm(event) {
  console.log("Starting to parse multipart form data");
  
  const contentType = event.headers['content-type'] || '';
  if (!contentType.includes('multipart/form-data')) {
    console.error(`Invalid content type: ${contentType}`);
    throw new Error('Invalid content type, expected multipart/form-data');
  }
  
  const boundaryMatch = contentType.match(/boundary=(?:"([^"]+)"|([^;]+))/);
  if (!boundaryMatch) {
    console.error('No boundary found in content-type');
    throw new Error('No boundary found in content-type');
  }
  
  const boundary = boundaryMatch[1] || boundaryMatch[2];
  console.log(`Found boundary: ${boundary}`);
  
  const body = Buffer.from(event.body, 'base64');
  console.log(`Body length: ${body.length} bytes`);
  
  const parts = body.toString().split(`--${boundary}`);
  console.log(`Found ${parts.length} parts`);

  const formData = {};

  for (const part of parts) {
    if (part.includes('Content-Disposition: form-data')) {
      const [header, ...content] = part.split('\r\n\r\n');
      const nameMatch = header.match(/name="([^"]+)"/);
      
      if (!nameMatch) {
        console.log('Part has no name, skipping');
        continue;
      }
      
      const name = nameMatch[1];
      console.log(`Processing part with name: ${name}`);

      if (header.includes('filename=')) {
        const filenameMatch = header.match(/filename="([^"]+)"/);
        const filename = filenameMatch ? filenameMatch[1] : 'unnamed_file';
        
        const contentTypeMatch = header.match(/Content-Type: ([^\r\n]+)/);
        const contentType = contentTypeMatch ? contentTypeMatch[1] : 'application/octet-stream';
        
        const buffer = Buffer.from(content.join('\r\n\r\n').trim());
        
        console.log(`File part: ${filename}, type: ${contentType}, size: ${buffer.length} bytes`);

        formData[name] = {
          filename,
          contentType,
          buffer,
        };
      } else {
        const value = content.join('\r\n\r\n').trim();
        console.log(`Field part: ${name}=${value}`);
        formData[name] = value;
      }
    }
  }

  console.log(`Parsed ${Object.keys(formData).length} form fields`);
  return formData;
}