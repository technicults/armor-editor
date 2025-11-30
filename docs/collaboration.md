# Collaboration Guide

Enable real-time multi-user editing with live cursors and conflict resolution.

## Quick Setup

### Basic Collaboration
```javascript
const editor = new ArmorEditor({
  container: '#editor',
  collaboration: {
    enabled: true,
    channelId: 'document-123',
    userId: 'user-456',
    userName: 'John Doe'
  }
});
```

## Features

### Real-time Editing
Multiple users can edit simultaneously with instant sync.

### Live Cursors
See where other users are typing in real-time.

### User Presence
Online/offline indicators for all collaborators.

### Conflict Resolution
Automatic handling of simultaneous edits.

## Setup Guide

### Step 1: Enable Collaboration
```javascript
const editor = new ArmorEditor({
  container: '#editor',
  collaboration: {
    enabled: true,
    channelId: 'my-document',    // Unique document ID
    userId: getCurrentUserId(),   // Current user ID
    userName: getCurrentUserName() // Display name
  }
});
```

### Step 2: Handle Events
```javascript
// User joined
editor.on('userJoined', (user) => {
  console.log(`${user.name} joined the document`);
});

// User left
editor.on('userLeft', (user) => {
  console.log(`${user.name} left the document`);
});

// Content changed by another user
editor.on('remoteChange', (change) => {
  console.log('Document updated by:', change.author);
});
```

### Step 3: Manage Users
```javascript
// Get active users
const users = editor.getActiveUsers();

// Set user info
editor.setUserInfo({
  userId: 'user-123',
  userName: 'Jane Smith',
  userColor: '#ff6b6b',
  avatar: 'https://example.com/avatar.jpg'
});
```

## Advanced Features

### Comments System
```javascript
const editor = new ArmorEditor({
  collaboration: {
    enabled: true,
    channelId: 'document-123'
  },
  comments: true,
  trackChanges: true
});

// Add comment
editor.addComment('This needs revision', position);

// Reply to comment
editor.replyToComment(commentId, 'I agree, let me fix this');
```

### Track Changes
```javascript
const editor = new ArmorEditor({
  collaboration: {
    enabled: true
  },
  trackChanges: true
});

// Accept change
editor.acceptChange(changeId);

// Reject change
editor.rejectChange(changeId);
```

### Permissions
```javascript
const editor = new ArmorEditor({
  collaboration: {
    enabled: true,
    permissions: {
      canEdit: true,
      canComment: true,
      canShare: false
    }
  }
});
```

## Use Cases

### Team Document Editing
```javascript
const teamEditor = new ArmorEditor({
  container: '#team-doc',
  collaboration: {
    enabled: true,
    channelId: 'team-report-2024',
    userId: getEmployeeId(),
    userName: getEmployeeName(),
    role: 'editor'
  },
  trackChanges: true,
  comments: true
});

// Team workflow
teamEditor.on('userJoined', (user) => {
  showNotification(`${user.name} joined the document`);
});
```

### Student Collaboration
```javascript
const studentEditor = new ArmorEditor({
  container: '#group-project',
  collaboration: {
    enabled: true,
    channelId: 'project-group-5',
    userId: getStudentId(),
    userName: getStudentName(),
    maxUsers: 6 // Limit group size
  }
});

// Track contributions
studentEditor.on('contentChanged', (change) => {
  trackContribution(change.userId, change.wordCount);
});
```

### Client Review
```javascript
const reviewEditor = new ArmorEditor({
  container: '#client-review',
  collaboration: {
    enabled: true,
    channelId: 'contract-review-v2'
  },
  permissions: {
    roles: {
      'client': ['comment', 'suggest'],
      'lawyer': ['edit', 'approve'],
      'paralegal': ['comment', 'research']
    }
  }
});
```

## API Methods

### Collaboration Control
```javascript
// Join collaboration
editor.joinCollaboration(channelId, userId, userName);

// Leave collaboration
editor.leaveCollaboration();

// Check status
const isCollaborating = editor.isCollaborating();
```

### User Management
```javascript
// Get active users
const users = editor.getActiveUsers();

// Get user by ID
const user = editor.getUser(userId);

// Update presence
editor.updatePresence('active'); // 'active', 'idle', 'away'
```

### Comments
```javascript
// Add comment
const commentId = editor.addComment(text, position);

// Reply to comment
editor.replyToComment(commentId, replyText);

// Resolve comment
editor.resolveComment(commentId);

// Get comments
const comments = editor.getComments();
```

### Track Changes
```javascript
// Get changes
const changes = editor.getChanges();

// Accept change
editor.acceptChange(changeId);

// Reject change
editor.rejectChange(changeId);

// Accept all changes
editor.acceptAllChanges();
```

## Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `enabled` | boolean | false | Enable collaboration |
| `channelId` | string | - | Document identifier |
| `userId` | string | - | User identifier |
| `userName` | string | - | Display name |
| `userColor` | string | auto | User cursor color |
| `showCursors` | boolean | true | Show live cursors |
| `showPresence` | boolean | true | Show user presence |
| `maxUsers` | number | 10 | Max concurrent users |
| `conflictResolution` | string | 'auto' | Conflict handling |

## Conflict Resolution

### Automatic (Default)
```javascript
collaboration: {
  conflictResolution: 'auto' // Handles conflicts automatically
}
```

### Manual
```javascript
collaboration: {
  conflictResolution: 'manual'
}

editor.on('conflict', (conflict) => {
  // Show resolution UI
  showConflictDialog(conflict);
});
```

### Last Writer Wins
```javascript
collaboration: {
  conflictResolution: 'last-writer-wins'
}
```

## Security

### Encrypted Collaboration
```javascript
const editor = new ArmorEditor({
  collaboration: {
    enabled: true,
    encryption: true,
    auditLog: true
  }
});
```

### Access Control
```javascript
collaboration: {
  enabled: true,
  security: {
    requireInvite: true,
    moderatedJoin: true,
    sessionTimeout: 3600 // 1 hour
  }
}
```

## Performance

### Large Documents
```javascript
collaboration: {
  enabled: true,
  performance: {
    chunkSize: 1000,
    debounceDelay: 300,
    maxHistory: 100
  }
}
```

### Network Optimization
```javascript
collaboration: {
  enabled: true,
  network: {
    batchUpdates: true,
    compression: true,
    reconnectAttempts: 5
  }
}
```

## Troubleshooting

### Connection Issues
```javascript
editor.on('connectionLost', () => {
  showNotification('Connection lost. Reconnecting...');
});

editor.on('connectionRestored', () => {
  showNotification('Connection restored');
});
```

### Sync Problems
```javascript
editor.on('syncError', (error) => {
  console.error('Sync error:', error);
  // Handle gracefully
});
```

## Examples

- [Collaboration Demo](../examples/advanced/collaboration-demo.html)
- [Team Document](../examples/team-collaboration.html)
- [Student Project](../examples/student-collaboration.html)
