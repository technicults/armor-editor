# Security Guide

Implement enterprise-grade security with encryption, SSO, and compliance features.

## Quick Setup

### Basic Security
```javascript
const editor = new ArmorEditor({
  container: '#editor',
  encryption: {
    enabled: true,
    algorithm: 'AES-GCM'
  },
  sso: {
    enabled: true,
    provider: 'saml'
  }
});
```

## Encryption

### End-to-End Encryption
```javascript
const editor = new ArmorEditor({
  encryption: {
    enabled: true,
    algorithm: 'AES-GCM',    // or 'RSA-OAEP', 'ChaCha20-Poly1305'
    keySize: 256,
    autoEncrypt: true
  }
});
```

### Manual Encryption
```javascript
// Encrypt content
const encrypted = await editor.encryptContent(sensitiveText);

// Decrypt content
const decrypted = await editor.decryptContent(encrypted);

// Check encryption status
const isEncrypted = editor.isContentEncrypted();
```

### Encryption Algorithms

#### AES-GCM (Recommended)
```javascript
encryption: {
  algorithm: 'AES-GCM',
  keySize: 256,
  performance: 'high'
}
```
**Best for:** General use, high performance

#### RSA-OAEP (Maximum Security)
```javascript
encryption: {
  algorithm: 'RSA-OAEP',
  keySize: 4096,
  security: 'maximum'
}
```
**Best for:** Highly sensitive data, legal documents

#### ChaCha20-Poly1305 (Modern)
```javascript
encryption: {
  algorithm: 'ChaCha20-Poly1305',
  keySize: 256,
  performance: 'mobile-optimized'
}
```
**Best for:** Mobile devices, modern applications

## SSO Integration

### SAML 2.0
```javascript
const editor = new ArmorEditor({
  sso: {
    enabled: true,
    provider: 'saml',
    entityId: 'armor-editor-app',
    ssoUrl: 'https://your-idp.com/sso',
    certificate: 'your-certificate',
    mfa: true
  }
});
```

### OAuth 2.0
```javascript
sso: {
  provider: 'oauth2',
  clientId: 'your-client-id',
  clientSecret: 'your-client-secret',
  authUrl: 'https://auth.company.com/oauth/authorize',
  tokenUrl: 'https://auth.company.com/oauth/token'
}
```

### OpenID Connect
```javascript
sso: {
  provider: 'oidc',
  clientId: 'your-client-id',
  issuer: 'https://auth.company.com',
  scope: 'openid profile email'
}
```

### Active Directory
```javascript
sso: {
  provider: 'ad',
  domain: 'company.com',
  ldapUrl: 'ldap://dc.company.com',
  baseDN: 'DC=company,DC=com'
}
```

## Compliance

### GDPR Compliance
```javascript
const editor = new ArmorEditor({
  compliance: {
    gdpr: {
      enabled: true,
      dataRetentionDays: 365,
      consentRequired: true,
      rightToErasure: true,
      dataPortability: true
    }
  }
});
```

### HIPAA Compliance
```javascript
compliance: {
  hipaa: {
    enabled: true,
    auditLogging: true,
    encryptionRequired: true,
    accessControls: true,
    dataRetentionYears: 7
  }
}
```

### SOX Compliance
```javascript
compliance: {
  sox: {
    enabled: true,
    auditTrail: true,
    changeTracking: true,
    accessReviews: true,
    dataIntegrity: true
  }
}
```

## Role-Based Permissions

### Basic Roles
```javascript
const editor = new ArmorEditor({
  permissions: {
    enabled: true,
    roles: {
      admin: ['read', 'write', 'delete', 'manage'],
      editor: ['read', 'write'],
      reviewer: ['read', 'comment', 'approve'],
      viewer: ['read']
    },
    defaultRole: 'editor'
  }
});
```

### Advanced Permissions
```javascript
permissions: {
  enabled: true,
  roles: {
    'senior-partner': {
      permissions: ['all'],
      features: ['encryption', 'audit', 'compliance']
    },
    'associate': {
      permissions: ['read', 'write', 'comment'],
      features: ['basic-editing', 'collaboration']
    },
    'paralegal': {
      permissions: ['read', 'comment', 'research'],
      features: ['read-only', 'comments']
    }
  }
}
```

### Check Permissions
```javascript
// Set current user
editor.setCurrentUser({
  id: 'user-123',
  role: 'editor',
  permissions: ['read', 'write']
});

// Check permission
if (editor.hasPermission('delete', 'document')) {
  // Show delete button
}
```

## Use Cases

### Healthcare (HIPAA)
```javascript
const medicalEditor = new ArmorEditor({
  container: '#patient-record',
  
  // HIPAA Compliance
  compliance: {
    hipaa: {
      enabled: true,
      auditLogging: true,
      encryptionRequired: true,
      accessControls: true
    }
  },
  
  // End-to-End Encryption
  encryption: {
    enabled: true,
    algorithm: 'AES-GCM',
    keySize: 256,
    autoEncrypt: true
  },
  
  // SSO Integration
  sso: {
    provider: 'saml',
    entityId: 'medical-app',
    mfa: true
  },
  
  // Role-Based Access
  permissions: {
    roles: {
      doctor: ['read', 'write', 'prescribe'],
      nurse: ['read', 'write', 'update_vitals'],
      admin: ['all_permissions']
    }
  }
});
```

