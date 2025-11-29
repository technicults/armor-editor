# Real-Time Collaboration

Enable multiple users to edit documents simultaneously with live cursors, presence indicators, and conflict resolution.

## What is Real-Time Collaboration?

Real-time collaboration allows multiple users to work on the same document simultaneously. Users can see each other's cursors, edits happen instantly, and conflicts are automatically resolved.

## How to Use

### Basic Setup
```javascript
const editor = new ArmorEditor({
  container: '#editor',
  collaboration: {
    enabled: true,
    channelId: 'document-123',
    userId: 'user-456',
    userName: 'John Doe'
  }
})
```

### Multi-User Document Editing
1. **Share document ID** with collaborators
2. **Each user joins** with unique user ID
3. **Start editing** - changes appear instantly
4. **See live cursors** of other users
5. **Resolve conflicts** automatically

### Advanced Configuration
```javascript
const editor = new ArmorEditor({
  collaboration: {
    enabled: true,
    channelId: 'project-docs-v2',
    userId: getCurrentUserId(),
    userName: getCurrentUserName(),
    userColor: '#ff6b6b',           // Custom user color
    showCursors: true,              // Show other users' cursors
    showPresence: true,             // Show online/offline status
    conflictResolution: 'auto',     // Auto-resolve conflicts
    maxUsers: 50,                   // Maximum collaborators
    permissions: {
      canEdit: true,
      canComment: true,
      canShare: false
    }
  }
})
```

## Where to Use

### 📝 Document Collaboration
- **Team reports** and proposals
- **Meeting notes** and agendas
- **Project documentation** and specs
- **Content creation** and editing

### 🎓 Educational Collaboration
- **Group assignments** and projects
- **Peer review** and feedback
- **Collaborative research** papers
- **Study notes** and summaries

### 💼 Business Collaboration
- **Contract negotiations** and reviews
- **Policy development** and updates
- **Marketing content** creation
- **Strategic planning** documents

### 🔬 Research Collaboration
- **Academic papers** and publications
- **Research proposals** and grants
- **Data analysis** reports
- **Literature reviews** and surveys

## Use Cases

### Use Case 1: Team Report Writing
```javascript
// Setup for team collaboration
const teamEditor = new ArmorEditor({
  container: '#team-report',
  collaboration: {
    enabled: true,
    channelId: 'quarterly-report-2024',
    userId: 'employee-123',
    userName: 'Sarah Johnson',
    userColor: '#2ecc71',
    role: 'editor'
  },
  permissions: {
    canEdit: true,
    canComment: true,
    canApprove: false
  }
})

// Real-time events
teamEditor.on('userJoined', (user) => {
  showNotification(`${user.name} joined the document`)
})

teamEditor.on('userLeft', (user) => {
  showNotification(`${user.name} left the document`)
})
```

**Team Workflow:**
1. Project manager creates document
2. Team members join with unique IDs
3. Each person works on assigned sections
4. Changes sync in real-time
5. Manager reviews and approves final version

### Use Case 2: Student Group Project
```javascript
// Student collaboration setup
const studentEditor = new ArmorEditor({
  container: '#group-project',
  collaboration: {
    enabled: true,
    channelId: 'history-project-group-5',
    userId: 'student-789',
    userName: 'Alex Chen',
    userColor: '#3498db',
    studentMode: true
  },
  trackChanges: true,
  comments: true,
  wordCount: true
})

// Track contributions
studentEditor.on('contentChanged', (change) => {
  trackStudentContribution(change.userId, change.wordCount)
})
```

**Student Workflow:**
1. Teacher creates shared document
2. Students join with student IDs
3. Each student contributes to different sections
4. Peer review through comments
5. Teacher tracks individual contributions

