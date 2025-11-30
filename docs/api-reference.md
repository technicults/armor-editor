# API Reference

Complete reference for all ArmorEditor methods, properties, and events.

## Constructor

### ArmorEditor(options)
Creates a new ArmorEditor instance.

```javascript
const editor = new ArmorEditor({
  container: '#editor',
  height: '400px',
  // ... other options
});
```

**Parameters:**
- `options` (Object) - Configuration options

**Returns:** ArmorEditor instance

## Core Methods

### Content Management

#### getContent()
Get the HTML content of the editor.

```javascript
const content = editor.getContent();
```

**Returns:** String - HTML content

#### setContent(html)
Set the HTML content of the editor.

```javascript
editor.setContent('<p>Hello world!</p>');
```

**Parameters:**
- `html` (String) - HTML content to set

#### getText()
Get the plain text content (without HTML tags).

```javascript
const text = editor.getText();
```

**Returns:** String - Plain text content

#### insertHTML(html)
Insert HTML at the current cursor position.

```javascript
editor.insertHTML('<strong>Bold text</strong>');
```

**Parameters:**
- `html` (String) - HTML to insert

#### clear()
Clear all content from the editor.

```javascript
editor.clear();
```

### Editor Control

#### focus()
Focus the editor.

```javascript
editor.focus();
```

#### blur()
Remove focus from the editor.

```javascript
editor.blur();
```

#### setReadOnly(readOnly)
Set the editor to read-only mode.

```javascript
editor.setReadOnly(true);  // Enable read-only
editor.setReadOnly(false); // Enable editing
```

**Parameters:**
- `readOnly` (Boolean) - Read-only state

#### isReadOnly()
Check if the editor is in read-only mode.

```javascript
const readOnly = editor.isReadOnly();
```

**Returns:** Boolean - Read-only state

#### destroy()
Destroy the editor instance and clean up resources.

```javascript
editor.destroy();
```

## AI Methods

### generateContent(prompt)
Generate content using AI.

```javascript
const content = await editor.generateContent('Write a blog post about AI');
```

**Parameters:**
- `prompt` (String) - AI prompt

**Returns:** Promise<String> - Generated content

### improveContent(text)
Improve existing content with AI.

```javascript
const improved = await editor.improveContent('This is some text');
```

**Parameters:**
- `text` (String) - Text to improve

**Returns:** Promise<String> - Improved text

### fixGrammar(text)
Fix grammar and spelling errors.

```javascript
const corrected = await editor.fixGrammar('This are wrong');
```

**Parameters:**
- `text` (String) - Text to correct

**Returns:** Promise<String> - Corrected text

### adjustTone(text, tone)
Adjust the tone of text.

```javascript
const professional = await editor.adjustTone(text, 'professional');
```

**Parameters:**
- `text` (String) - Text to adjust
- `tone` (String) - Target tone ('professional', 'casual', 'friendly')

**Returns:** Promise<String> - Adjusted text

## Collaboration Methods

### joinCollaboration(channelId, userId, userName)
Join a collaboration session.

```javascript
editor.joinCollaboration('doc-123', 'user-456', 'John Doe');
```

**Parameters:**
- `channelId` (String) - Document channel ID
- `userId` (String) - User ID
- `userName` (String) - Display name

### leaveCollaboration()
Leave the current collaboration session.

```javascript
editor.leaveCollaboration();
```

### getActiveUsers()
Get list of active collaborators.

```javascript
const users = editor.getActiveUsers();
```

**Returns:** Array - List of active users

### setUserInfo(userInfo)
Set current user information.

```javascript
editor.setUserInfo({
  userId: 'user-123',
  userName: 'Jane Smith',
  userColor: '#ff6b6b',
  avatar: 'https://example.com/avatar.jpg'
});
```

**Parameters:**
- `userInfo` (Object) - User information

## Security Methods

### encryptContent(content)
Encrypt content using configured encryption.

```javascript
const encrypted = await editor.encryptContent(sensitiveText);
```

**Parameters:**
- `content` (String) - Content to encrypt

**Returns:** Promise<String> - Encrypted content

### decryptContent(encryptedContent)
Decrypt encrypted content.

```javascript
const decrypted = await editor.decryptContent(encrypted);
```

**Parameters:**
- `encryptedContent` (String) - Encrypted content

**Returns:** Promise<String> - Decrypted content

### getCurrentUser()
Get current authenticated user.

```javascript
const user = editor.getCurrentUser();
```

**Returns:** Object - User information

### hasPermission(action, resource)
Check if current user has permission.

