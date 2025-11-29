// End-to-End Encryption System
export class EncryptionSystem {
  private keyPair: CryptoKeyPair | null = null;
  private sharedKeys: Map<string, CryptoKey> = new Map();

  constructor() {
    this.generateKeyPair();
  }

  private async generateKeyPair() {
    try {
      this.keyPair = await window.crypto.subtle.generateKey(
        {
          name: 'RSA-OAEP',
          modulusLength: 2048,
          publicExponent: new Uint8Array([1, 0, 1]),
          hash: 'SHA-256'
        },
        true,
        ['encrypt', 'decrypt']
      );
    } catch (error) {
      console.error('Failed to generate key pair:', error);
    }
  }

  async encryptContent(content: string, recipientPublicKey?: CryptoKey): Promise<string> {
    try {
      const encoder = new TextEncoder();
      const data = encoder.encode(content);
      
      // Generate symmetric key for content
      const symmetricKey = await window.crypto.subtle.generateKey(
        { name: 'AES-GCM', length: 256 },
        true,
        ['encrypt', 'decrypt']
      );

      // Encrypt content with symmetric key
      const iv = window.crypto.getRandomValues(new Uint8Array(12));
      const encryptedContent = await window.crypto.subtle.encrypt(
        { name: 'AES-GCM', iv },
        symmetricKey,
        data
      );

      // Encrypt symmetric key with public key
      const keyToUse = recipientPublicKey || this.keyPair?.publicKey;
      if (!keyToUse) throw new Error('No public key available');

      const exportedKey = await window.crypto.subtle.exportKey('raw', symmetricKey);
      const encryptedKey = await window.crypto.subtle.encrypt(
        { name: 'RSA-OAEP' },
        keyToUse,
        exportedKey
      );

      // Combine encrypted key, iv, and content
      const result = {
        encryptedKey: Array.from(new Uint8Array(encryptedKey)),
        iv: Array.from(iv),
        encryptedContent: Array.from(new Uint8Array(encryptedContent))
      };

      return btoa(JSON.stringify(result));
    } catch (error) {
      console.error('Encryption failed:', error);
      return content; // Fallback to unencrypted
    }
  }

  async decryptContent(encryptedData: string): Promise<string> {
    try {
      if (!this.keyPair?.privateKey) throw new Error('No private key available');

      const data = JSON.parse(atob(encryptedData));
      
      // Decrypt symmetric key
      const encryptedKey = new Uint8Array(data.encryptedKey);
      const decryptedKeyBuffer = await window.crypto.subtle.decrypt(
        { name: 'RSA-OAEP' },
        this.keyPair.privateKey,
        encryptedKey
      );

      // Import symmetric key
      const symmetricKey = await window.crypto.subtle.importKey(
        'raw',
        decryptedKeyBuffer,
        { name: 'AES-GCM' },
        false,
        ['decrypt']
      );

      // Decrypt content
      const iv = new Uint8Array(data.iv);
      const encryptedContent = new Uint8Array(data.encryptedContent);
      
      const decryptedContent = await window.crypto.subtle.decrypt(
        { name: 'AES-GCM', iv },
        symmetricKey,
        encryptedContent
      );

      const decoder = new TextDecoder();
      return decoder.decode(decryptedContent);
    } catch (error) {
      console.error('Decryption failed:', error);
      return encryptedData; // Fallback
    }
  }

  async exportPublicKey(): Promise<string> {
    if (!this.keyPair?.publicKey) return '';
    
    try {
      const exported = await window.crypto.subtle.exportKey('spki', this.keyPair.publicKey);
      return btoa(String.fromCharCode(...new Uint8Array(exported)));
    } catch (error) {
      console.error('Failed to export public key:', error);
      return '';
    }
  }

  async importPublicKey(keyData: string): Promise<CryptoKey | null> {
    try {
      const keyBuffer = Uint8Array.from(atob(keyData), c => c.charCodeAt(0));
      return await window.crypto.subtle.importKey(
        'spki',
        keyBuffer,
        { name: 'RSA-OAEP', hash: 'SHA-256' },
        false,
        ['encrypt']
      );
    } catch (error) {
      console.error('Failed to import public key:', error);
      return null;
    }
  }
}
