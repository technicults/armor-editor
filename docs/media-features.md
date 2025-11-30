# Media Features Guide

Add voice comments, video calls, and advanced media editing to your editor.

## Quick Setup

### Enable Media Features
```javascript
const editor = new ArmorEditor({
  container: '#editor',
  voiceComments: { enabled: true },
  videoIntegration: { enabled: true },
  mediaEditor: { enabled: true }
});
```

## Voice Comments

### Basic Voice Comments
```javascript
const editor = new ArmorEditor({
  voiceComments: {
    enabled: true,
    maxDuration: 300,        // 5 minutes
    transcription: true,     // Auto-transcribe
    languages: ['en-US']
  }
});
```

### Recording Voice Comments
1. Click microphone button in toolbar
2. Allow microphone access
3. Start speaking
4. Click stop when finished
5. Review transcription

### Advanced Voice Setup
```javascript
voiceComments: {
  enabled: true,
  maxDuration: 600,          // 10 minutes
  format: 'webm',            // Audio format
  quality: 'high',           // Recording quality
  transcription: true,
  medicalTerms: true,        // Medical vocabulary
  compression: true,         // Compress files
  autoSave: true
}
```

## Video Integration

### Basic Video Setup
```javascript
const editor = new ArmorEditor({
  videoIntegration: {
    enabled: true,
    webrtc: true,
    recording: true,
    maxParticipants: 10
  }
});
```

### Video Features
- **Video Calls** - WebRTC peer-to-peer calls
- **Screen Sharing** - Share screen or specific windows
- **Recording** - Save video sessions
- **Background Blur** - Professional appearance
- **Virtual Backgrounds** - AI-powered backgrounds

### Video Configuration
```javascript
videoIntegration: {
  enabled: true,
  webrtc: true,
  recording: true,
  maxParticipants: 50,
  screenSharing: true,
  backgroundBlur: true,
  virtualBackgrounds: ['office', 'library'],
  quality: {
    video: '720p',           // '480p', '720p', '1080p'
    audio: 'high'
  }
}
```

## Media Editor

### Basic Media Editor
```javascript
const editor = new ArmorEditor({
  mediaEditor: {
    enabled: true,
    canvas: true,
    filters: ['blur', 'brightness', 'contrast'],
    cropping: true,
    resizing: true
  }
});
```

### Image Editing Features
- **Filters** - Blur, brightness, contrast, sepia
- **Cropping** - Precise image cropping
- **Resizing** - Maintain aspect ratio
- **Annotations** - Text, arrows, shapes
- **AI Enhancement** - Auto-improve quality

### Advanced Media Editor
```javascript
mediaEditor: {
  enabled: true,
  canvas: true,
  filters: 'all',           // All available filters
  ai: {
    enabled: true,
    autoEnhance: true,      // Auto-improve images
    backgroundRemoval: true, // Remove backgrounds
    upscaling: true         // AI upscaling
  },
  cloudStorage: {
    enabled: true,
    provider: 'aws'         // AWS S3 integration
  }
}
```

## Use Cases

### Healthcare Voice Notes
```javascript
const medicalEditor = new ArmorEditor({
  container: '#patient-notes',
  voiceComments: {
    enabled: true,
    maxDuration: 600,
    transcription: true,
    medicalTerms: true,      // Medical vocabulary
    hipaaCompliant: true,    // HIPAA compliance
    encryption: true
  }
});

// Medical workflow
function recordPatientNote() {
  editor.startVoiceRecording();
  // Doctor speaks during examination
  // Auto-transcription with medical terms
}
```

### Educational Feedback
```javascript
const teacherEditor = new ArmorEditor({
  container: '#assignment-review',
  voiceComments: {
    enabled: true,
    maxDuration: 180,        // 3 minutes per comment
    transcription: true,
    studentMode: false       // Teacher can record
  }
});

// Teacher workflow
function provideFeedback() {
  // Select student text
  // Record voice feedback
  // Student receives audio + transcription
}
```

### Video Collaboration
```javascript
const teamEditor = new ArmorEditor({
  container: '#team-document',
  videoIntegration: {
    enabled: true,
    recording: true,
    screenSharing: true,
    maxParticipants: 8
  },
  collaboration: {
    enabled: true,
    channelId: 'team-project'
  }
});

// Team workflow
async function startTeamSession() {
  await editor.startVideoCall();
  editor.enableScreenSharing();
  // Collaborate while on video call
}
```