```javascript
const canEdit = editor.hasPermission('write', 'document');
```

**Parameters:**
- `action` (String) - Action to check
- `resource` (String) - Resource to check

**Returns:** Boolean - Permission status

## Media Methods

### startVoiceRecording()
Start recording voice comment.

```javascript
editor.startVoiceRecording();
```

### stopVoiceRecording()
Stop recording voice comment.

```javascript
editor.stopVoiceRecording();
```

### startVideoCall()
Start a video call session.

```javascript
await editor.startVideoCall();
```

**Returns:** Promise - Video call session

### endVideoCall()
End the current video call.

```javascript
editor.endVideoCall();
```

### editImage(imageUrl)
Open image editor for the specified image.

```javascript
await editor.editImage('path/to/image.jpg');
```

**Parameters:**
- `imageUrl` (String) - URL of image to edit

**Returns:** Promise - Edited image data

## Workflow Methods

### startWorkflow(workflowId, documentId, initiatedBy)
Start a workflow process.

```javascript
const id = editor.startWorkflow('approval-process', 'doc-123', 'user-456');
```

**Parameters:**
- `workflowId` (String) - Workflow template ID
- `documentId` (String) - Document ID
- `initiatedBy` (String) - User who started workflow

**Returns:** String - Workflow instance ID

### submitForApproval(stage)
Submit document for approval at specified stage.

```javascript
await editor.submitForApproval('review');
```

**Parameters:**
- `stage` (String) - Approval stage

**Returns:** Promise - Submission result

### createVersion(message, author)
Create a new document version.

```javascript
const version = editor.createVersion('Added new section', {
  author: 'john@example.com',
  timestamp: new Date()
});
```

**Parameters:**
- `message` (String) - Version message
- `author` (Object) - Author information

**Returns:** Object - Version information

### restoreVersion(versionId)
Restore a previous version.

```javascript
const success = editor.restoreVersion('version-abc123');
```

**Parameters:**
- `versionId` (String) - Version ID to restore

**Returns:** Boolean - Success status

## Template Methods

### useTemplate(templateId, variables)
Use a document template.

```javascript
editor.useTemplate('project-proposal', {
  project_name: 'AI Integration',
  budget: 150000
});
```

**Parameters:**
- `templateId` (String) - Template ID
- `variables` (Object) - Template variables

### createTemplate(template)
Create a new template.

```javascript
editor.createTemplate({
  id: 'my-template',
  name: 'My Template',
  content: '<h1>{{title}}</h1><p>{{content}}</p>',
  variables: ['title', 'content']
});
```

**Parameters:**
- `template` (Object) - Template definition

## Performance Methods

### getPerformanceMetrics()
Get current performance metrics.

```javascript
const metrics = editor.getPerformanceMetrics();
console.log('FPS:', metrics.fps);
console.log('Memory:', metrics.memory);
```

**Returns:** Object - Performance metrics

### cleanup()
Manually trigger cleanup of unused resources.

```javascript
editor.cleanup();
```

### enablePerformanceDebugging()
Enable performance debugging mode.

```javascript
editor.enablePerformanceDebugging();
```

## Event System

### on(event, callback)
Add event listener.

```javascript
editor.on('contentChanged', (content) => {
  console.log('Content changed:', content);
});
```

**Parameters:**
- `event` (String) - Event name
- `callback` (Function) - Event handler

### off(event, callback)
Remove event listener.

```javascript
editor.off('contentChanged', handler);
```

**Parameters:**
- `event` (String) - Event name
- `callback` (Function) - Event handler to remove

### emit(event, data)
Emit custom event.

```javascript
editor.emit('customEvent', { data: 'value' });
```

**Parameters:**
- `event` (String) - Event name
- `data` (Any) - Event data

## Events

### Content Events

#### contentChanged
Fired when content changes.

```javascript
editor.on('contentChanged', (content) => {
  console.log('New content:', content);
});
```

**Callback Parameters:**
- `content` (String) - New content

#### selectionChanged
Fired when text selection changes.

```javascript
editor.on('selectionChanged', (selection) => {
  console.log('Selection:', selection);
});
```

**Callback Parameters:**
- `selection` (Object) - Selection information

### Collaboration Events

#### userJoined
Fired when a user joins collaboration.

```javascript
editor.on('userJoined', (user) => {
  console.log(`${user.name} joined`);
});
```

**Callback Parameters:**
- `user` (Object) - User information

#### userLeft
Fired when a user leaves collaboration.

```javascript
editor.on('userLeft', (user) => {
  console.log(`${user.name} left`);
});
```

