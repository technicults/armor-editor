# End-to-End Encryption

Protect sensitive content with client-side encryption using industry-standard algorithms.

## What is End-to-End Encryption?

End-to-end encryption ensures that only you and intended recipients can read your content. Data is encrypted on your device before transmission and can only be decrypted by authorized users with the correct keys.

## How to Use

### Basic Setup
```javascript
const editor = new ArmorEditor({
  container: '#editor',
  encryption: {
    enabled: true,
    algorithm: 'AES-GCM',
    keySize: 256
  }
})
```

### Automatic Encryption
1. **Enable encryption** in configuration
2. **Content encrypts automatically** when saved
3. **Decryption happens transparently** when loaded
4. **Keys managed securely** by the system

### Manual Encryption Control
```javascript
// Encrypt specific content
const encryptedContent = await editor.encryptContent(sensitiveText)

// Decrypt content
const decryptedContent = await editor.decryptContent(encryptedText)

// Check encryption status
const isEncrypted = editor.isContentEncrypted()
```

## Where to Use

### 🏥 Healthcare (HIPAA)
- **Patient records** and medical notes
- **Treatment plans** and prescriptions
- **Medical research** data
- **Telemedicine** communications

### ⚖️ Legal (Attorney-Client Privilege)
- **Client communications** and case files
- **Contract negotiations** and drafts
- **Legal research** and strategies
- **Court documents** and evidence

### 💰 Financial Services
- **Financial reports** and analysis
- **Client portfolios** and strategies
- **Regulatory filings** and compliance
- **Internal communications** and memos

### 🏢 Enterprise
- **Trade secrets** and IP documentation
- **Strategic plans** and roadmaps
- **HR records** and evaluations
- **Merger & acquisition** documents

## Use Cases

### Use Case 1: Medical Records System
```javascript
// HIPAA-compliant medical documentation
const medicalEditor = new ArmorEditor({
  container: '#patient-record',
  encryption: {
    enabled: true,
    algorithm: 'AES-GCM',
    keySize: 256,
    autoEncrypt: true,        // Encrypt on save
    keyRotation: 30,          // Rotate keys monthly
    compliance: 'HIPAA'
  },
  compliance: {
    hipaa: {
      enabled: true,
      auditLogging: true,
      dataRetention: 2555     // 7 years
    }
  }
})

// Encrypt patient data
async function savePatientRecord(patientData) {
  const encryptedData = await medicalEditor.encryptContent(JSON.stringify(patientData))
  
  // Save to secure database
  await saveToDatabase({
    patientId: patientData.id,
    encryptedContent: encryptedData,
    timestamp: new Date(),
    encryptionVersion: '1.0'
  })
}
```

**Medical Workflow:**
1. Doctor enters patient information
2. Content automatically encrypted before saving
3. Data stored encrypted in database
4. Only authorized medical staff can decrypt
5. Full audit trail maintained for compliance

### Use Case 2: Legal Document Protection
```javascript
// Attorney-client privilege protection
const legalEditor = new ArmorEditor({
  container: '#legal-document',
  encryption: {
    enabled: true,
    algorithm: 'RSA-OAEP',
    keySize: 4096,            // Maximum security
    clientSideOnly: true,     // Never send keys to server
    multiLayerEncryption: true // Multiple encryption layers
  },
  permissions: {
    roles: {
      'senior-partner': ['decrypt', 'encrypt', 'manage-keys'],
      'associate': ['decrypt', 'encrypt'],
      'paralegal': ['view-encrypted'],
      'client': ['view-own-documents']
    }
  }
})

// Secure client communication
async function secureClientCommunication(message, clientId) {
  // Encrypt with client's public key
  const encryptedMessage = await legalEditor.encryptForRecipient(message, clientId)
  
  // Digital signature for authenticity
  const signedMessage = await legalEditor.signContent(encryptedMessage)
  
  return {
    encrypted: encryptedMessage,
    signature: signedMessage,
    timestamp: new Date()
  }
}
```

**Legal Workflow:**
1. Attorney creates sensitive document
2. Content encrypted with client-specific keys
3. Digital signature added for authenticity
4. Client receives encrypted document
5. Only client can decrypt with their private key

