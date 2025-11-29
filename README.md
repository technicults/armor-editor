# ArmorEditor

> **The most secure and comprehensive rich text editor for modern web applications**

A powerful, lightweight (58KB), framework-agnostic rich text editor with premium features like real-time collaboration, spell checking, track changes, and **custom Google Fonts support**. Works seamlessly with React, Vue, Angular, Next.js, Nuxt.js, or vanilla JavaScript.

---

## Quick Start (2 Minutes Setup)

### Step 1: Install
```bash
npm install armor-editor
```

### Step 2: Use It
```javascript
import { ArmorEditor } from 'armor-editor';

const editor = new ArmorEditor({
  container: '#editor',
  placeholder: 'Start typing...'
});
```

### Step 3: Add HTML
```html
<div id="editor"></div>
```

**That's it! You now have a fully functional rich text editor.**

---

## Table of Contents

- [Why Choose ArmorEditor?](#why-choose-armor-editor)
- [Features Overview](#features-overview)
- [Installation Guide](#installation-guide)
- [Framework Integration](#framework-integration)
- [Configuration](#configuration)
- [Collaboration Setup](#collaboration-setup)
- [Spell Check Setup](#spell-check-setup)
- [Use Cases & Examples](#use-cases--examples)
- [API Reference](#api-reference)
- [Customization](#customization)
- [Troubleshooting](#troubleshooting)

---

## Why Choose ArmorEditor?

| Feature | Other Editors | ArmorEditor |
|---------|---------------|----------------------|
| **Size** | 500KB+ | **58KB** |
| **Frameworks** | Limited | **All Frameworks** |
| **Collaboration** | Extra Cost | **Built-in** |
| **Spell Check** | Basic | **AI-Powered** |
| **Setup Time** | Hours | **2 Minutes** |
| **Cost** | $$$$ | **Free** |

---

## Features Overview

### **Core Features**
- **Rich Text Formatting** - Bold, italic, underline, strikethrough
- **Font Controls** - 10+ fonts, sizes, colors
- **Text Alignment** - Left, center, right, justify
- **Lists & Indentation** - Ordered/unordered lists
- **Media Support** - Images, links, tables, code blocks

### **Premium Features**
- **Real-time Collaboration** - Multiple users editing simultaneously
- **Track Changes** - Accept/reject document modifications
- **Comments System** - Contextual discussions
- **AI Spell Check** - Grammar and spelling with suggestions
- **Auto-save** - Never lose your work
- **Math Formulas** - LaTeX support
- **Mentions** - @user tagging

### **Developer Features**
- **Framework Agnostic** - Works everywhere
- **TypeScript** - Full type safety
- **SSR Support** - Next.js & Nuxt.js ready
- **Auto-import** - Nuxt module included
- **Professional UI** - 33 SVG icons

---

## Installation Guide

### Method 1: NPM (Recommended)
```bash
npm install armor-editor
```

### Method 2: CDN
```html
<script type="module">
  import { ArmorEditor } from 'https://unpkg.com/armor-editor@latest/dist/index.esm.js';
</script>
```

### Method 3: Download
Download the latest release from [GitHub](https://github.com/technicults/armor-editor/releases)

---

## Framework Integration

### **Vanilla JavaScript**
```html
<!DOCTYPE html>
<html>
<head>
    <title>My Editor</title>
</head>
<body>
    <div id="editor"></div>
    
    <script type="module">
        import { ArmorEditor } from 'armor-editor';
        
        const editor = new ArmorEditor({
            container: '#editor',
            height: '400px',
            placeholder: 'Start writing...'
        });
    </script>
</body>
</html>
```

### **React**
```jsx
import { useEffect, useRef } from 'react';
import { ArmorEditor } from 'armor-editor';

function MyEditor() {
  const editorRef = useRef();
  
  useEffect(() => {
    const editor = new ArmorEditor({
      container: editorRef.current,
      height: '400px',
      onChange: (content) => console.log(content)
    });
    
    return () => editor.destroy();
  }, []);
  
  return <div ref={editorRef}></div>;
}
```

### **Vue 3**
```vue
<template>
  <div ref="editor"></div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { ArmorEditor } from 'armor-editor';

const editor = ref();
let editorInstance = null;

onMounted(() => {
  editorInstance = new ArmorEditor({
    container: editor.value,
    height: '400px'
  });
});

onBeforeUnmount(() => {
  editorInstance?.destroy();
});
</script>
```

### **Next.js (App Router)**
```jsx
'use client';

import { useEffect, useRef, useState } from 'react';
import { ArmorEditor } from 'armor-editor';

export default function Editor() {
  const editorRef = useRef();
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  useEffect(() => {
    if (mounted && editorRef.current) {
      const editor = new ArmorEditor({
        container: editorRef.current,
        height: '400px'
      });
      
      return () => editor.destroy();
    }
  }, [mounted]);
  
  if (!mounted) return <div>Loading...</div>;
  
  return <div ref={editorRef}></div>;
}
```

### **Nuxt.js (Auto-import)**

#### Step 1: Add Module
```javascript
// nuxt.config.js
export default defineNuxtConfig({
  modules: ['armor-editor/nuxt']
})
```

#### Step 2: Use Component (No imports needed!)
```vue
<template>
  <ArmorEditor 
    v-model="content"
    height="400px"
    :spell-check="true"
    @ready="onReady"
  />
</template>

<script setup>
const content = ref('');

const onReady = (editor) => {
  console.log('Editor ready!');
};
</script>
```

### **Angular**
```typescript
import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { ArmorEditor } from 'armor-editor';

@Component({
  selector: 'app-editor',
  template: '<div #editor></div>'
})
export class EditorComponent implements AfterViewInit {
  @ViewChild('editor') editorElement!: ElementRef;
  private editor!: ArmorEditor;

  ngAfterViewInit() {
    this.editor = new ArmorEditor({
      container: this.editorElement.nativeElement,
      height: '400px'
    });
  }

  ngOnDestroy() {
    this.editor?.destroy();
  }
}
```

---

## Configuration

### Basic Configuration
```javascript
const editor = new ArmorEditor({
  // Required
  container: '#editor',
  
  // Appearance
  height: '400px',
  width: '100%',
  theme: 'light', // 'light' or 'dark'
  placeholder: 'Start typing...',
  
  // Toolbar
  toolbar: true, // or custom array
  
  // Events
  onChange: (content) => console.log(content),
  onReady: () => console.log('Ready!')
});
```

### Custom Toolbar
```javascript
const editor = new ArmorEditor({
  container: '#editor',
  toolbar: [
    'bold', 'italic', 'underline', '|',
    'fontSize', 'textColor', '|',
    'alignLeft', 'alignCenter', 'alignRight', '|',
    'orderedList', 'unorderedList', '|',
    'link', 'image', 'table', '|',
    'undo', 'redo', 'fullscreen'
  ]
});
```

### Available Toolbar Items
```javascript
// Text formatting
'bold', 'italic', 'underline', 'strikethrough'

// Font controls  
'fontSize', 'fontFamily', 'textColor', 'backgroundColor'

// Alignment
'alignLeft', 'alignCenter', 'alignRight', 'alignJustify'

// Lists
'orderedList', 'unorderedList', 'indent', 'outdent'

// Media
'link', 'image', 'table', 'code', 'blockquote'

// Premium
'trackChanges', 'comments', 'spellCheck', 'wordCount'

// Controls
'undo', 'redo', 'removeFormat', 'fullscreen'

// Separator
'|'
```

---

## Collaboration Setup

### Step 1: Enable Collaboration
```javascript
const editor = new ArmorEditor({
  container: '#editor',
  collaboration: {
    channelId: 'document-123',    // Unique document ID
    userId: 'user-456',           // Current user ID
    userName: 'John Doe'          // Display name
  }
});
```

### Step 2: Handle Real-time Updates
```javascript
const editor = new ArmorEditor({
  container: '#editor',
  collaboration: {
    channelId: 'document-123',
    userId: 'user-456',
    userName: 'John Doe'
  },
  onChange: (content) => {
    // Send changes to your server
    sendToServer({
      documentId: 'document-123',
      content: content,
      userId: 'user-456'
    });
  }
});
```

### Step 3: Receive Updates from Other Users
```javascript
// Listen for updates from your server
websocket.onmessage = (event) => {
  const data = JSON.parse(event.data);
  
  if (data.userId !== 'user-456') {
    // Update from another user
    editor.setContent(data.content);
  }
};
```

### Collaboration Features
- **Live Cursors** - See where others are typing
- **User Presence** - Online/offline indicators  
- **Color-coded Users** - Each user gets a unique color
- **Real-time Updates** - Changes appear instantly
- **Conflict Resolution** - Handles simultaneous edits

---

## Spell Check Setup

### Step 1: Enable Spell Check
```javascript
const editor = new ArmorEditor({
  container: '#editor',
  spellCheck: true
});
```

### Step 2: Advanced Configuration
```javascript
const editor = new ArmorEditor({
  container: '#editor',
  spellCheck: true,
  spellCheckOptions: {
    language: 'en-US',           // Language code
    apiKey: 'your-api-key',      // Optional API key
    customDictionary: ['word1', 'word2'] // Custom words
  }
});
```

### Spell Check Features
- **Real-time Checking** - Errors highlighted as you type
- **Smart Suggestions** - Click errors to see corrections
- **Multiple APIs** - LanguageTool, Bing, fallbacks
- **Offline Mode** - Works without internet
- **Custom Dictionary** - Add your own words

### Supported APIs
1. **LanguageTool** (Primary) - 20 requests/minute free
2. **Bing Spell Check** (Fallback) - Microsoft's API
3. **Offline Dictionary** (Fallback) - 1000+ common words

---

## Use Cases & Examples

### **Blog Writing Platform**
```javascript
const blogEditor = new ArmorEditor({
  container: '#blog-editor',
  height: '500px',
  spellCheck: true,
  wordCount: true,
  autoSave: {
    interval: 30000, // 30 seconds
    callback: (content) => saveDraft(content)
  },
  toolbar: [
    'bold', 'italic', 'underline', '|',
    'fontSize', 'textColor', '|',
    'alignLeft', 'alignCenter', 'alignRight', '|',
    'orderedList', 'unorderedList', '|',
    'link', 'image', 'blockquote', '|',
    'wordCount', 'spellCheck'
  ]
});
```

### **Document Collaboration**
```javascript
const docEditor = new ArmorEditor({
  container: '#doc-editor',
  collaboration: {
    channelId: 'team-doc-1',
    userId: getCurrentUserId(),
    userName: getCurrentUserName()
  },
  trackChanges: true,
  comments: true,
  mentions: {
    feeds: getTeamMembers() // [{name: 'John', id: '1'}]
  }
});
```

### **Email Composer**
```javascript
const emailEditor = new ArmorEditor({
  container: '#email-editor',
  height: '300px',
  toolbar: [
    'bold', 'italic', 'underline', '|',
    'textColor', 'backgroundColor', '|',
    'alignLeft', 'alignCenter', 'alignRight', '|',
    'orderedList', 'unorderedList', '|',
    'link'
  ],
  placeholder: 'Compose your email...'
});
```

### **Comment System**
```javascript
const commentEditor = new ArmorEditor({
  container: '#comment-editor',
  height: '150px',
  toolbar: ['bold', 'italic', 'link'],
  placeholder: 'Add a comment...',
  mentions: {
    feeds: getUsers(),
    trigger: '@'
  }
});
```

### **Educational Platform**
```javascript
const lessonEditor = new ArmorEditor({
  container: '#lesson-editor',
  mathFormulas: true,
  mediaEmbed: true, // YouTube, Vimeo
  toolbar: [
    'bold', 'italic', 'underline', '|',
    'fontSize', 'textColor', '|',
    'orderedList', 'unorderedList', '|',
    'link', 'image', 'table', '|',
    'mathType', 'mediaEmbed', 'code'
  ]
});
```

### **Form Builder**
```javascript
const formEditor = new ArmorEditor({
  container: '#form-description',
  height: '200px',
  toolbar: [
    'bold', 'italic', 'underline', '|',
    'orderedList', 'unorderedList', '|',
    'link'
  ],
  onChange: (content) => {
    updateFormDescription(content);
  }
});
```

---

## API Reference

### Constructor Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `container` | `HTMLElement \| string` | - | Container element or CSS selector |
| `height` | `string` | `'300px'` | Editor height |
| `width` | `string` | `'100%'` | Editor width |
| `theme` | `'light' \| 'dark'` | `'light'` | Editor theme |
| `placeholder` | `string` | `''` | Placeholder text |
| `toolbar` | `boolean \| string[]` | `true` | Toolbar configuration |
| `spellCheck` | `boolean` | `false` | Enable spell checking |
| `collaboration` | `object` | `null` | Collaboration settings |
| `trackChanges` | `boolean` | `false` | Enable track changes |
| `comments` | `boolean` | `false` | Enable comments |
| `wordCount` | `boolean` | `false` | Show word count |
| `autoSave` | `object` | `null` | Auto-save configuration |
| `mentions` | `object` | `null` | Mentions configuration |
| `onChange` | `function` | - | Content change callback |
| `onReady` | `function` | - | Editor ready callback |

### Methods

| Method | Returns | Description |
|--------|---------|-------------|
| `getContent()` | `string` | Get HTML content |
| `setContent(html)` | `void` | Set HTML content |
| `getText()` | `string` | Get plain text |
| `insertHTML(html)` | `void` | Insert HTML at cursor |
| `focus()` | `void` | Focus the editor |
| `getSelection()` | `Selection` | Get current selection |
| `destroy()` | `void` | Clean up editor |

### Events

| Event | Parameters | Description |
|-------|------------|-------------|
| `onChange` | `(content: string)` | Content changed |
| `onReady` | `()` | Editor initialized |

### Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+B` | Bold |
| `Ctrl+I` | Italic |
| `Ctrl+U` | Underline |
| `Ctrl+Z` | Undo |
| `Ctrl+Y` | Redo |
| `Ctrl+K` | Insert Link |
| `Ctrl+S` | Auto-save |
| `Tab` | Insert 4 spaces |
| `@` | Trigger mentions |

---

## Customization

### Custom Themes
```javascript
const editor = new ArmorEditor({
  container: '#editor',
  theme: 'dark',
  customCSS: `
    .armor-editor-editor {
      border-radius: 12px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.1);
    }
  `
});
```

### Custom Toolbar Styling
```css
.armor-editor-editor-toolbar {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 8px 8px 0 0;
}

.armor-editor-editor-toolbar button {
  color: white;
  border: none;
}

.armor-editor-editor-toolbar button:hover {
  background: rgba(255,255,255,0.2);
}
```

### Custom Fonts
```javascript
const editor = new ArmorEditor({
  container: '#editor',
  customFonts: [
    'Inter',
    'Roboto',
    'Poppins',
    'Montserrat'
  ]
});
```

---

## Troubleshooting

### Common Issues

#### "Container not found" Error
```javascript
// ❌ Wrong - DOM not ready
const editor = new ArmorEditor({
  container: '#editor'
});

// ✅ Correct - Wait for DOM
document.addEventListener('DOMContentLoaded', () => {
  const editor = new ArmorEditor({
    container: '#editor'
  });
});
```

#### Next.js SSR Issues
```jsx
// ❌ Wrong - SSR will fail
import { ArmorEditor } from 'armor-editor';

// ✅ Correct - Client-side only
'use client';
import { useEffect, useState } from 'react';

function Editor() {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  if (!mounted) return null;
  
  // Initialize editor here
}
```

#### Nuxt.js Hydration Issues
```vue
<!-- ❌ Wrong - Will cause hydration mismatch -->
<template>
  <div ref="editor"></div>
</template>

<!-- ✅ Correct - Use the module -->
<template>
  <ArmorEditor v-model="content" />
</template>
```

### Performance Tips

1. **Debounce onChange** for better performance
```javascript
let timeout;
const editor = new ArmorEditor({
  container: '#editor',
  onChange: (content) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      saveContent(content);
    }, 500);
  }
});
```

2. **Destroy editors** when components unmount
```javascript
// Always call destroy()
useEffect(() => {
  return () => editor.destroy();
}, []);
```

3. **Use lazy loading** for large documents
```javascript
const editor = new ArmorEditor({
  container: '#editor',
  lazyLoad: true,
  chunkSize: 1000 // Load 1000 chars at a time
});
```

---

## Browser Support

| Browser | Version |
|---------|---------|
| Chrome | 60+ |
| Firefox | 55+ |
| Safari | 12+ |
| Edge | 79+ |

---

## License

MIT License - see the [LICENSE](LICENSE) file for details.

---

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

---

## Support

- [Documentation](https://github.com/technicults/armor-editor)
- [Report Issues](https://github.com/technicults/armor-editor/issues)
- [Feature Requests](https://github.com/technicults/armor-editor/discussions)
- [Email Support](mailto:technicults@gmail.com)

---

**Made with care by the Technicults team**

*Start building amazing rich text experiences today!*
