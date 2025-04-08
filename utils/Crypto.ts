import {
    CompactEncrypt,
    compactDecrypt,
    generateSecret,
    importJWK,
    exportJWK,
    decodeJwt,
  } from 'jose';
  
  // Generate a 512-bit key for A256CBC-HS512 (split between encryption and HMAC)
  async function generateSymmetricKey() {
    return generateSecret('A256CBC-HS512');
  }
  
  // Export key to JWK for storage (e.g., in DB, secure enclave)
  async function exportKeyToJWK(key: CryptoKey) {
    return await exportJWK(key);
  }
  
  // Encrypt plaintext into compact JWE format
  export async function encryptWithJose(plaintext: string, keyString: string): Promise<string> {
    // Make crypto key from key string
    const key = await importJWK(JSON.parse(keyString), 'A256CBC-HS512');


    const encoder = new TextEncoder();
    const encoded = encoder.encode(plaintext);
  
    const jwe = await new CompactEncrypt(encoded)
      .setProtectedHeader({ alg: 'dir', enc: 'A256CBC-HS512' }) // Direct use of key, AES-CBC + HMAC
      .encrypt(key);
  
    return jwe; // this is a string like "eyJhbGciOiJkaXIiLCJ..."
  }
  
  // Decrypt JWE string back to plaintext
  export async function decryptWithJose(jwe: string, keyString: string): Promise<string> {
    // Make crypto key from key string
    const key = await importJWK(JSON.parse(keyString), 'A256CBC-HS512');
    // Decode the JWE
    const { plaintext } = await compactDecrypt(jwe, key);
    return new TextDecoder().decode(plaintext);
  }
  