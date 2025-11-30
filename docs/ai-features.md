# AI Features - Simple Guide

Add smart writing help to your editor with copy-paste examples.

## Quick Start

```javascript
const editor = new ArmorEditor({
    container: '#editor',
    ai: {
        enabled: true,
        apiKey: 'your-openai-key',
        provider: 'openai'
    }
});
```

**That's it!** Now you have AI writing assistance.

## AI Providers

### OpenAI (Recommended)
```javascript
ai: {
    enabled: true,
    provider: 'openai',
    apiKey: 'sk-your-key',
    model: 'gpt-4'
}
```

### Anthropic Claude
```javascript
ai: {
    enabled: true,
    provider: 'anthropic',
    apiKey: 'sk-ant-your-key',
    model: 'claude-3-opus'
}
```

### Google Gemini
```javascript
ai: {
    enabled: true,
    provider: 'google',
    apiKey: 'AIza-your-key',
    model: 'gemini-pro'
}
```

### Multiple Providers
```javascript
ai: {
    enabled: true,
    providers: {
        openai: {
            apiKey: 'sk-...',
            model: 'gpt-4'
        },
        anthropic: {
            apiKey: 'sk-ant-...',
            model: 'claude-3-opus'
        }
    }
}
```

## What AI Can Do

### 1. Smart Suggestions
AI gives you writing tips as you type.

```javascript
const editor = new ArmorEditor({
    container: '#editor',
    ai: {
        enabled: true,
        apiKey: 'your-key',
        smartSuggestions: true
    }
});
```

### 2. Generate Content
Ask AI to write content for you.

```javascript
// Generate a blog post
const content = await editor.generateContent('Write a blog post about cats');
editor.setContent(content);
```

### 3. Fix Grammar
AI fixes your grammar and spelling.

```javascript
const text = "This are wrong grammer";
const fixed = await editor.fixGrammar(text);
console.log(fixed); // "This is wrong grammar"
```

### 4. Change Tone
Make text more professional or casual.

```javascript
const casual = "Hey, what's up?";
const professional = await editor.adjustTone(casual, 'professional');
console.log(professional); // "Hello, how are you?"
```

### 5. Summarize Text
Make long text shorter.

```javascript
const longText = "Very long article about something...";
const summary = await editor.summarizeContent(longText);
console.log(summary); // Short summary
```

## Templates with AI

Type "/" to get AI templates:

```javascript
const editor = new ArmorEditor({
    container: '#editor',
    ai: {
        enabled: true,
        apiKey: 'your-key',
        templates: true
    }
});

// Now type "/" in the editor to see templates like:
// /blog - Blog post template
// /email - Email template  
// /report - Report template
```

## Real Examples

### Blog Writing
```html
<!DOCTYPE html>
<html>
<body>
    <div id="blog-editor"></div>
    
    <script type="module">
        import { ArmorEditor } from 'armor-editor';
        
        const editor = new ArmorEditor({
            container: '#blog-editor',
            height: '500px',
            ai: {
                enabled: true,
                provider: 'openai',
                apiKey: 'your-openai-key'
            }
        });
        
        // Generate blog outline
        async function generateBlog() {
            const outline = await editor.generateContent('Create a blog post about healthy eating');
            editor.setContent(outline);
        }
        
        // Add button to generate
        document.body.innerHTML += '<button onclick="generateBlog()">Generate Blog</button>';
    </script>
</body>
</html>
```

### Email Assistant
```html
<!DOCTYPE html>
<html>
<body>
    <div id="email-editor"></div>
    
    <script type="module">
        import { ArmorEditor } from 'armor-editor';
        
        const editor = new ArmorEditor({
            container: '#email-editor',
            height: '300px',
            ai: {
                enabled: true,
                provider: 'anthropic',
                apiKey: 'your-anthropic-key'
            }
        });
        
        // Make email professional
        async function makeProfessional() {
            const content = editor.getText();
            const professional = await editor.adjustTone(content, 'professional');
            editor.setContent(professional);
        }
    </script>
</body>
</html>
```

### Grammar Checker
```html
<!DOCTYPE html>
<html>
<body>
    <div id="grammar-editor"></div>
    <button onclick="checkGrammar()">Fix Grammar</button>
    
    <script type="module">
        import { ArmorEditor } from 'armor-editor';
        
        const editor = new ArmorEditor({
            container: '#grammar-editor',
            height: '300px',
            ai: {
                enabled: true,
                provider: 'openai',
                apiKey: 'your-key'
            }
        });
        
        window.checkGrammar = async function() {
            const text = editor.getText();
            const fixed = await editor.fixGrammar(text);
            editor.setContent(fixed);
        }
    </script>
</body>
</html>
```

## API Methods

```javascript
// Generate content
const content = await editor.generateContent('Write about dogs');

// Improve text
const better = await editor.improveContent('This is text');

// Fix grammar
const fixed = await editor.fixGrammar('This are wrong');

// Change tone
const formal = await editor.adjustTone(text, 'professional');
const casual = await editor.adjustTone(text, 'casual');

// Summarize
const summary = await editor.summarizeContent(longText);

// Expand content
const longer = await editor.expandContent(shortText);
```

## Events

```javascript
const editor = new ArmorEditor({
    container: '#editor',
    ai: { enabled: true, apiKey: 'your-key' }
});

// When AI starts working
editor.on('aiRequestStarted', () => {
    console.log('AI is thinking...');
});

// When AI finishes
editor.on('aiRequestCompleted', (result) => {
    console.log('AI finished:', result);
});

// If AI has error
editor.on('aiError', (error) => {
    console.log('AI error:', error);
});
```

## Tips

### Get API Keys
1. **OpenAI**: Go to [platform.openai.com](https://platform.openai.com)
2. **Anthropic**: Go to [console.anthropic.com](https://console.anthropic.com)
3. **Google**: Go to [makersuite.google.com](https://makersuite.google.com)

### Save Money
```javascript
ai: {
    enabled: true,
    apiKey: 'your-key',
    model: 'gpt-3.5-turbo', // Cheaper than gpt-4
    maxTokens: 500,         // Limit response length
    temperature: 0.7        // Control creativity
}
```

### Handle Errors
```javascript
editor.on('aiError', (error) => {
    if (error.code === 'INVALID_API_KEY') {
        alert('Please check your API key');
    } else if (error.code === 'RATE_LIMIT') {
        alert('Too many requests, please wait');
    }
});
```

## Common Issues

**AI button not showing?**
```javascript
// Make sure AI is enabled
ai: { enabled: true }
```

**API key not working?**
```javascript
// Check your API key is correct
console.log('API Key:', editor.options.ai.apiKey);
```

**Requests failing?**
```javascript
// Check internet connection and API limits
editor.on('aiError', (error) => {
    console.error('AI Error:', error);
});
```

That's it! You now have AI writing assistance in your editor.