### Use Case 3: Financial Data Protection
```javascript
// Financial services encryption
const financialEditor = new ArmorEditor({
  container: '#financial-report',
  encryption: {
    enabled: true,
    algorithm: 'ChaCha20-Poly1305', // High-performance encryption
    keySize: 256,
    keyDerivation: 'PBKDF2',        // Strong key derivation
    saltRounds: 100000,             // High iteration count
    compliance: ['SOX', 'PCI-DSS']
  },
  auditLogging: {
    enabled: true,
    encryptLogs: true,
    tamperProof: true
  }
})

// Encrypt financial data
async function protectFinancialData(reportData) {
  // Classify data sensitivity
  const classification = classifyFinancialData(reportData)
  
  // Apply appropriate encryption
  const encryptionLevel = getEncryptionLevel(classification)
  const encryptedReport = await financialEditor.encryptWithLevel(reportData, encryptionLevel)
  
  return {
    data: encryptedReport,
    classification: classification,
    encryptionLevel: encryptionLevel,
    compliance: ['SOX', 'PCI-DSS']
  }
}
```

**Financial Workflow:**
1. Analyst creates financial report
2. System classifies data sensitivity
3. Appropriate encryption level applied
4. Encrypted data stored with compliance metadata
5. Access controlled by role and clearance level

## Encryption Algorithms

### AES-GCM (Recommended)
```javascript
const editor = new ArmorEditor({
  encryption: {
    algorithm: 'AES-GCM',
    keySize: 256,              // 256-bit key
    ivSize: 96,                // 96-bit IV
    tagSize: 128,              // 128-bit authentication tag
    performance: 'high'        // Optimized for speed
  }
})
```

**Best for:** General-purpose encryption, high performance requirements

### RSA-OAEP (Maximum Security)
```javascript
const editor = new ArmorEditor({
  encryption: {
    algorithm: 'RSA-OAEP',
    keySize: 4096,             // 4096-bit key
    hashFunction: 'SHA-256',   // Hash function
    mgf: 'MGF1',              // Mask generation function
    security: 'maximum'        // Highest security level
  }
})
```

**Best for:** Highly sensitive data, legal documents, maximum security needs

### ChaCha20-Poly1305 (Modern)
```javascript
const editor = new ArmorEditor({
  encryption: {
    algorithm: 'ChaCha20-Poly1305',
    keySize: 256,              // 256-bit key
    nonceSize: 96,             // 96-bit nonce
    performance: 'optimized',   // Mobile-optimized
    resistance: 'quantum-safe'  // Quantum-resistant
  }
})
```

**Best for:** Mobile devices, modern applications, future-proofing

## Key Management

### Automatic Key Management
```javascript
const editor = new ArmorEditor({
  encryption: {
    enabled: true,
    keyManagement: {
      automatic: true,
      rotation: 30,             // Rotate every 30 days
      backup: true,             // Backup keys securely
      recovery: true,           // Enable key recovery
      escrow: false             // No key escrow
    }
  }
})
```

### Manual Key Control
```javascript
const editor = new ArmorEditor({
  encryption: {
    enabled: true,
    keyManagement: {
      manual: true,
      provider: 'custom'        // Custom key provider
    }
  }
})

// Provide your own keys
editor.setEncryptionKey(await generateSecureKey())

// Key rotation
editor.on('keyRotationNeeded', async () => {
  const newKey = await generateSecureKey()
  await editor.rotateKey(newKey)
})
```

### Hardware Security Module (HSM)
```javascript
const editor = new ArmorEditor({
  encryption: {
    enabled: true,
    keyManagement: {
      hsm: {
        enabled: true,
        provider: 'aws-cloudhsm', // AWS CloudHSM
        keyId: 'your-key-id',
        region: 'us-east-1'
      }
    }
  }
})
```

## API Methods

### Encryption Control
```javascript
// Encrypt content
const encrypted = await editor.encryptContent(content)

// Decrypt content
const decrypted = await editor.decryptContent(encrypted)

// Check encryption status
const isEncrypted = editor.isContentEncrypted()

// Get encryption info
const info = editor.getEncryptionInfo()
```

### Key Management
```javascript
// Generate new key
const key = await editor.generateEncryptionKey()

// Set encryption key
await editor.setEncryptionKey(key)

// Rotate key
await editor.rotateEncryptionKey()

// Backup keys
const backup = await editor.backupKeys()

// Restore keys
await editor.restoreKeys(backup)
```

