# Voice Comments Feature

Add audio annotations and voice feedback to your documents with automatic transcription.

## What is Voice Comments?

Voice Comments allows users to record audio notes and attach them to specific parts of a document. The audio is automatically transcribed to text, making it accessible and searchable.

## How to Use

### Basic Setup
```javascript
const editor = new ArmorEditor({
  container: '#editor',
  voiceComments: {
    enabled: true,
    maxDuration: 300, // 5 minutes
    transcription: true
  }
})
```

### Recording Voice Comments
1. **Click the microphone button** in the toolbar
2. **Allow microphone access** when prompted
3. **Start speaking** - recording begins automatically
4. **Click stop** when finished
5. **Review transcription** and edit if needed

### Advanced Configuration
```javascript
const editor = new ArmorEditor({
  voiceComments: {
    enabled: true,
    maxDuration: 600,           // 10 minutes max
    format: 'webm',             // Audio format
    quality: 'high',            // Recording quality
    transcription: true,        // Auto-transcribe
    languages: ['en-US', 'es-ES'], // Supported languages
    medicalTerms: true,         // Medical vocabulary
    autoSave: true,             // Save automatically
    compression: true           // Compress audio files
  }
})
```

## Where to Use

### 📚 Education
- **Teacher feedback** on student assignments
- **Audio explanations** for complex concepts
- **Language learning** pronunciation guides
- **Lecture annotations** and notes

### 🏥 Healthcare
- **Doctor's notes** during patient consultations
- **Medical transcription** with specialized vocabulary
- **Patient instructions** in their native language
- **Telemedicine** session recordings

### 💼 Business
- **Meeting notes** and action items
- **Document reviews** with verbal feedback
- **Training materials** with audio explanations
- **Client communications** and updates

### ⚖️ Legal
- **Case notes** and observations
- **Client interviews** and depositions
- **Legal research** annotations
- **Court preparation** notes

## Use Cases

### Use Case 1: Teacher Feedback System
```javascript
// Setup for educational feedback
const teacherEditor = new ArmorEditor({
  container: '#assignment-review',
  voiceComments: {
    enabled: true,
    maxDuration: 180,        // 3 minutes per comment
    transcription: true,
    languages: ['en-US'],
    autoSave: true,
    studentMode: false       // Teacher can record
  },
  permissions: {
    role: 'teacher',
    canRecord: true,
    canEdit: true
  }
})

// Student view (read-only with playback)
const studentEditor = new ArmorEditor({
  container: '#assignment-view',
  readOnly: true,
  voiceComments: {
    enabled: true,
    playbackOnly: true,      // Can only listen
    showTranscription: true
  }
})
```

**Workflow:**
1. Teacher opens student assignment
2. Selects text that needs feedback
3. Records voice comment with suggestions
4. Student receives assignment with audio feedback
5. Student can listen and read transcription

### Use Case 2: Medical Documentation
```javascript
// Doctor's voice notes system
const medicalEditor = new ArmorEditor({
  container: '#patient-record',
  voiceComments: {
    enabled: true,
    maxDuration: 600,        // 10 minutes
    transcription: true,
    medicalTerms: true,      // Medical vocabulary
    languages: ['en-US'],
    hipaaCompliant: true,    // HIPAA compliance
    encryption: true         // Encrypt audio files
  },
  compliance: {
    hipaa: {
      enabled: true,
      auditLogging: true
    }
  }
})

// Usage in medical workflow
function recordPatientNote() {
  // Start recording during consultation
  editor.startVoiceRecording()
  
  // Automatic transcription with medical terms
  editor.on('voiceCommentAdded', (comment) => {
    console.log('Transcription:', comment.transcription)
    console.log('Medical terms detected:', comment.medicalTerms)
  })
}
```

**Medical Workflow:**
1. Doctor examines patient
2. Records observations via voice
3. System transcribes with medical vocabulary
4. Notes automatically added to patient record
5. Audio and transcription stored securely

### Use Case 3: Content Review Process
```javascript
// Editorial review system
const reviewEditor = new ArmorEditor({
  container: '#content-review',
  voiceComments: {
    enabled: true,
    maxDuration: 300,
    transcription: true,
    reviewMode: true,        // Special review interface
    timestamped: true        // Add timestamps
  },
  collaboration: {
    enabled: true,
    trackChanges: true
  }
})

// Reviewer workflow
function reviewContent() {
  // Select problematic text
  const selection = window.getSelection()
  
  // Record feedback
  editor.addVoiceComment({
    text: selection.toString(),
    feedback: 'recorded-audio-blob',
    type: 'suggestion',
    priority: 'high'
  })
}
```

**Review Workflow:**
1. Editor submits content for review
2. Reviewer reads and selects issues
3. Records voice feedback for each issue
4. System creates transcription
5. Editor receives audio + text feedback

