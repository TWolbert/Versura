export async function decryptWithWebCrypto(encryptedHex: string, expectedSecret: string): Promise<string> {
  // Convert hex to binary
  const encryptedData = hexToUint8Array(encryptedHex);

  // Derive key and IV from secret
  const encoder = new TextEncoder();
  const secretBuffer = encoder.encode(expectedSecret);
  const hashBuffer = await crypto.subtle.digest('SHA-256', secretBuffer);
  
  const hash = new Uint8Array(hashBuffer);
  const keyBytes = hash.slice(0, 16);
  const ivBytes = hash.slice(16, 32);

  // Import crypto key
  const cryptoKey = await crypto.subtle.importKey(
      'raw',
      keyBytes,
      { name: 'AES-CBC' },
      false,
      ['decrypt']
  );

  // Decrypt the token
  const decryptedBuffer = await crypto.subtle.decrypt(
      { name: 'AES-CBC', iv: ivBytes },
      cryptoKey,
      encryptedData
  );

  return new TextDecoder().decode(decryptedBuffer);
}

function hexToUint8Array(hex: string): Uint8Array {
  if (hex.length % 2 !== 0) {
      throw new Error('Invalid hex string length');
  }

  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
      bytes[i/2] = parseInt(hex.substring(i, i + 2), 16);
  }
  return bytes;
}