### Use Case 3: Legal Document Review
```javascript
// Legal collaboration with security
const legalEditor = new ArmorEditor({
  container: '#contract-review',
  collaboration: {
    enabled: true,
    channelId: 'contract-abc-v3',
    userId: 'lawyer-456',
    userName: 'Attorney Smith',
    encryption: true,           // Encrypt all communications
    auditTrail: true           // Log all changes
  },
  trackChanges: true,
  permissions: {
    roles: {
      'senior-partner': ['edit', 'approve', 'finalize'],
      'associate': ['edit', 'comment'],
      'paralegal': ['comment', 'research'],
      'client': ['comment', 'view']
    }
  }
})
```

**Legal Workflow:**
1. Senior partner creates contract draft
2. Associates join to review and edit
3. Paralegals add research and comments
4. Client reviews and provides feedback
5. All changes tracked for audit trail

## API Methods

### Collaboration Control
```javascript
// Join collaboration session
editor.joinCollaboration(channelId, userId, userName)

// Leave collaboration session
editor.leaveCollaboration()

// Check collaboration status
const isCollaborating = editor.isCollaborating()

// Get active users
const activeUsers = editor.getActiveUsers()
```

### User Management
```javascript
// Set user information
editor.setUserInfo({
  userId: 'user-123',
  userName: 'John Doe',
  userColor: '#ff6b6b',
  avatar: 'https://example.com/avatar.jpg'
})

// Update user presence
editor.updatePresence('active') // 'active', 'idle', 'away'

// Get user by ID
const user = editor.getUser(userId)
```

### Conflict Resolution
```javascript
// Handle conflicts manually
editor.on('conflict', (conflict) => {
  // Show conflict resolution UI
  showConflictDialog(conflict)
})

// Resolve conflict
editor.resolveConflict(conflictId, resolution)

// Auto-resolve conflicts
editor.setConflictResolution('auto') // 'auto', 'manual', 'last-writer-wins'
```

### Real-time Events
```javascript
// User events
editor.on('userJoined', (user) => {
  console.log(`${user.name} joined`)
})

editor.on('userLeft', (user) => {
  console.log(`${user.name} left`)
})

// Content events
editor.on('remoteChange', (change) => {
  console.log('Remote change received:', change)
})

editor.on('cursorMove', (cursor) => {
  console.log(`${cursor.userName} moved cursor to position ${cursor.position}`)
})
```

## Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `enabled` | boolean | false | Enable collaboration |
| `channelId` | string | - | Unique document identifier |
| `userId` | string | - | Unique user identifier |
| `userName` | string | - | Display name for user |
| `userColor` | string | auto | User cursor/highlight color |
| `showCursors` | boolean | true | Show other users' cursors |
| `showPresence` | boolean | true | Show user presence indicators |
| `conflictResolution` | string | 'auto' | Conflict resolution strategy |
| `maxUsers` | number | 10 | Maximum concurrent users |
| `syncInterval` | number | 100 | Sync interval in milliseconds |
| `encryption` | boolean | false | Encrypt collaboration data |

## Conflict Resolution Strategies

### Automatic Resolution
```javascript
const editor = new ArmorEditor({
  collaboration: {
    conflictResolution: 'auto',
    strategy: 'operational-transform' // Advanced conflict resolution
  }
})
```

### Manual Resolution
```javascript
const editor = new ArmorEditor({
  collaboration: {
    conflictResolution: 'manual'
  }
})

editor.on('conflict', (conflict) => {
  // Show UI for user to choose resolution
  showConflictResolutionDialog({
    localChange: conflict.local,
    remoteChange: conflict.remote,
    onResolve: (resolution) => {
      editor.resolveConflict(conflict.id, resolution)
    }
  })
})
```

### Last Writer Wins
```javascript
const editor = new ArmorEditor({
  collaboration: {
    conflictResolution: 'last-writer-wins'
  }
})
```

## Performance Optimization

### Large Documents
```javascript
const editor = new ArmorEditor({
  collaboration: {
    enabled: true,
    performance: {
      chunkSize: 1000,        // Sync in chunks
      debounceDelay: 300,     // Debounce rapid changes
      maxHistory: 100,        // Limit change history
      compression: true       // Compress sync data
    }
  }
})
```

