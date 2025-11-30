# Getting Started - Simple Guide

Learn ArmorEditor in 5 minutes with copy-paste examples.

## Step 1: Install

```bash
npm install armor-editor
```

## Step 2: Basic Example

Copy this code and it works:

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
            placeholder: 'Start typing...'
        });
    </script>
</body>
</html>
```

**That's it!** You now have a working rich text editor.

## Step 3: Add Features

### Add AI Writing Help
```javascript
const editor = new ArmorEditor({
    container: '#editor',
    height: '400px',
    ai: {
        enabled: true,
        apiKey: 'your-openai-key',
        provider: 'openai'
    }
});
```

### Add Real-time Collaboration
```javascript
const editor = new ArmorEditor({
    container: '#editor',
    height: '400px',
    collaboration: {
        enabled: true,
        channelId: 'my-document',
        userId: 'user-123',
        userName: 'John Doe'
    }
});
```

### Add Voice Comments
```javascript
const editor = new ArmorEditor({
    container: '#editor',
    height: '400px',
    voiceComments: {
        enabled: true,
        transcription: true
    }
});
```

## Framework Examples

### React
```jsx
import { useEffect, useRef } from 'react';
import { ArmorEditor } from 'armor-editor';

function MyEditor() {
  const editorRef = useRef();
  
  useEffect(() => {
    const editor = new ArmorEditor({
      container: editorRef.current,
      height: '400px'
    });
    
    return () => editor.destroy();
  }, []);
  
  return <div ref={editorRef}></div>;
}
```

### Vue
```vue
<template>
  <div ref="editor"></div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { ArmorEditor } from 'armor-editor';

const editor = ref();

onMounted(() => {
  new ArmorEditor({
    container: editor.value,
    height: '400px'
  });
});
</script>
```

### Next.js
```jsx
'use client';
import { useEffect, useRef, useState } from 'react';

export default function Editor() {
  const editorRef = useRef();
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => setMounted(true), []);
  
  useEffect(() => {
    if (mounted) {
      import('armor-editor').then(({ ArmorEditor }) => {
        new ArmorEditor({
          container: editorRef.current,
          height: '400px'
        });
      });
    }
  }, [mounted]);
  
  if (!mounted) return <div>Loading...</div>;
  return <div ref={editorRef}></div>;
}
```

## Common Options

```javascript
const editor = new ArmorEditor({
    container: '#editor',           // Where to put editor
    height: '400px',               // How tall
    width: '100%',                 // How wide
    theme: 'light',                // 'light' or 'dark'
    placeholder: 'Start typing...', // Placeholder text
    readOnly: false,               // Can edit or not
    
    // Toolbar buttons
    toolbar: [
        'bold', 'italic', 'underline',
        'fontSize', 'textColor',
        'alignLeft', 'alignCenter', 'alignRight',
        'orderedList', 'unorderedList',
        'link', 'image'
    ]
});
```

## Get/Set Content

```javascript
// Get content
const content = editor.getContent();
console.log(content); // HTML string

// Set content
editor.setContent('<p>Hello <strong>world</strong>!</p>');

// Get plain text
const text = editor.getText();
console.log(text); // "Hello world!"

// Clear everything
editor.clear();
```

## Events

```javascript
const editor = new ArmorEditor({
    container: '#editor',
    onChange: (content) => {
        console.log('Content changed:', content);
    },
    onReady: () => {
        console.log('Editor is ready!');
    }
});

// Or add events later
editor.on('contentChanged', (content) => {
    console.log('New content:', content);
});
```

## Next Steps

1. **[ai-features.md](./ai-features.md)** - Add AI writing help
2. **[collaboration.md](./collaboration.md)** - Add team editing
3. **[security.md](./security.md)** - Add security features
4. **[media-features.md](./media-features.md)** - Add voice/video
5. **[FEATURES.md](./FEATURES.md)** - See all 135+ features

## Need Help?

- Check [api-reference.md](./api-reference.md) for all methods
- All features are in [FEATURES.md](./FEATURES.md)
- Simple examples are in each guide