**Callback Parameters:**
- `user` (Object) - User information

#### remoteChange
Fired when remote user makes changes.

```javascript
editor.on('remoteChange', (change) => {
  console.log('Remote change:', change);
});
```

**Callback Parameters:**
- `change` (Object) - Change information

### AI Events

#### aiRequestStarted
Fired when AI request starts.

```javascript
editor.on('aiRequestStarted', (request) => {
  console.log('AI request started:', request);
});
```

#### aiRequestCompleted
Fired when AI request completes.

```javascript
editor.on('aiRequestCompleted', (result) => {
  console.log('AI result:', result);
});
```

#### aiError
Fired when AI request fails.

```javascript
editor.on('aiError', (error) => {
  console.error('AI error:', error);
});
```

### Performance Events

#### performanceMetric
Fired when performance metrics are updated.

```javascript
editor.on('performanceMetric', (metric) => {
  console.log(`${metric.name}: ${metric.value}`);
});
```

#### performanceAlert
Fired when performance alert is triggered.

```javascript
editor.on('performanceAlert', (alert) => {
  console.warn('Performance alert:', alert);
});
```

## Configuration Options

### Core Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `container` | String/Element | - | Container selector or element |
| `height` | String | '300px' | Editor height |
| `width` | String | '100%' | Editor width |
| `theme` | String | 'light' | Editor theme |
| `placeholder` | String | '' | Placeholder text |
| `readOnly` | Boolean | false | Read-only mode |
| `toolbar` | Boolean/Array | true | Toolbar configuration |

### AI Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `ai.enabled` | Boolean | false | Enable AI features |
| `ai.provider` | String | 'openai' | AI provider |
| `ai.apiKey` | String | - | API key |
| `ai.model` | String | 'gpt-3.5-turbo' | AI model |
| `ai.features` | Object | {} | AI feature settings |

### Collaboration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `collaboration.enabled` | Boolean | false | Enable collaboration |
| `collaboration.channelId` | String | - | Document channel ID |
| `collaboration.userId` | String | - | User ID |
| `collaboration.userName` | String | - | Display name |
| `collaboration.maxUsers` | Number | 10 | Max concurrent users |

### Security Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `encryption.enabled` | Boolean | false | Enable encryption |
| `encryption.algorithm` | String | 'AES-GCM' | Encryption algorithm |
| `encryption.keySize` | Number | 256 | Key size in bits |
| `sso.enabled` | Boolean | false | Enable SSO |
| `sso.provider` | String | 'saml' | SSO provider |

### Performance Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `performance.virtualScrolling` | Boolean | false | Virtual scrolling |
| `performance.lazyLoading` | Boolean | false | Lazy loading |
| `performance.webWorkers` | Boolean | false | Web workers |
| `performance.memoryLimit` | String | '100MB' | Memory limit |

## TypeScript Types

### EditorOptions
```typescript
interface EditorOptions {
  container: HTMLElement | string;
  height?: string;
  width?: string;
  theme?: 'light' | 'dark';
  placeholder?: string;
  readOnly?: boolean;
  toolbar?: boolean | string[];
  ai?: AIConfig;
  collaboration?: CollaborationConfig;
  encryption?: EncryptionConfig;
  // ... other options
}
```

### AIConfig
```typescript
interface AIConfig {
  enabled: boolean;
  provider?: string;
  apiKey?: string;
  model?: string;
  features?: {
    smartSuggestions?: boolean;
    contentGeneration?: boolean;
    grammarCheck?: boolean;
  };
}
```

### User
```typescript
interface User {
  id: string;
  name: string;
  email?: string;
  avatar?: string;
  role?: string;
  permissions?: string[];
}
```

## Error Handling

### Common Errors

#### EditorNotInitializedError
Thrown when trying to use editor before initialization.

```javascript
try {
  editor.getContent();
} catch (error) {
  if (error instanceof EditorNotInitializedError) {
    console.error('Editor not initialized');
  }
}
```

#### AIProviderError
Thrown when AI provider fails.

```javascript
editor.on('aiError', (error) => {
  if (error.code === 'INVALID_API_KEY') {
    console.error('Invalid API key');
  }
});
```

#### CollaborationError
Thrown when collaboration fails.

```javascript
editor.on('collaborationError', (error) => {
  if (error.code === 'CONNECTION_LOST') {
    console.error('Connection lost');
  }
});
```

## Examples

- [Basic API Usage](../examples/api-basic.html)
- [Advanced API Usage](../examples/api-advanced.html)
- [TypeScript Example](../examples/api-typescript.html)
