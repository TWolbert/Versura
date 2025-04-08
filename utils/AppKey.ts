export default function getAppKey() {
    // Get app key from environment variables
    const appKey = process.env.APP_KEY;
    if (!appKey) {
        throw new Error('APP_KEY is not defined');
    }

    if (appKey.startsWith('base64:')) {
        // Decode the base64 encoded app key
        const base64Key = appKey.split(':')[1];
        return base64Key;
    }
    else {
        // Return the app key as is
        return appKey;
    }
}