### Content Creation
```javascript
const creatorEditor = new ArmorEditor({
  container: '#content-editor',
  mediaEditor: {
    enabled: true,
    ai: { enabled: true },
    filters: 'all',
    templates: ['social-media', 'blog-header'],
    watermark: {
      enabled: true,
      text: '@MyBrand'
    }
  }
});

// Content creation workflow
async function editBlogImage() {
  const image = await editor.editImage('blog-photo.jpg');
  editor.applyFilter('brightness', 1.2);
  editor.addWatermark();
}
```

## API Methods

### Voice Comments
```javascript
// Recording control
editor.startVoiceRecording();
editor.stopVoiceRecording();
const isRecording = editor.isRecording();

// Comment management
editor.addVoiceComment(audioBlob, position);
const comments = editor.getVoiceComments();
editor.deleteVoiceComment(commentId);
```

### Video Integration
```javascript
// Video calls
await editor.startVideoCall();
editor.endVideoCall();
editor.enableScreenSharing();

// Recording
editor.startRecording();
editor.stopRecording();
const recordings = editor.getRecordings();
```

### Media Editor
```javascript
// Image editing
await editor.editImage(imageUrl);
editor.applyFilter(filterName, value);
editor.cropImage(dimensions);
editor.resizeImage(width, height);

// AI features
await editor.aiEnhanceImage(imageFile);
await editor.removeBackground(imageFile);
```

## Configuration Options

### Voice Comments Options
| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `enabled` | boolean | false | Enable voice comments |
| `maxDuration` | number | 300 | Max recording time (seconds) |
| `transcription` | boolean | false | Auto-transcription |
| `languages` | array | ['en-US'] | Supported languages |
| `medicalTerms` | boolean | false | Medical vocabulary |
| `quality` | string | 'medium' | Recording quality |

### Video Integration Options
| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `enabled` | boolean | false | Enable video features |
| `webrtc` | boolean | true | WebRTC support |
| `recording` | boolean | false | Video recording |
| `maxParticipants` | number | 10 | Max participants |
| `screenSharing` | boolean | false | Screen sharing |
| `backgroundBlur` | boolean | false | Background blur |

### Media Editor Options
| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `enabled` | boolean | false | Enable media editor |
| `canvas` | boolean | true | Canvas-based editing |
| `filters` | array/string | [] | Available filters |
| `cropping` | boolean | true | Image cropping |
| `ai.enabled` | boolean | false | AI enhancement |
| `cloudStorage` | object | null | Cloud integration |

## Browser Support

| Feature | Chrome | Firefox | Safari | Edge |
|---------|--------|---------|--------|------|
| Voice Comments | ✅ 58+ | ✅ 55+ | ✅ 14+ | ✅ 79+ |
| Video Integration | ✅ 58+ | ✅ 55+ | ✅ 14+ | ✅ 79+ |
| Media Editor | ✅ 58+ | ✅ 55+ | ✅ 14+ | ✅ 79+ |
| Screen Sharing | ✅ 72+ | ✅ 66+ | ✅ 13+ | ✅ 79+ |

## Troubleshooting

### Voice Recording Issues
```javascript
// Check microphone permissions
navigator.mediaDevices.getUserMedia({ audio: true })
  .then(stream => console.log('Microphone OK'))
  .catch(err => console.error('Microphone denied:', err));
```

### Video Call Issues
```javascript
// Check WebRTC support
if (!window.RTCPeerConnection) {
  console.error('WebRTC not supported');
}

// Handle connection issues
editor.on('videoCallError', (error) => {
  console.error('Video call error:', error);
});
```

### Media Editor Issues
```javascript
// Check canvas support
const canvas = document.createElement('canvas');
if (!canvas.getContext) {
  console.error('Canvas not supported');
}

// Handle editing errors
editor.on('mediaEditError', (error) => {
  console.error('Media edit error:', error);
});
```

## Examples

- [Healthcare Voice Notes](../examples/industry/healthcare-demo.html)
- [Video Collaboration](../examples/video-collaboration.html)
- [Media Editor Demo](../examples/media-editor.html)
