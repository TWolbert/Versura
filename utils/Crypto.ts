// Helper functions to convert ArrayBuffer <-> base64
function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
}

// Generate a 256-bit (32 byte) AES-GCM key
export async function generateSymmetricKey(): Promise<CryptoKey> {
  return crypto.subtle.generateKey(
    { name: "AES-GCM", length: 256 },
    true, // extractable
    ["encrypt", "decrypt"]
  );
}

// Export key to JWK for storage
export async function exportKeyToJWK(key: CryptoKey): Promise<JsonWebKey> {
  return crypto.subtle.exportKey("jwk", key);
}

// Encrypt plaintext with AES-GCM
export async function encryptWithWebCrypto(plaintext: string, keyString: string): Promise<string> {
  // Import key from stored JWK string
  const jwk = JSON.parse(keyString);
  const key = await crypto.subtle.importKey(
    "jwk",
    jwk,
    { name: "AES-GCM" },
    false,
    ["encrypt"]
  );

  const encoder = new TextEncoder();
  const data = encoder.encode(plaintext);

  // Generate a random 12-byte IV
  const iv = crypto.getRandomValues(new Uint8Array(12));

  const ciphertext = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    data
  );

  // Concatenate IV and ciphertext
  const combined = new Uint8Array(iv.byteLength + ciphertext.byteLength);
  combined.set(iv);
  combined.set(new Uint8Array(ciphertext), iv.byteLength);

  // Return Base64 encoded result
  return arrayBufferToBase64(combined.buffer);
}

// Decrypt ciphertext created by encryptWithWebCrypto
export async function decryptWithWebCrypto(encryptedData: string, keyString: string): Promise<string> {
  // Import key from stored JWK string
  const jwk = JSON.parse(keyString);
  const key = await crypto.subtle.importKey(
    "jwk",
    jwk,
    { name: "AES-GCM" },
    false,
    ["decrypt"]
  );

  const combinedBuffer = base64ToArrayBuffer(encryptedData);
  const combined = new Uint8Array(combinedBuffer);

  // Extract IV and ciphertext
  const iv = combined.slice(0, 12);
  const ciphertext = combined.slice(12);

  const decrypted = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv },
    key,
    ciphertext
  );

  const decoder = new TextDecoder();
  return decoder.decode(decrypted);
}