### Advanced Operations
```javascript
// Encrypt for specific recipient
const encrypted = await editor.encryptForRecipient(content, recipientId)

// Decrypt with specific key
const decrypted = await editor.decryptWithKey(encrypted, key)

// Bulk encryption
const results = await editor.encryptBulk(contentArray)

// Verify encryption integrity
const isValid = await editor.verifyEncryption(encrypted)
```

## Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `enabled` | boolean | false | Enable encryption |
| `algorithm` | string | 'AES-GCM' | Encryption algorithm |
| `keySize` | number | 256 | Key size in bits |
| `autoEncrypt` | boolean | true | Auto-encrypt on save |
| `keyRotation` | number | 30 | Key rotation interval (days) |
| `compression` | boolean | true | Compress before encryption |
| `integrity` | boolean | true | Verify data integrity |
| `performance` | string | 'balanced' | Performance mode |

## Security Best Practices

### Key Security
```javascript
const editor = new ArmorEditor({
  encryption: {
    enabled: true,
    security: {
      keyDerivation: 'PBKDF2',
      saltRounds: 100000,       // High iteration count
      keyStretching: true,      // Additional key strengthening
      secureRandom: true,       // Cryptographically secure random
      zeroizeKeys: true         // Clear keys from memory
    }
  }
})
```

### Transport Security
```javascript
const editor = new ArmorEditor({
  encryption: {
    enabled: true,
    transport: {
      tls: 'required',          // Require TLS
      certificatePinning: true, // Pin certificates
      hsts: true,               // HTTP Strict Transport Security
      perfectForwardSecrecy: true // PFS support
    }
  }
})
```

### Compliance Settings
```javascript
const editor = new ArmorEditor({
  encryption: {
    enabled: true,
    compliance: {
      fips140: true,            // FIPS 140-2 compliance
      commonCriteria: true,     // Common Criteria
      suiteb: true,             // NSA Suite B
      quantumSafe: true         // Quantum-safe algorithms
    }
  }
})
```

## Performance Optimization

### Web Workers
```javascript
const editor = new ArmorEditor({
  encryption: {
    enabled: true,
    performance: {
      webWorkers: true,         // Use web workers
      workerCount: 4,           // Number of workers
      chunkSize: 1024,          // Encryption chunk size
      streaming: true           // Stream large files
    }
  }
})
```

### Caching
```javascript
const editor = new ArmorEditor({
  encryption: {
    enabled: true,
    caching: {
      keys: true,               // Cache encryption keys
      results: true,            // Cache encryption results
      ttl: 3600,               // Cache TTL (seconds)
      maxSize: '100MB'         // Maximum cache size
    }
  }
})
```

## Browser Support

| Browser | AES-GCM | RSA-OAEP | ChaCha20 | Web Crypto API |
|---------|---------|----------|----------|----------------|
| Chrome 37+ | ✅ | ✅ | ✅ | ✅ |
| Firefox 34+ | ✅ | ✅ | ✅ | ✅ |
| Safari 7+ | ✅ | ✅ | ❌ | ✅ |
| Edge 12+ | ✅ | ✅ | ✅ | ✅ |

## Troubleshooting

### Common Issues

**Encryption fails:**
```javascript
// Check Web Crypto API support
if (!window.crypto || !window.crypto.subtle) {
  console.error('Web Crypto API not supported')
  // Provide fallback or error message
}

// Check algorithm support
try {
  await crypto.subtle.generateKey(
    { name: 'AES-GCM', length: 256 },
    true,
    ['encrypt', 'decrypt']
  )
} catch (error) {
  console.error('AES-GCM not supported:', error)
}
```

**Key management issues:**
```javascript
// Handle key rotation errors
editor.on('keyRotationError', (error) => {
  console.error('Key rotation failed:', error)
  
  if (error.code === 'BACKUP_FAILED') {
    // Handle backup failure
    showKeyBackupError()
  } else if (error.code === 'PERMISSION_DENIED') {
    // Handle permission issues
    requestKeyPermissions()
  }
})
```

**Performance issues:**
```javascript
// Monitor encryption performance
editor.on('encryptionSlow', (metrics) => {
  console.warn('Encryption is slow:', metrics)
  
  // Optimize settings
  editor.updateEncryptionSettings({
    performance: 'fast',
    chunkSize: 512,
    webWorkers: true
  })
})
```

## Examples

See working examples:
- [Healthcare HIPAA Encryption](../../examples/industry/healthcare-demo.html)
- [Legal Document Protection](../../examples/legal-encryption.html)
- [Financial Data Security](../../examples/financial-encryption.html)
