import { getStore } from "@netlify/blobs";

export const handler = async (event, context) => {
    try {
        // Get the blob store
        const store = getStore('calendar-uploads');
        
        // Get the latest upload metadata
        const metadataBlob = await store.get('latest-upload');
        
        if (!metadataBlob) {
            return {
                statusCode: 404,
                body: JSON.stringify({ error: 'No calendar found' })
            };
        }

        const metadata = JSON.parse(metadataBlob);

        return {
            statusCode: 200,
            body: JSON.stringify({
                monthYear: metadata.monthYear,
                url: metadata.fileUrl,
                filename: metadata.originalFilename
            })
        };
    } catch (error) {
        console.error('Error fetching calendar:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to fetch calendar' })
        };
    }
}; 