## API Methods

### Recording Control
```javascript
// Start recording
editor.startVoiceRecording()

// Stop recording
editor.stopVoiceRecording()

// Check if recording
const isRecording = editor.isRecording()

// Get recording status
const status = editor.getRecordingStatus()
```

### Comment Management
```javascript
// Add voice comment
editor.addVoiceComment(audioBlob, position, metadata)

// Get all voice comments
const comments = editor.getVoiceComments()

// Delete voice comment
editor.deleteVoiceComment(commentId)

// Update comment transcription
editor.updateTranscription(commentId, newText)
```

### Event Handling
```javascript
// Recording events
editor.on('recordingStarted', () => {
  console.log('Recording started')
})

editor.on('recordingStopped', (audioBlob) => {
  console.log('Recording stopped', audioBlob)
})

// Transcription events
editor.on('transcriptionComplete', (comment) => {
  console.log('Transcription:', comment.transcription)
})

editor.on('transcriptionError', (error) => {
  console.error('Transcription failed:', error)
})
```

## Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `enabled` | boolean | false | Enable voice comments |
| `maxDuration` | number | 300 | Max recording time (seconds) |
| `format` | string | 'webm' | Audio format (webm, mp3, wav) |
| `quality` | string | 'medium' | Recording quality (low, medium, high) |
| `transcription` | boolean | false | Enable auto-transcription |
| `languages` | array | ['en-US'] | Supported languages |
| `medicalTerms` | boolean | false | Medical vocabulary support |
| `autoSave` | boolean | true | Auto-save recordings |
| `compression` | boolean | true | Compress audio files |
| `playbackSpeed` | number | 1.0 | Default playback speed |
| `waveform` | boolean | true | Show waveform visualization |

## Browser Support

| Browser | Voice Recording | Transcription | Notes |
|---------|----------------|---------------|-------|
| Chrome 58+ | ✅ | ✅ | Full support |
| Firefox 55+ | ✅ | ✅ | Full support |
| Safari 14+ | ✅ | ✅ | iOS 14+ required |
| Edge 79+ | ✅ | ✅ | Full support |

## Security & Privacy

### Data Protection
- **Local processing** - Audio stays on device during recording
- **Encrypted storage** - Audio files encrypted at rest
- **Secure transmission** - HTTPS for cloud transcription
- **GDPR compliant** - User consent and data rights
- **HIPAA ready** - Healthcare-grade security

### Privacy Controls
```javascript
const editor = new ArmorEditor({
  voiceComments: {
    enabled: true,
    privacy: {
      localOnly: true,        // Never send to cloud
      encryptAudio: true,     // Encrypt audio files
      anonymizeTranscription: true, // Remove personal info
      dataRetention: 365      // Days to keep recordings
    }
  }
})
```

## Troubleshooting

### Common Issues

**Microphone not working:**
```javascript
// Check microphone permissions
navigator.mediaDevices.getUserMedia({ audio: true })
  .then(stream => {
    console.log('Microphone access granted')
    stream.getTracks().forEach(track => track.stop())
  })
  .catch(err => console.error('Microphone access denied:', err))
```

**Transcription not working:**
```javascript
// Check transcription service
editor.on('transcriptionError', (error) => {
  if (error.code === 'NETWORK_ERROR') {
    console.log('Check internet connection')
  } else if (error.code === 'LANGUAGE_NOT_SUPPORTED') {
    console.log('Language not supported for transcription')
  }
})
```

**Audio quality issues:**
```javascript
// Improve audio quality
const editor = new ArmorEditor({
  voiceComments: {
    quality: 'high',
    sampleRate: 44100,      // Higher sample rate
    bitRate: 128000,        // Higher bit rate
    noiseSuppression: true, // Reduce background noise
    echoCancellation: true  // Remove echo
  }
})
```

## Best Practices

### For Educators
1. **Keep comments short** (under 2 minutes)
2. **Speak clearly** for better transcription
3. **Use student names** for personalization
4. **Provide specific feedback** with examples
5. **Review transcription** before sending

### For Healthcare
1. **Use medical terminology** consistently
2. **Include patient ID** in recordings
3. **Follow HIPAA guidelines** for storage
4. **Backup recordings** securely
5. **Train staff** on voice documentation

### For Business
1. **Set recording guidelines** for teams
2. **Use consistent vocabulary** for transcription
3. **Archive important recordings** properly
4. **Respect privacy** in recordings
5. **Integrate with workflows** seamlessly

## Examples

See working examples:
- [Healthcare Voice Notes](../../examples/industry/healthcare-demo.html)
- [Educational Feedback](../../examples/education-voice-feedback.html)
- [Business Review System](../../examples/business-voice-review.html)