### Legal Firm
```javascript
const legalEditor = new ArmorEditor({
  container: '#legal-document',
  
  // Maximum Security
  encryption: {
    enabled: true,
    algorithm: 'RSA-OAEP',
    keySize: 4096,
    clientSideOnly: true
  },
  
  // GDPR Compliance
  compliance: {
    gdpr: {
      enabled: true,
      dataRetentionDays: 2555, // 7 years
      rightToErasure: true
    }
  },
  
  // Legal Roles
  permissions: {
    roles: {
      'senior-partner': ['all_permissions'],
      'associate': ['read', 'write', 'research'],
      'paralegal': ['read', 'comment', 'document_prep'],
      'client': ['read_own_cases', 'comment']
    }
  }
});
```

### Financial Services
```javascript
const financialEditor = new ArmorEditor({
  container: '#financial-report',
  
  // SOX Compliance
  compliance: {
    sox: {
      enabled: true,
      auditTrail: true,
      changeTracking: true
    },
    pci: {
      enabled: true,
      dataProtection: true
    }
  },
  
  // High-Performance Encryption
  encryption: {
    enabled: true,
    algorithm: 'ChaCha20-Poly1305',
    keyRotation: 30 // Monthly
  },
  
  // Financial Roles
  permissions: {
    roles: {
      cfo: ['all_permissions'],
      analyst: ['read', 'write', 'analyze'],
      auditor: ['read', 'audit', 'export'],
      compliance: ['read', 'review', 'approve']
    }
  }
});
```

## API Methods

### Encryption
```javascript
// Encrypt/decrypt content
const encrypted = await editor.encryptContent(content);
const decrypted = await editor.decryptContent(encrypted);

// Key management
await editor.rotateEncryptionKey();
const backup = await editor.backupKeys();
await editor.restoreKeys(backup);
```

### Authentication
```javascript
// Get current user
const user = editor.getCurrentUser();

// Logout
editor.logout();

// Check authentication
const isAuthenticated = editor.isAuthenticated();
```

### Permissions
```javascript
// Set user
editor.setCurrentUser(user);

// Check permissions
const canEdit = editor.hasPermission('write', 'document');
const canDelete = editor.hasPermission('delete', 'document');

// Get user role
const role = editor.getUserRole();
```

### Compliance
```javascript
// Request data deletion (GDPR)
await editor.requestDataDeletion(userId);

// Export user data
const userData = await editor.exportUserData(userId);

// Generate compliance report
const report = editor.generateComplianceReport();
```

## Configuration Options

### Encryption Options
| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `enabled` | boolean | false | Enable encryption |
| `algorithm` | string | 'AES-GCM' | Encryption algorithm |
| `keySize` | number | 256 | Key size in bits |
| `autoEncrypt` | boolean | true | Auto-encrypt on save |
| `keyRotation` | number | 30 | Key rotation (days) |

### SSO Options
| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `enabled` | boolean | false | Enable SSO |
| `provider` | string | 'saml' | SSO provider |
| `entityId` | string | - | Entity identifier |
| `ssoUrl` | string | - | SSO endpoint |
| `mfa` | boolean | false | Multi-factor auth |

### Compliance Options
| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `gdpr.enabled` | boolean | false | Enable GDPR |
| `hipaa.enabled` | boolean | false | Enable HIPAA |
| `sox.enabled` | boolean | false | Enable SOX |
| `auditLogging` | boolean | false | Audit logging |
| `dataRetention` | number | 365 | Retention (days) |

## Security Best Practices

### Key Management
```javascript
// Use secure key storage
encryption: {
  keyManagement: {
    provider: 'hsm', // Hardware Security Module
    rotation: 30,
    backup: true,
    escrow: false
  }
}
```

### Session Security
```javascript
sso: {
  sessionTimeout: 3600, // 1 hour
  refreshToken: true,
  secureTransport: true,
  sameSite: 'strict'
}
```

### Audit Logging
```javascript
compliance: {
  auditLogging: {
    enabled: true,
    events: ['login', 'logout', 'document_access', 'document_modify'],
    encryption: true,
    tamperProof: true
  }
}
```

## Troubleshooting

### Encryption Issues
```javascript
// Check Web Crypto API support
if (!window.crypto || !window.crypto.subtle) {
  console.error('Web Crypto API not supported');
}

// Handle encryption errors
editor.on('encryptionError', (error) => {
  console.error('Encryption failed:', error);
});
```

### SSO Issues
```javascript
// Handle authentication errors
editor.on('authError', (error) => {
  if (error.code === 'INVALID_TOKEN') {
    // Redirect to login
    window.location.href = '/login';
  }
});
```

### Permission Issues
```javascript
// Handle permission denied
editor.on('permissionDenied', (action) => {
  showNotification(`You don't have permission to ${action}`);
});
```

## Examples

- [Healthcare HIPAA Demo](../examples/industry/healthcare-demo.html)
- [Legal Security](../examples/legal-security.html)
- [Financial Compliance](../examples/financial-security.html)
