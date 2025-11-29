# AI Features

ArmorEditor includes advanced AI capabilities with support for 5 major providers and 15+ models.

## Overview

The AI system provides intelligent writing assistance, content generation, and smart suggestions to enhance your writing experience.

## Supported Providers

| Provider | Models | Best For | Cost |
|----------|--------|----------|------|
| **OpenAI** | GPT-4, GPT-3.5-turbo, GPT-4-turbo | General writing, creativity | $$$ |
| **Anthropic** | Claude-3-opus, Claude-3-sonnet, Claude-3-haiku | Professional content, analysis | $$$ |
| **Google** | Gemini-pro, Gemini-pro-vision | Technical writing, multimodal | $$ |
| **Cohere** | Command, Command-light, Command-nightly | Enterprise content | $$ |
| **Hugging Face** | DialoGPT, BlenderBot, Flan-T5 | Free alternatives | Free |

## Configuration

### Single Provider Setup
```javascript
const editor = new ArmorEditor({
  container: '#editor',
  ai: {
    enabled: true,
    provider: 'openai',
    apiKey: 'sk-your-api-key',
    model: 'gpt-4'
  }
})
```

### Multi-Provider Setup
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
})
```

## Features

### 1. Smart Suggestions
Automatic content analysis and improvement suggestions.

**How it works:**
- Analyzes text as you type (1-second delay)
- Shows contextual suggestions in a popup
- One-click to apply suggestions

**Use cases:**
- Blog writing
- Email composition
- Document editing
- Creative writing

### 2. AI Writing Assistant
Manual AI assistance with multiple actions.

**Available Actions:**
- **Improve Writing** - Enhance clarity and quality
- **Fix Grammar** - Correct spelling and grammar
- **Change Tone** - Adjust professional/casual tone
- **Summarize** - Condense long content
- **Expand Content** - Add details and examples
- **Translate** - Convert to different languages
- **Custom Prompt** - Your own AI instructions

**How to use:**
1. Select text in editor
2. Click AI button in toolbar
3. Choose provider and model
4. Select action or enter custom prompt
5. Review and accept changes

### 3. Template System
Pre-built content templates with AI integration.

**Trigger:** Type `/` at the beginning of a line

**Available Templates:**
- Blog Post
- Meeting Notes
- Email Template
- Project Proposal
- Technical Documentation
- Creative Writing

**Template Example:**
```markdown
# {{title}}

{{introduction}}

## Main Content
{{main_points}}

## Conclusion
{{conclusion}}
```

## Use Cases

### Blog Writing
```javascript
const blogEditor = new ArmorEditor({
  container: '#blog-editor',
  ai: {
    enabled: true,
    providers: {
      openai: {
        apiKey: process.env.OPENAI_API_KEY,
        defaultModel: 'gpt-4'
      }
    }
  }
})

// Usage:
// 1. Type "/" → Select "Blog Post" template
// 2. Write content → Get smart suggestions
// 3. Select paragraphs → Use "Improve Writing"
// 4. Final review → Use "Fix Grammar"
```

### Business Documentation
```javascript
const businessEditor = new ArmorEditor({
  container: '#business-editor',
  ai: {
    enabled: true,
    providers: {
      anthropic: {
        apiKey: process.env.ANTHROPIC_API_KEY,
        defaultModel: 'claude-3-opus' // Best for professional content
      }
    }
  }
})

// Usage:
// 1. Draft content normally
// 2. Select sections → "Change Tone" to professional
// 3. Use "Summarize" for executive summaries
// 4. "Expand Content" for detailed explanations
```

### Creative Writing
```javascript
const creativeEditor = new ArmorEditor({
  container: '#creative-editor',
  ai: {
    enabled: true,
    providers: {
      openai: {
        apiKey: process.env.OPENAI_API_KEY,
        defaultModel: 'gpt-4' // Best for creativity
      }
    }
  }
})

// Usage:
// 1. Start with basic plot outline
// 2. Use custom prompts: "Continue this story with more dialogue"
// 3. "Expand Content" for scene descriptions
// 4. "Change Tone" for different character voices
```

### Technical Documentation
```javascript
const techEditor = new ArmorEditor({
  container: '#tech-editor',
  ai: {
    enabled: true,
    providers: {
      google: {
        apiKey: process.env.GOOGLE_API_KEY,
        defaultModel: 'gemini-pro' // Best for technical content
      }
    }
  }
})

// Usage:
// 1. Write technical explanations
// 2. Use "Simplify" for user-friendly versions
// 3. "Expand Content" for detailed API docs
// 4. Custom prompts for code examples
```

## API Methods

### Generate Content
```javascript
const content = await editor.generateContent('Write a blog post about AI in education')
```

### Add Custom Template
```javascript
editor.addContentTemplate({
  id: 'custom-template',
  name: 'Custom Template',
  description: 'My custom template',
  category: 'Personal',
  content: '# {{title}}\n\n{{content}}',
  variables: ['title', 'content']
})
```

## Best Practices

### Model Selection
- **GPT-4**: Complex writing, creativity, analysis
- **Claude-3-opus**: Professional documents, long-form content
- **Gemini-pro**: Technical writing, code documentation
- **GPT-3.5-turbo**: Quick edits, cost-effective
- **Claude-3-haiku**: Fast processing, simple tasks

### Cost Optimization
- Use cheaper models for simple tasks
- Implement request caching
- Set usage limits
- Monitor API costs

### Security
- Store API keys in environment variables
- Use different keys for dev/production
- Implement rate limiting
- Monitor usage patterns

## Troubleshooting

### Common Issues

**AI button not appearing:**
```javascript
// Ensure AI is enabled
ai: { enabled: true }
```

**API calls failing:**
```javascript
// Check API key configuration
console.log('API Key configured:', !!editor.options.ai?.apiKey)
```

**No suggestions appearing:**
```javascript
// Check content length (minimum 10 characters)
// Verify provider configuration
```

### Error Handling
```javascript
const editor = new ArmorEditor({
  ai: {
    enabled: true,
    onError: (error) => {
      console.error('AI Error:', error)
      // Handle gracefully
    }
  }
})
```

## Performance Tips

1. **Debounce suggestions** - Default 1-second delay
2. **Cache responses** - Store common requests
3. **Use appropriate models** - Match complexity to task
4. **Limit context length** - Trim long texts
5. **Implement fallbacks** - Handle API failures

## Examples

See the [examples directory](../examples/) for complete implementation examples:
- [Blog Editor with AI](../examples/blog-editor-ai.html)
- [Business Document Assistant](../examples/business-ai.html)
- [Creative Writing Tool](../examples/creative-ai.html)
- [Technical Documentation](../examples/tech-docs-ai.html)
