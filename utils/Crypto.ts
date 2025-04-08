import crypto from 'crypto-js';

export default function DecryptAES256CBC(key: string, data: string) {
    // Convert the key and data to Buffer
    const keyBuffer = Buffer.from(key, 'hex');
    const dataBuffer = Buffer.from(data, 'hex');

    // Create a new AES cipher with the key
    const cipher = crypto.AES.decrypt(dataBuffer.toString(), keyBuffer.toString());
    // Convert the decrypted data to a string
    const decrypted = cipher.toString(crypto.enc.Utf8);
    // Check if the decrypted data is empty
    if (!decrypted) {
        throw new Error('Decryption failed');
    }
    // Return the decrypted data
    return decrypted;
}   