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
- [Enterprise Features](#enterprise-features)
- [Collaboration Setup](#collaboration-setup)
- [Spell Check Setup](#spell-check-setup)
- [Use Cases & Examples](#use-cases--examples)
- [AI Models & Providers](#ai-models--providers)
- [Read-Only Mode](#read-only-mode)
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
| **Enterprise Security** | ❌ | **✅ E2E Encryption** |
| **SSO/SAML** | ❌ | **✅ Built-in** |
| **GDPR/HIPAA** | ❌ | **✅ Compliant** |
| **Voice Comments** | ❌ | **✅ Audio Recording** |
| **Video Calls** | ❌ | **✅ WebRTC** |
| **Local AI** | ❌ | **✅ Web Workers** |
| **Version Control** | ❌ | **✅ Git-like** |
| **Workflow Management** | ❌ | **✅ Multi-stage** |

---

## Features Overview

### **Core Features**
- **Rich Text Formatting** - Bold, italic, underline, strikethrough
- **Font Controls** - 10+ fonts, sizes, colors
- **Text Alignment** - Left, center, right, justify
- **Lists & Indentation** - Ordered/unordered lists
- **Media Support** - Images, links, tables, code blocks

### **Advanced Features**
- **AI Writing Assistant** - Grammar, tone, and content improvement
- **Theme System** - Built-in themes (Light, Dark, Minimal) with custom theme support
- **Plugin Architecture** - Extensible plugin system with built-in plugins
- **Advanced Shortcuts** - Customizable keyboard shortcuts with shortcut manager
- **Performance Monitoring** - Real-time performance metrics and optimization
- **Mobile Optimization** - Touch gestures, collapsible toolbar
- **Performance** - Virtual scrolling, lazy loading for large documents
- **Enhanced Security** - Comprehensive XSS protection, URL sanitization
- **Analytics** - User interaction tracking, performance monitoring
- **Auto-save** - Never lose your work
- **Math Formulas** - LaTeX support
- **Mentions** - @user tagging

### **Enterprise Security Features**
- **End-to-End Encryption** - RSA-OAEP + AES-GCM encryption for sensitive content
- **SSO/SAML Integration** - OAuth2, OIDC, and SAML authentication support
- **GDPR/HIPAA Compliance** - Built-in consent management and audit logging
- **Role-Based Permissions** - Granular access control with user roles
- **Data Loss Prevention** - Content scanning and policy enforcement

### **Advanced Media & Communication**
- **Voice Comments** - Record and attach audio comments with MediaRecorder API
- **Video Integration** - Real-time video calls and screen sharing with WebRTC
- **Advanced Media Editor** - Canvas-based image editing with filters and effects
- **Media Import/Export** - Support for multiple media formats and cloud storage

### **Next-Generation Architecture**
- **Web Components** - Custom elements with Shadow DOM encapsulation
- **Local AI Processing** - Client-side AI models with Web Workers
- **WASM Optimizations** - WebAssembly modules for performance-critical operations
- **Progressive Web App** - Offline support and native app-like experience

### **Workflow Management**
- **Multi-Stage Approvals** - Configurable approval workflows with notifications
- **Version Control** - Git-like versioning with branching and merging
- **Document Templates** - Pre-built templates for common document types
- **Bulk Operations** - Process multiple documents simultaneously

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

#### Basic Usage
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

#### Advanced React Component
```jsx
import { useEffect, useRef, useState, useCallback } from 'react';
import { ArmorEditor } from 'armor-editor';

function BlogEditor({ postId, onSave }) {
  const editorRef = useRef();
  const [editor, setEditor] = useState(null);
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSave = useCallback(async () => {
    setSaving(true);
    try {
      await onSave({ title, content });
    } finally {
      setSaving(false);
    }
  }, [title, content, onSave]);

  useEffect(() => {
    const editorInstance = new ArmorEditor({
      container: editorRef.current,
      height: '500px',
      toolbar: [
        'bold', 'italic', 'underline', '|',
        'fontSize', 'textColor', '|',
        'alignLeft', 'alignCenter', 'alignRight', '|',
        'orderedList', 'unorderedList', '|',
        'link', 'image', 'blockquote', '|',
        'spellCheck', 'wordCount'
      ],
      ai: {
        enabled: true,
        providers: {
          openai: {
            apiKey: process.env.REACT_APP_OPENAI_API_KEY,
            models: ['gpt-4', 'gpt-3.5-turbo'],
            defaultModel: 'gpt-4'
          }
        }
      },
      autoSave: {
        interval: 30000,
        callback: handleSave
      },
      onChange: (newContent) => setContent(newContent),
      onReady: () => console.log('React editor ready!')
    });

    setEditor(editorInstance);
    
    return () => editorInstance.destroy();
  }, [handleSave]);

  return (
    <div className="blog-editor">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Blog post title..."
        className="title-input"
      />
      <div ref={editorRef}></div>
      <div className="editor-actions">
        <button onClick={handleSave} disabled={saving}>
          {saving ? 'Saving...' : 'Save Draft'}
        </button>
      </div>
    </div>
  );
}

export default BlogEditor;
```

### **Vue 3**

#### Basic Usage
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

#### Advanced Vue Component
```vue
<template>
  <div class="blog-editor">
    <input 
      v-model="title" 
      placeholder="Blog title..." 
      class="title-input"
    />
    <div ref="editorContainer"></div>
    <div class="editor-actions">
      <button @click="saveDraft" :disabled="saving">
        {{ saving ? 'Saving...' : 'Save Draft' }}
      </button>
      <button @click="publish" :disabled="publishing">
        {{ publishing ? 'Publishing...' : 'Publish' }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue';
import { ArmorEditor } from 'armor-editor';

const props = defineProps({
  postId: String
});

const emit = defineEmits(['save', 'publish']);

const editorContainer = ref();
const title = ref('');
const content = ref('');
const saving = ref(false);
const publishing = ref(false);
let editorInstance = null;

onMounted(() => {
  editorInstance = new ArmorEditor({
    container: editorContainer.value,
    height: '500px',
    toolbar: [
      'bold', 'italic', 'underline', '|',
      'fontSize', 'textColor', '|',
      'alignLeft', 'alignCenter', 'alignRight', '|',
      'orderedList', 'unorderedList', '|',
      'link', 'image', 'blockquote', '|',
      'spellCheck', 'wordCount'
    ],
    ai: {
      enabled: true,
      providers: {
        openai: {
          apiKey: import.meta.env.VITE_OPENAI_API_KEY,
          models: ['gpt-4', 'gpt-3.5-turbo'],
          defaultModel: 'gpt-4'
        }
      }
    },
    autoSave: {
      interval: 30000,
      callback: (content) => saveDraft()
    },
    onChange: (newContent) => {
      content.value = newContent;
    },
    onReady: () => {
      console.log('Vue editor ready!');
    }
  });
});

onBeforeUnmount(() => {
  editorInstance?.destroy();
});

const saveDraft = async () => {
  saving.value = true;
  try {
    const response = await fetch('/api/posts/draft', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: props.postId,
        title: title.value,
        content: content.value
      })
    });
    
    if (response.ok) {
      emit('save', { title: title.value, content: content.value });
    }
  } catch (error) {
    console.error('Save failed:', error);
  } finally {
    saving.value = false;
  }
};

const publish = async () => {
  publishing.value = true;
  try {
    const response = await fetch('/api/posts/publish', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: props.postId,
        title: title.value,
        content: content.value
      })
    });
    
    if (response.ok) {
      emit('publish', { title: title.value, content: content.value });
    }
  } catch (error) {
    console.error('Publish failed:', error);
  } finally {
    publishing.value = false;
  }
};
</script>

<style scoped>
.blog-editor {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.title-input {
  width: 100%;
  font-size: 24px;
  font-weight: bold;
  border: none;
  outline: none;
  padding: 10px;
  margin-bottom: 20px;
  border-bottom: 2px solid #eee;
}

.editor-actions {
  margin-top: 20px;
  display: flex;
  gap: 10px;
}

button {
  padding: 8px 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background: white;
  cursor: pointer;
}

button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
```

### **Next.js (App Router)**

#### Basic Usage
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

#### Advanced Blog Editor Component
```jsx
'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { ArmorEditor } from 'armor-editor';
import { useRouter } from 'next/navigation';

export default function BlogEditor({ postId }) {
  const editorRef = useRef();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [editor, setEditor] = useState(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSave = useCallback(async () => {
    setSaving(true);
    try {
      const response = await fetch('/api/posts/draft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: postId,
          title,
          content
        })
      });
      
      if (response.ok) {
        console.log('Draft saved successfully');
      }
    } catch (error) {
      console.error('Save failed:', error);
    } finally {
      setSaving(false);
    }
  }, [postId, title, content]);

  const handlePublish = useCallback(async () => {
    setPublishing(true);
    try {
      const response = await fetch('/api/posts/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: postId,
          title,
          content
        })
      });
      
      if (response.ok) {
        router.push('/blog');
      }
    } catch (error) {
      console.error('Publish failed:', error);
    } finally {
      setPublishing(false);
    }
  }, [postId, title, content, router]);

  useEffect(() => {
    if (mounted && editorRef.current) {
      const editorInstance = new ArmorEditor({
        container: editorRef.current,
        height: '600px',
        toolbar: [
          'bold', 'italic', 'underline', '|',
          'fontSize', 'textColor', '|',
          'alignLeft', 'alignCenter', 'alignRight', '|',
          'orderedList', 'unorderedList', '|',
          'link', 'image', 'blockquote', '|',
          'spellCheck', 'wordCount'
        ],
        ai: {
          enabled: true,
          providers: {
            openai: {
              apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
              models: ['gpt-4', 'gpt-3.5-turbo'],
              defaultModel: 'gpt-4'
            }
          }
        },
        autoSave: {
          interval: 30000,
          callback: handleSave
        },
        mobile: {
          enabled: true,
          collapsibleToolbar: true,
          touchGestures: true
        },
        analytics: {
          enabled: true,
          trackEvents: ['typing', 'formatting', 'ai_usage']
        },
        onChange: (newContent) => setContent(newContent),
        onReady: () => {
          console.log('Next.js editor ready!');
          editorInstance.setContent('<p>Start writing your blog post...</p>');
        }
      });

      setEditor(editorInstance);
      
      return () => editorInstance.destroy();
    }
  }, [mounted, handleSave]);

  if (!mounted) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-lg">Loading editor...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter your blog title..."
          className="w-full text-3xl font-bold border-none outline-none pb-4 border-b-2 border-gray-200 focus:border-blue-500"
        />
      </div>
      
      <div className="mb-6">
        <div ref={editorRef} className="border border-gray-300 rounded-lg"></div>
      </div>
      
      <div className="flex gap-4 justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save Draft'}
        </button>
        <button
          onClick={handlePublish}
          disabled={publishing || !title.trim() || !content.trim()}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {publishing ? 'Publishing...' : 'Publish'}
        </button>
      </div>
    </div>
  );
}
```

#### API Routes

**app/api/posts/draft/route.js**
```javascript
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { id, title, content } = await request.json();
    
    // Save draft to database
    const draft = await saveDraftToDatabase({
      id,
      title,
      content,
      updatedAt: new Date()
    });
    
    return NextResponse.json({ success: true, draft });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to save draft' },
      { status: 500 }
    );
  }
}
```

**app/api/posts/publish/route.js**
```javascript
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { id, title, content } = await request.json();
    
    // Publish post to database
    const post = await publishPostToDatabase({
      id,
      title,
      content,
      publishedAt: new Date(),
      status: 'published'
    });
    
    return NextResponse.json({ success: true, post });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to publish post' },
      { status: 500 }
    );
  }
}
```

#### Environment Variables (.env.local)
```bash
NEXT_PUBLIC_OPENAI_API_KEY=your-openai-api-key
DATABASE_URL=your-database-url
```

**Nuxt.js (Auto-import)**

#### Step 1: Add Module
```javascript
// nuxt.config.js
export default defineNuxtConfig({
  modules: ['armor-editor/nuxt']
})
```

#### Step 2: Basic Usage
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
const content = ref('<p>Start writing...</p>');

const onReady = (editor) => {
  console.log('Editor ready!');
};
</script>
```

#### Step 3: Advanced Configuration
```vue
<template>
  <div class="blog-editor">
    <input v-model="title" placeholder="Blog title..." class="title-input" />
    <ArmorEditor 
      v-model="content"
      height="600px"
      :toolbar="toolbarConfig"
      :ai="aiConfig"
      :auto-save="autoSaveConfig"
      :collaboration="collaborationConfig"
      :mobile="{ enabled: true, collapsibleToolbar: true }"
      :analytics="{ enabled: true, trackEvents: ['typing', 'ai_usage'] }"
      @ready="onReady"
      @change="onChange"
    />
    <div class="editor-actions">
      <button @click="saveDraft" :disabled="saving">Save Draft</button>
      <button @click="publish" :disabled="publishing">Publish</button>
    </div>
  </div>
</template>

<script setup>
const title = ref('')
const content = ref('')
const saving = ref(false)
const publishing = ref(false)

const toolbarConfig = [
  'bold', 'italic', 'underline', '|',
  'fontSize', 'textColor', '|',
  'alignLeft', 'alignCenter', 'alignRight', '|',
  'orderedList', 'unorderedList', '|',
  'link', 'image', 'blockquote', '|',
  'spellCheck', 'wordCount'
]

const aiConfig = {
  enabled: true,
  providers: {
    openai: {
      apiKey: process.env.OPENAI_API_KEY,
      models: ['gpt-4', 'gpt-3.5-turbo'],
      defaultModel: 'gpt-4'
    }
  }
}

const autoSaveConfig = {
  interval: 30000,
  callback: (content) => saveDraft()
}

const collaborationConfig = {
  channelId: 'doc-123',
  userId: 'user-456',
  userName: 'John Doe'
}

const saveDraft = async () => {
  saving.value = true
  try {
    await $fetch('/api/posts/draft', {
      method: 'POST',
      body: { title: title.value, content: content.value }
    })
  } finally {
    saving.value = false
  }
}

const publish = async () => {
  publishing.value = true
  try {
    await $fetch('/api/posts/publish', {
      method: 'POST',
      body: { title: title.value, content: content.value }
    })
    await navigateTo('/blog')
  } finally {
    publishing.value = false
  }
}

const onReady = (editor) => {
  console.log('Nuxt editor ready!')
}

const onChange = (newContent) => {
  console.log('Content changed:', newContent.length, 'characters')
}
</script>

<style scoped>
.blog-editor {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.title-input {
  width: 100%;
  font-size: 24px;
  font-weight: bold;
  border: none;
  outline: none;
  padding: 10px;
  margin-bottom: 20px;
  border-bottom: 2px solid #eee;
}

.editor-actions {
  margin-top: 20px;
  display: flex;
  gap: 10px;
}

button {
  padding: 8px 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background: white;
  cursor: pointer;
}

button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
```

### **Angular**

#### Basic Usage
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

#### Advanced Angular Component
```typescript
import { Component, ElementRef, ViewChild, AfterViewInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ArmorEditor } from 'armor-editor';

@Component({
  selector: 'app-blog-editor',
  template: `
    <div class="blog-editor">
      <input 
        [(ngModel)]="title" 
        placeholder="Blog title..." 
        class="title-input"
      />
      <div #editorContainer></div>
      <div class="editor-actions">
        <button (click)="saveDraft()" [disabled]="saving">
          {{ saving ? 'Saving...' : 'Save Draft' }}
        </button>
        <button (click)="publish()" [disabled]="publishing">
          {{ publishing ? 'Publishing...' : 'Publish' }}
        </button>
      </div>
    </div>
  `,
  styles: [`
    .blog-editor {
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
    }
    .title-input {
      width: 100%;
      font-size: 24px;
      font-weight: bold;
      border: none;
      outline: none;
      padding: 10px;
      margin-bottom: 20px;
      border-bottom: 2px solid #eee;
    }
    .editor-actions {
      margin-top: 20px;
      display: flex;
      gap: 10px;
    }
    button {
      padding: 8px 16px;
      border: 1px solid #ccc;
      border-radius: 4px;
      background: white;
      cursor: pointer;
    }
    button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  `]
})
export class BlogEditorComponent implements AfterViewInit, OnDestroy {
  @ViewChild('editorContainer') editorContainer!: ElementRef;
  @Input() postId!: string;
  @Output() save = new EventEmitter<{title: string, content: string}>();
  @Output() publish = new EventEmitter<{title: string, content: string}>();

  private editor!: ArmorEditor;
  title = '';
  content = '';
  saving = false;
  publishing = false;

  constructor(private http: HttpClient) {}

  ngAfterViewInit() {
    this.editor = new ArmorEditor({
      container: this.editorContainer.nativeElement,
      height: '500px',
      toolbar: [
        'bold', 'italic', 'underline', '|',
        'fontSize', 'textColor', '|',
        'alignLeft', 'alignCenter', 'alignRight', '|',
        'orderedList', 'unorderedList', '|',
        'link', 'image', 'blockquote', '|',
        'spellCheck', 'wordCount'
      ],
      ai: {
        enabled: true,
        providers: {
          openai: {
            apiKey: environment.openaiApiKey,
            models: ['gpt-4', 'gpt-3.5-turbo'],
            defaultModel: 'gpt-4'
          }
        }
      },
      autoSave: {
        interval: 30000,
        callback: (content) => this.saveDraft()
      },
      onChange: (newContent) => {
        this.content = newContent;
      },
      onReady: () => {
        console.log('Angular editor ready!');
      }
    });
  }

  ngOnDestroy() {
    this.editor?.destroy();
  }

  async saveDraft() {
    this.saving = true;
    try {
      await this.http.post('/api/posts/draft', {
        id: this.postId,
        title: this.title,
        content: this.content
      }).toPromise();
      
      this.save.emit({ title: this.title, content: this.content });
    } catch (error) {
      console.error('Save failed:', error);
    } finally {
      this.saving = false;
    }
  }

  async publish() {
    this.publishing = true;
    try {
      await this.http.post('/api/posts/publish', {
        id: this.postId,
        title: this.title,
        content: this.content
      }).toPromise();
      
      this.publish.emit({ title: this.title, content: this.content });
    } catch (error) {
      console.error('Publish failed:', error);
    } finally {
      this.publishing = false;
    }
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
  
  // Functionality
  toolbar: true, // or custom array
  readOnly: false, // Set to true for read-only mode
  
  // Advanced Options
  language: 'en-US',
  customFonts: ['Inter', 'Roboto'],
  customCSS: '.editor { border-radius: 8px; }',
  
  // Events
  onChange: (content) => console.log(content),
  onReady: () => console.log('Ready!')
});
```

### Advanced Configuration
```javascript
const editor = new ArmorEditor({
  container: '#editor',
  
  // Mobile Optimization
  mobile: {
    enabled: true,
    collapsibleToolbar: true,
    touchGestures: true
  },
  
  // Performance Settings
  performance: {
    virtualScrolling: true,
    lazyLoading: true,
    chunkSize: 1000
  },
  
  // Analytics & Tracking
  analytics: {
    enabled: true,
    trackEvents: ['typing', 'formatting', 'collaboration']
  },
  
  // Enterprise Security
  encryption: {
    enabled: true,
    algorithm: 'RSA-OAEP',
    keySize: 2048
  },
  
  sso: {
    enabled: true,
    provider: 'saml', // 'saml', 'oauth2', 'oidc'
    endpoint: '/api/sso',
    entityId: 'armor-editor'
  },
  
  compliance: {
    gdpr: true,
    hipaa: true,
    auditLogging: true,
    dataRetention: 365 // days
  },
  
  permissions: {
    enabled: true,
    roles: ['admin', 'editor', 'viewer'],
    defaultRole: 'editor'
  },
  
  // Advanced Media
  voiceComments: {
    enabled: true,
    maxDuration: 300, // seconds
    format: 'webm'
  },
  
  videoIntegration: {
    enabled: true,
    webrtc: true,
    recording: true,
    maxParticipants: 10
  },
  
  mediaEditor: {
    enabled: true,
    canvas: true,
    filters: ['blur', 'brightness', 'contrast'],
    maxFileSize: '10MB'
  },
  
  // Next-Generation Features
  webComponents: {
    enabled: true,
    shadowDOM: true,
    customElements: true
  },
  
  localAI: {
    enabled: true,
    workers: true,
    models: ['text-processing', 'grammar-check'],
    maxWorkers: 4
  },
  
  wasm: {
    enabled: true,
    modules: ['text-processing', 'image-filters'],
    fallback: true
  },
  
  // Workflow Management
  workflow: {
    enabled: true,
    approvals: true,
    stages: ['draft', 'review', 'approved'],
    notifications: true
  },
  
  versioning: {
    enabled: true,
    git: true,
    branches: true,
    maxVersions: 50
  },
  
  // See AI Models & Providers section for AI configuration
  ai: {
    enabled: true,
    // ... see dedicated AI section above
  }
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

## Enterprise Features

### Security & Compliance

#### End-to-End Encryption
```javascript
const editor = new ArmorEditor({
  container: '#secure-editor',
  encryption: {
    enabled: true,
    algorithm: 'RSA-OAEP',
    keySize: 2048,
    autoEncrypt: true
  }
});

// Encrypt content manually
const encryptedContent = await editor.encryptContent(content);
```

#### SSO/SAML Integration
```javascript
const editor = new ArmorEditor({
  container: '#sso-editor',
  sso: {
    enabled: true,
    provider: 'saml', // 'saml', 'oauth2', 'oidc'
    endpoint: '/api/sso/login',
    entityId: 'armor-editor-app',
    mfa: true
  }
});
```

#### GDPR/HIPAA Compliance
```javascript
const editor = new ArmorEditor({
  container: '#compliant-editor',
  compliance: {
    gdpr: true,
    hipaa: true,
    auditLogging: true,
    dataRetention: 2555, // 7 years for HIPAA
    consentManagement: true,
    rightToErasure: true
  }
});

// Request data deletion (GDPR Right to Erasure)
await editor.requestDataDeletion(userId);
```

### Advanced Media Features

#### Voice Comments
```javascript
const editor = new ArmorEditor({
  container: '#voice-editor',
  voiceComments: {
    enabled: true,
    maxDuration: 300, // 5 minutes
    format: 'webm',
    transcription: true,
    languages: ['en-US', 'es-ES', 'fr-FR']
  }
});

// Record voice comment
editor.startVoiceRecording();
```

#### Video Integration
```javascript
const editor = new ArmorEditor({
  container: '#video-editor',
  videoIntegration: {
    enabled: true,
    webrtc: true,
    recording: true,
    maxParticipants: 10,
    screenSharing: true,
    backgroundBlur: true
  }
});

// Start video call
await editor.startVideoCall(['user1', 'user2']);
```

#### Advanced Media Editor
```javascript
const editor = new ArmorEditor({
  container: '#media-editor',
  mediaEditor: {
    enabled: true,
    canvas: true,
    filters: ['blur', 'brightness', 'contrast', 'sepia'],
    cropping: true,
    resizing: true,
    maxFileSize: '50MB'
  }
});
```

### Next-Generation Architecture

#### Web Components
```javascript
const editor = new ArmorEditor({
  container: '#web-components-editor',
  webComponents: {
    enabled: true,
    shadowDOM: true,
    customElements: true,
    isolation: true
  }
});
```

#### Local AI Processing
```javascript
const editor = new ArmorEditor({
  container: '#local-ai-editor',
  localAI: {
    enabled: true,
    workers: true,
    models: ['grammar-check', 'text-completion', 'translation'],
    maxWorkers: 4,
    offlineMode: true
  }
});
```

#### WebAssembly Optimizations
```javascript
const editor = new ArmorEditor({
  container: '#wasm-editor',
  wasm: {
    enabled: true,
    modules: ['text-processing', 'image-filters', 'pdf-generation'],
    fallback: true,
    preload: true
  }
});
```

### Workflow Management

#### Multi-Stage Approvals
```javascript
const editor = new ArmorEditor({
  container: '#workflow-editor',
  workflow: {
    enabled: true,
    stages: [
      { name: 'draft', role: 'author' },
      { name: 'review', role: 'reviewer' },
      { name: 'legal', role: 'legal-team' },
      { name: 'approved', role: 'manager' }
    ],
    approvals: true,
    notifications: {
      email: true,
      slack: true,
      webhook: '/api/notifications'
    },
    deadlines: true
  }
});

// Submit for approval
await editor.submitForApproval('review');
```

#### Version Control System
```javascript
const editor = new ArmorEditor({
  container: '#version-editor',
  versioning: {
    enabled: true,
    git: true,
    branches: true,
    autoSave: true,
    maxVersions: 100,
    compareVersions: true,
    rollback: true
  }
});

// Create new branch
await editor.createBranch('feature-update');

// Merge branches
await editor.mergeBranch('feature-update', 'main');
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

### **Enterprise Document Management**
```javascript
const enterpriseEditor = new ArmorEditor({
  container: '#enterprise-editor',
  height: '600px',
  
  // Security & Compliance
  encryption: { enabled: true, algorithm: 'RSA-OAEP' },
  compliance: { gdpr: true, hipaa: true, auditLogging: true },
  permissions: { 
    roles: ['admin', 'editor', 'reviewer', 'viewer'],
    defaultRole: 'editor'
  },
  
  // Advanced Workflow
  workflow: {
    enabled: true,
    stages: ['draft', 'legal-review', 'final-approval'],
    approvals: true,
    notifications: true
  },
  
  // Version Control
  versioning: {
    enabled: true,
    git: true,
    branches: true,
    autoSave: true
  },
  
  // Media & Communication
  voiceComments: { enabled: true, maxDuration: 600 },
  videoIntegration: { enabled: true, recording: true },
  
  // Export Options
  export: {
    formats: ['pdf', 'docx', 'html', 'markdown'],
    watermark: true,
    digitalSignature: true
  }
});
```

### **Healthcare Documentation**
```javascript
const healthcareEditor = new ArmorEditor({
  container: '#medical-notes',
  
  // HIPAA Compliance
  compliance: {
    hipaa: true,
    auditLogging: true,
    dataRetention: 2555, // 7 years
    encryption: 'AES-256'
  },
  
  // Secure Authentication
  sso: {
    provider: 'saml',
    endpoint: '/healthcare-sso',
    mfa: true
  },
  
  // Medical Templates
  templates: [
    'patient-assessment',
    'treatment-plan',
    'discharge-summary'
  ],
  
  // Voice-to-Text for Doctors
  voiceComments: {
    enabled: true,
    transcription: true,
    medicalTerms: true
  }
});
```

### **Legal Document Collaboration**
```javascript
const legalEditor = new ArmorEditor({
  container: '#legal-document',
  
  // Track Changes & Comments
  trackChanges: true,
  comments: true,
  
  // Multi-stage Review Process
  workflow: {
    stages: ['draft', 'partner-review', 'client-review', 'final'],
    approvals: ['senior-partner', 'client'],
    deadlines: true
  },
  
  // Version Control
  versioning: {
    git: true,
    branches: ['main', 'client-edits', 'partner-review'],
    compareVersions: true
  },
  
  // Security
  encryption: { enabled: true },
  permissions: {
    roles: ['partner', 'associate', 'paralegal', 'client'],
    documentAccess: 'role-based'
  }
});
```

---

## AI Models & Providers

### Supported AI Providers

ArmorEditor integrates with 5 major AI providers, offering 15+ models for different use cases:

#### 1. OpenAI
| Model | Description | Best For | Context | Cost |
|-------|-------------|----------|---------|------|
| `gpt-4` | Most capable model | Complex writing, analysis | 8K tokens | $$$ |
| `gpt-4-turbo` | Faster GPT-4 variant | Real-time assistance | 128K tokens | $$$ |
| `gpt-3.5-turbo` | Fast and efficient | General writing tasks | 4K tokens | $ |

#### 2. Anthropic Claude
| Model | Description | Best For | Context | Cost |
|-------|-------------|----------|---------|------|
| `claude-3-opus` | Most powerful Claude | Professional content | 200K tokens | $$$ |
| `claude-3-sonnet` | Balanced performance | Business writing | 200K tokens | $$ |
| `claude-3-haiku` | Fastest Claude | Quick edits | 200K tokens | $ |

#### 3. Google Gemini
| Model | Description | Best For | Context | Cost |
|-------|-------------|----------|---------|------|
| `gemini-pro` | Advanced reasoning | Technical writing | 32K tokens | $$ |
| `gemini-pro-vision` | Multimodal support | Content with images | 16K tokens | $$ |

#### 4. Cohere
| Model | Description | Best For | Context | Cost |
|-------|-------------|----------|---------|------|
| `command` | Production model | Enterprise content | 4K tokens | $$ |
| `command-light` | Faster variant | Quick improvements | 4K tokens | $ |
| `command-nightly` | Latest features | Experimental tasks | 4K tokens | $$ |

#### 5. Hugging Face
| Model | Description | Best For | Context | Cost |
|-------|-------------|----------|---------|------|
| `microsoft/DialoGPT-large` | Conversational AI | Dialog writing | 1K tokens | Free |
| `facebook/blenderbot-400M-distill` | Compact model | Basic assistance | 512 tokens | Free |
| `google/flan-t5-large` | Instruction following | Task-specific writing | 512 tokens | Free |

### Configuration Examples

#### Single Provider Setup
```javascript
const editor = new ArmorEditor({
  container: '#editor',
  ai: {
    enabled: true,
    provider: 'openai',
    apiKey: 'your-openai-api-key',
    model: 'gpt-4'
  }
});
```

#### Multi-Provider Setup
```javascript
const editor = new ArmorEditor({
  container: '#editor',
  ai: {
    enabled: true,
    providers: {
      openai: {
        apiKey: 'sk-...',
        models: ['gpt-4', 'gpt-3.5-turbo'],
        defaultModel: 'gpt-4'
      },
      anthropic: {
        apiKey: 'sk-ant-...',
        models: ['claude-3-opus', 'claude-3-sonnet'],
        defaultModel: 'claude-3-sonnet'
      },
      google: {
        apiKey: 'AIza...',
        models: ['gemini-pro'],
        defaultModel: 'gemini-pro'
      }
    }
  }
});
```

### AI Actions Available

| Action | Description | Best Models | Use Case |
|--------|-------------|-------------|----------|
| **Improve Writing** | Enhance clarity and quality | GPT-4, Claude-3-opus | Blog posts, articles |
| **Fix Grammar** | Correct spelling and grammar | GPT-3.5-turbo, Claude-3-haiku | Quick proofreading |
| **Change Tone** | Adjust professional/casual tone | Claude-3-sonnet, GPT-4 | Business communication |
| **Summarize** | Condense long content | Gemini-pro, Command | Executive summaries |
| **Expand Content** | Add details and examples | GPT-4, Claude-3-opus | Educational content |
| **Translate** | Convert to different languages | Gemini-pro, GPT-4 | Multilingual content |
| **Simplify** | Make text easier to understand | Claude-3-haiku, Command-light | User documentation |

### Model Selection Guide

#### For Different Content Types:

**Blog Writing**
- Primary: `gpt-4` (creativity + quality)
- Fallback: `claude-3-sonnet` (balanced performance)

**Business Documents**
- Primary: `claude-3-opus` (professional tone)
- Fallback: `command` (enterprise focus)

**Technical Documentation**
- Primary: `gemini-pro` (technical reasoning)
- Fallback: `gpt-4-turbo` (fast processing)

**Quick Edits**
- Primary: `gpt-3.5-turbo` (speed + cost)
- Fallback: `claude-3-haiku` (efficient)

**Multilingual Content**
- Primary: `gemini-pro` (language support)
- Fallback: `gpt-4` (translation quality)

### API Key Setup

#### Getting API Keys:

1. **OpenAI**: [platform.openai.com](https://platform.openai.com/api-keys)
2. **Anthropic**: [console.anthropic.com](https://console.anthropic.com/)
3. **Google**: [makersuite.google.com](https://makersuite.google.com/app/apikey)
4. **Cohere**: [dashboard.cohere.ai](https://dashboard.cohere.ai/api-keys)
5. **Hugging Face**: [huggingface.co/settings/tokens](https://huggingface.co/settings/tokens)

#### Environment Variables:
```bash
# .env file
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
GOOGLE_API_KEY=AIza...
COHERE_API_KEY=...
HUGGINGFACE_API_KEY=hf_...
```

### Performance Comparison

| Provider | Speed | Quality | Cost Efficiency | Context Length |
|----------|-------|---------|-----------------|----------------|
| OpenAI | 4/5 | 5/5 | 3/5 | 3/5 |
| Anthropic | 4/5 | 5/5 | 3/5 | 5/5 |
| Google | 5/5 | 4/5 | 4/5 | 4/5 |
| Cohere | 4/5 | 3/5 | 4/5 | 3/5 |
| Hugging Face | 3/5 | 2/5 | 5/5 | 2/5 |

### Best Practices

#### Security:
- Store API keys securely (environment variables)
- Use different keys for development/production
- Monitor API usage and costs
- Implement rate limiting

#### Cost Optimization:
- Use cheaper models for simple tasks
- Implement caching for repeated requests
- Set usage limits and monitoring
- Choose appropriate context lengths

#### Performance:
- Select fastest models for real-time use
- Implement fallback providers
- Cache common responses
- Use streaming for long responses

---

## Read-Only Mode

### Enable Read-Only Mode
```javascript
// Initialize as read-only
const editor = new ArmorEditor({
  container: '#editor',
  readOnly: true,
  height: '300px'
});

// Or toggle read-only mode dynamically
editor.setReadOnly(true);  // Enable read-only
editor.setReadOnly(false); // Enable editing
```

### Read-Only Features
- **No Toolbar** - Toolbar is automatically hidden
- **No Editing** - Content cannot be modified by user
- **Accessibility** - Proper ARIA attributes for screen readers
- **Content Display** - Perfect for displaying formatted content
- **Dynamic Toggle** - Switch between read-only and editable modes

### Use Cases
```javascript
// Document viewer
const viewer = new ArmorEditor({
  container: '#document-viewer',
  readOnly: true,
  height: '500px'
});

// Preview mode
const preview = new ArmorEditor({
  container: '#preview',
  readOnly: true,
  theme: 'light'
});

// Toggle for edit/preview
function toggleEditMode() {
  const isReadOnly = editor.isReadOnly();
  editor.setReadOnly(!isReadOnly);
  
  // Update UI
  document.getElementById('edit-btn').textContent = 
    isReadOnly ? 'Preview' : 'Edit';
}
```

### API Methods
| Method | Description |
|--------|-------------|
| `setReadOnly(boolean)` | Enable/disable read-only mode |
| `isReadOnly()` | Check if editor is in read-only mode |

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
| `readOnly` | `boolean` | `false` | Enable read-only mode |
| `spellCheck` | `boolean` | `false` | Enable spell checking |
| `collaboration` | `object` | `null` | Collaboration settings |
| `trackChanges` | `boolean` | `false` | Enable track changes |
| `comments` | `boolean` | `false` | Enable comments |
| `wordCount` | `boolean` | `false` | Show word count |
| `autoSave` | `object` | `null` | Auto-save configuration |
| `mentions` | `object` | `null` | Mentions configuration |
| `ai` | `object` | `null` | AI configuration |
| `encryption` | `object` | `null` | End-to-end encryption settings |
| `sso` | `object` | `null` | SSO/SAML integration |
| `compliance` | `object` | `null` | GDPR/HIPAA compliance |
| `permissions` | `object` | `null` | Role-based permissions |
| `voiceComments` | `object` | `null` | Voice comments configuration |
| `videoIntegration` | `object` | `null` | Video call integration |
| `mediaEditor` | `object` | `null` | Advanced media editor |
| `webComponents` | `object` | `null` | Web Components settings |
| `localAI` | `object` | `null` | Local AI processing |
| `wasm` | `object` | `null` | WebAssembly optimizations |
| `workflow` | `object` | `null` | Workflow management |
| `versioning` | `object` | `null` | Version control system |
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
| `setReadOnly(boolean)` | `void` | Enable/disable read-only mode |
| `isReadOnly()` | `boolean` | Check if editor is in read-only mode |
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

3. **Use proper configuration** for large documents
```javascript
const editor = new ArmorEditor({
  container: '#editor',
  height: '600px',
  autoSave: {
    interval: 30000, // Auto-save every 30 seconds
    callback: (content) => saveContent(content)
  }
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