### Network Optimization
```javascript
const editor = new ArmorEditor({
  collaboration: {
    enabled: true,
    network: {
      reconnectAttempts: 5,   // Auto-reconnect attempts
      heartbeatInterval: 30,  // Keep-alive interval
      batchUpdates: true,     // Batch multiple changes
      prioritizeChanges: true // Prioritize important changes
    }
  }
})
```

## Security Features

### Encrypted Collaboration
```javascript
const editor = new ArmorEditor({
  collaboration: {
    enabled: true,
    security: {
      encryption: true,       // Encrypt all data
      keyRotation: 3600,     // Rotate keys hourly
      authenticateUsers: true, // Verify user identity
      auditLog: true         // Log all activities
    }
  }
})
```

### Access Control
```javascript
const editor = new ArmorEditor({
  collaboration: {
    enabled: true,
    permissions: {
      requireInvite: true,    // Users must be invited
      moderatedJoin: true,    // Approve new users
      roleBasedAccess: true,  // Role-based permissions
      sessionTimeout: 7200    // 2-hour session timeout
    }
  }
})
```

## Integration Examples

### WebSocket Integration
```javascript
// Custom WebSocket server integration
const editor = new ArmorEditor({
  collaboration: {
    enabled: true,
    transport: {
      type: 'websocket',
      url: 'wss://your-server.com/collaboration',
      protocols: ['collaboration-v1']
    }
  }
})
```

### Firebase Integration
```javascript
// Firebase Realtime Database integration
const editor = new ArmorEditor({
  collaboration: {
    enabled: true,
    transport: {
      type: 'firebase',
      config: {
        apiKey: 'your-api-key',
        databaseURL: 'https://your-project.firebaseio.com'
      }
    }
  }
})
```

### Socket.IO Integration
```javascript
// Socket.IO server integration
const editor = new ArmorEditor({
  collaboration: {
    enabled: true,
    transport: {
      type: 'socketio',
      url: 'https://your-server.com',
      options: {
        transports: ['websocket', 'polling']
      }
    }
  }
})
```

## Troubleshooting

### Connection Issues
```javascript
// Handle connection problems
editor.on('connectionLost', () => {
  showNotification('Connection lost. Attempting to reconnect...')
})

editor.on('connectionRestored', () => {
  showNotification('Connection restored. Syncing changes...')
})

// Manual reconnection
editor.reconnect()
```

### Sync Issues
```javascript
// Handle sync problems
editor.on('syncError', (error) => {
  console.error('Sync error:', error)
  
  if (error.type === 'CONFLICT') {
    // Handle conflict
    handleConflict(error.conflict)
  } else if (error.type === 'NETWORK') {
    // Handle network error
    showNetworkError()
  }
})
```

### Performance Issues
```javascript
// Monitor performance
editor.on('performanceWarning', (warning) => {
  if (warning.type === 'HIGH_LATENCY') {
    console.warn('High network latency detected')
  } else if (warning.type === 'TOO_MANY_USERS') {
    console.warn('Too many concurrent users')
  }
})
```

## Best Practices

### For Teams
1. **Establish editing guidelines** before starting
2. **Use comments** for discussions, not direct edits
3. **Assign sections** to avoid conflicts
4. **Regular saves** and version checkpoints
5. **Clear communication** about major changes

### For Educators
1. **Set collaboration rules** for students
2. **Monitor contributions** in real-time
3. **Use track changes** for grading
4. **Provide feedback** through comments
5. **Archive sessions** for assessment

### For Enterprises
1. **Implement access controls** and permissions
2. **Enable audit logging** for compliance
3. **Use encryption** for sensitive documents
4. **Set session timeouts** for security
5. **Regular backups** of collaborative documents

## Examples

See working examples:
- [Team Collaboration Demo](../../examples/advanced/collaboration-demo.html)
- [Educational Group Project](../../examples/education-collaboration.html)
- [Business Document Review](../../examples/business-collaboration.html)
