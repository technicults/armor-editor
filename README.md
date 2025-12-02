# ArmorEditor 

## We are under development (This is currently being built or improved and is not yet ready for production)

[![npm version](https://badge.fury.io/js/armor-editor.svg)](https://www.npmjs.com/package/armor-editor)
[![Downloads](https://img.shields.io/npm/dt/armor-editor.svg)](https://www.npmjs.com/package/armor-editor)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Size](https://img.shields.io/bundlephobia/minzip/armor-editor.svg)](https://bundlephobia.com/package/armor-editor)

> **The most secure and comprehensive rich text editor for modern web applications**

A powerful, lightweight (58KB) rich text editor that combines enterprise-grade security with cutting-edge AI capabilities. Built for modern teams who need real-time collaboration, voice comments, workflow management, and GDPR/HIPAA compliance. Framework-agnostic design works seamlessly with React, Vue, Angular, Next.js, Nuxt.js, or vanilla JavaScript.

**Why developers choose ArmorEditor:** Zero-config setup, 135+ premium features, 5 AI providers, end-to-end encryption, and the most comprehensive documentation in the industry.

## Quick Start (2 Minutes)

### Install

#### NPM
```bash
npm install armor-editor
```

#### CDN
```html
<script type="module">
  import { ArmorEditor } from 'https://unpkg.com/armor-editor@latest/dist/index.esm.js';
</script>
```

### Use It
```javascript
import { ArmorEditor } from 'armor-editor';

const editor = new ArmorEditor({
  container: '#editor',
  height: '400px',
  placeholder: 'Start typing...'
});
```

### HTML
```html
<div id="editor"></div>
```

**That's it! You have a working rich text editor.**

## Key Features

- **AI Writing Assistant** - 5 providers (OpenAI, Claude, Gemini) with 15+ models, smart suggestions, grammar check, and tone adjustment
- **Real-time Collaboration** - Multi-user editing with live cursors, conflict resolution, and user presence indicators
- **Enterprise Security** - End-to-end encryption (RSA-OAEP, AES-GCM), SSO/SAML integration, GDPR/HIPAA compliance
- **Voice & Video Integration** - Voice comments with transcription, WebRTC video calls, screen sharing, and recording
- **Workflow Management** - Multi-stage approval workflows, Git-like version control, document templates, and automation
- **High Performance** - Virtual scrolling for large documents, WebAssembly optimization, Web Workers for background processing
- **Universal Framework Support** - Zero-config integration with React, Vue, Angular, Next.js, Nuxt.js, and vanilla JavaScript
- **Mobile & Touch Optimized** - Native touch gestures, responsive design, collapsible toolbar, and offline support

## Why Choose ArmorEditor?

| Feature Category | Other Editors | ArmorEditor |
|------------------|---------------|-------------|
| **Bundle Size** | 500KB+ | **58KB (9x smaller)** |
| **AI Integration** | Limited or none | **5 Providers, 15+ Models** |
| **Real-time Collaboration** | Extra cost or basic | **Built-in with live cursors** |
| **Enterprise Security** | Basic or add-on | **E2E encryption, SSO, compliance** |
| **Setup Time** | Hours of configuration | **2 minutes, zero-config** |
| **Framework Support** | Limited frameworks | **All major frameworks** |
| **Voice & Video** | Not available | **Voice comments, video calls** |
| **Workflow Management** | Not available | **Multi-stage approvals, version control** |
| **Performance** | Standard DOM | **Virtual scrolling, WASM, Web Workers** |
| **Documentation** | Basic or outdated | **135+ features, beginner-friendly guides** |
| **Compliance** | Manual implementation | **GDPR/HIPAA ready out-of-the-box** |
| **Cost** | $$$$ per month | **Free and open source** |

## Documentation

**Comprehensive guides with working examples - everything you need to master ArmorEditor:**

- **[Getting Started](./docs/getting-started.md)** - 5-minute setup with examples
- **[AI Features](./docs/ai-features.md)** - Add AI writing assistance
- **[Collaboration](./docs/collaboration.md)** - Real-time team editing
- **[Security](./docs/security.md)** - Enterprise security & compliance
- **[Media Features](./docs/media-features.md)** - Voice, video, media editing
- **[Workflow](./docs/workflow.md)** - Approval workflows & version control
- **[Performance](./docs/performance.md)** - Optimization & scaling
- **[API Reference](./docs/api-reference.md)** - Complete method documentation
- **[All Features](./docs/FEATURES.md)** - Complete list of 135+ features

## Use Cases

- **Content Management** - Blogs, articles, documentation with AI writing assistance and SEO optimization
- **Team Collaboration** - Real-time document editing with live cursors, comments, and approval workflows
- **Healthcare** - HIPAA-compliant medical records with voice notes, encryption, and audit trails
- **Legal** - Secure document workflows with digital signatures, version control, and attorney-client privilege
- **Education** - Interactive learning materials with voice feedback, video lessons, and student collaboration
- **Enterprise** - Business process automation with multi-stage approvals, SSO integration, and compliance reporting
- **Financial Services** - SOX-compliant financial documentation with encryption, audit logs, and regulatory reporting
- **Government** - Secure government documents with classification levels, access controls, and compliance tracking

## Browser Support

| Browser | Version | Features |
|---------|---------|----------|
| Chrome | 58+ | ✅ All features |
| Firefox | 55+ | ✅ All features |
| Safari | 12+ | ✅ All features |
| Edge | 79+ | ✅ All features |

## License

MIT License - see [LICENSE](./LICENSE) file.

## Community

- **[GitHub Issues](https://github.com/technicults/armor-editor/issues)** - Bug reports & feature requests

## Links

- **[Documentation](./docs/README.md)** - Complete guides
- **[GitHub](https://github.com/technicults/armor-editor)** - Source code
- **[NPM](https://www.npmjs.com/package/armor-editor)** - Package
- **[Issues](https://github.com/technicults/armor-editor/issues)** - Bug reports

---

**Made with ❤️ by the [Technicults](https://github.com/technicults) team**
