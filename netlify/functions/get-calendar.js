import { getStore } from '@netlify/blobs';

export const handler = async (request, context) => {
  try {
    // Get the blob store
    const store = getStore('calendar-uploads');

    // Get the latest upload metadata
    const metadataBlob = await store.get('latest-upload');

    if (!metadataBlob) {
      return new Response(
        JSON.stringify({
          error: 'No calendar found',
        }),
        {
          status: 404,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }

    const metadata = JSON.parse(metadataBlob);

    return new Response(
      JSON.stringify({
        monthYear: metadata.monthYear,
        url: metadata.fileUrl,
        filename: metadata.originalFilename,
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('Error fetching calendar:', error);
    return new Response(
      JSON.stringify({
        error: 'Failed to fetch calendar',
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
};
