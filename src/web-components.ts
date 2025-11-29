// Web Components Architecture
export class ArmorEditorElement extends HTMLElement {
  private editor: any;
  private shadow: ShadowRoot;

  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: 'open' });
    this.setupStyles();
  }

  static get observedAttributes() {
    return ['height', 'theme', 'readonly', 'placeholder'];
  }

  connectedCallback() {
    this.render();
    this.initializeEditor();
  }

  disconnectedCallback() {
    this.editor?.destroy();
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    if (oldValue !== newValue) {
      this.handleAttributeChange(name, newValue);
    }
  }

  private setupStyles() {
    const style = document.createElement('style');
    style.textContent = `
      :host {
        display: block;
        width: 100%;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      }
      
      .armor-editor-container {
        border: 1px solid #e1e5e9;
        border-radius: 8px;
        overflow: hidden;
      }
      
      .armor-editor-toolbar {
        background: #f8f9fa;
        border-bottom: 1px solid #e1e5e9;
        padding: 8px;
        display: flex;
        gap: 4px;
        flex-wrap: wrap;
      }
      
      .armor-editor-content {
        min-height: 200px;
        padding: 16px;
        outline: none;
        line-height: 1.6;
      }
      
      .toolbar-button {
        padding: 6px 8px;
        border: 1px solid transparent;
        border-radius: 4px;
        background: transparent;
        cursor: pointer;
        font-size: 14px;
      }
      
      .toolbar-button:hover {
        background: #e9ecef;
        border-color: #dee2e6;
      }
      
      .toolbar-button.active {
        background: #007bff;
        color: white;
        border-color: #0056b3;
      }
    `;
    this.shadow.appendChild(style);
  }

  private render() {
    const container = document.createElement('div');
    container.className = 'armor-editor-container';
    
    const toolbar = document.createElement('div');
    toolbar.className = 'armor-editor-toolbar';
    toolbar.innerHTML = this.getToolbarHTML();
    
    const content = document.createElement('div');
    content.className = 'armor-editor-content';
    content.contentEditable = 'true';
    content.setAttribute('data-placeholder', this.getAttribute('placeholder') || 'Start typing...');
    
    container.appendChild(toolbar);
    container.appendChild(content);
    this.shadow.appendChild(container);
  }

  private getToolbarHTML(): string {
    return `
      <button class="toolbar-button" data-command="bold" title="Bold">
        <strong>B</strong>
      </button>
      <button class="toolbar-button" data-command="italic" title="Italic">
        <em>I</em>
      </button>
      <button class="toolbar-button" data-command="underline" title="Underline">
        <u>U</u>
      </button>
      <span class="toolbar-separator">|</span>
      <button class="toolbar-button" data-command="insertUnorderedList" title="Bullet List">
        • List
      </button>
      <button class="toolbar-button" data-command="insertOrderedList" title="Numbered List">
        1. List
      </button>
      <span class="toolbar-separator">|</span>
      <button class="toolbar-button" data-command="createLink" title="Insert Link">
        🔗 Link
      </button>
      <button class="toolbar-button" data-command="insertImage" title="Insert Image">
        🖼️ Image
      </button>
    `;
  }

  private initializeEditor() {
    const toolbar = this.shadow.querySelector('.armor-editor-toolbar');
    const content = this.shadow.querySelector('.armor-editor-content') as HTMLElement;
    
    // Setup toolbar event listeners
    toolbar?.addEventListener('click', (e) => {
      const button = (e.target as HTMLElement).closest('.toolbar-button');
      if (button) {
        const command = button.getAttribute('data-command');
        if (command) {
          this.executeCommand(command);
        }
      }
    });

    // Setup content event listeners
    content?.addEventListener('input', () => {
      this.dispatchEvent(new CustomEvent('content-change', {
        detail: { content: content.innerHTML }
      }));
    });

    content?.addEventListener('selectionchange', () => {
      this.updateToolbarState();
    });

    // Apply initial attributes
    this.applyAttributes();
  }

  private executeCommand(command: string) {
    const content = this.shadow.querySelector('.armor-editor-content');
    content?.focus();

    switch (command) {
      case 'createLink':
        const url = prompt('Enter URL:');
        if (url) {
          document.execCommand('createLink', false, url);
        }
        break;
      case 'insertImage':
        const imgUrl = prompt('Enter image URL:');
        if (imgUrl) {
          document.execCommand('insertImage', false, imgUrl);
        }
        break;
      default:
        document.execCommand(command, false);
    }

    this.updateToolbarState();
  }

  private updateToolbarState() {
    const buttons = this.shadow.querySelectorAll('.toolbar-button[data-command]');
    
    buttons.forEach(button => {
      const command = button.getAttribute('data-command');
      if (command && ['bold', 'italic', 'underline'].includes(command)) {
        const isActive = document.queryCommandState(command);
        button.classList.toggle('active', isActive);
      }
    });
  }

  private handleAttributeChange(name: string, value: string) {
    switch (name) {
      case 'height':
        this.setHeight(value);
        break;
      case 'theme':
        this.setTheme(value);
        break;
      case 'readonly':
        this.setReadOnly(value === 'true');
        break;
      case 'placeholder':
        this.setPlaceholder(value);
        break;
    }
  }

  private applyAttributes() {
    const height = this.getAttribute('height');
    const theme = this.getAttribute('theme');
    const readonly = this.getAttribute('readonly');
    const placeholder = this.getAttribute('placeholder');

    if (height) this.setHeight(height);
    if (theme) this.setTheme(theme);
    if (readonly) this.setReadOnly(readonly === 'true');
    if (placeholder) this.setPlaceholder(placeholder);
  }

  private setHeight(height: string) {
    const content = this.shadow.querySelector('.armor-editor-content') as HTMLElement;
    if (content) {
      content.style.minHeight = height;
    }
  }

  private setTheme(theme: string) {
    const container = this.shadow.querySelector('.armor-editor-container') as HTMLElement;
    if (container) {
      container.setAttribute('data-theme', theme);
      
      if (theme === 'dark') {
        container.style.background = '#2d3748';
        container.style.color = '#e2e8f0';
        container.style.borderColor = '#4a5568';
      } else {
        container.style.background = '';
        container.style.color = '';
        container.style.borderColor = '';
      }
    }
  }

  private setReadOnly(readonly: boolean) {
    const content = this.shadow.querySelector('.armor-editor-content') as HTMLElement;
    const toolbar = this.shadow.querySelector('.armor-editor-toolbar') as HTMLElement;
    
    if (content) {
      content.contentEditable = readonly ? 'false' : 'true';
    }
    
    if (toolbar) {
      toolbar.style.display = readonly ? 'none' : 'flex';
    }
  }

  private setPlaceholder(placeholder: string) {
    const content = this.shadow.querySelector('.armor-editor-content') as HTMLElement;
    if (content) {
      content.setAttribute('data-placeholder', placeholder);
    }
  }

  // Public API methods
  getContent(): string {
    const content = this.shadow.querySelector('.armor-editor-content');
    return content?.innerHTML || '';
  }

  setContent(html: string) {
    const content = this.shadow.querySelector('.armor-editor-content');
    if (content) {
      content.innerHTML = html;
    }
  }

  getText(): string {
    const content = this.shadow.querySelector('.armor-editor-content');
    return content?.textContent || '';
  }

  focus() {
    const content = this.shadow.querySelector('.armor-editor-content') as HTMLElement;
    content?.focus();
  }

  insertHTML(html: string) {
    const content = this.shadow.querySelector('.armor-editor-content');
    content?.focus();
    document.execCommand('insertHTML', false, html);
  }
}

// Register the custom element
if (!customElements.get('armor-editor')) {
  customElements.define('armor-editor', ArmorEditorElement);
}

// Micro-frontend support
export class ArmorEditorMicrofrontend {
  private container: HTMLElement;
  private editor: ArmorEditorElement;

  constructor(container: HTMLElement | string) {
    if (typeof container === 'string') {
      const element = document.querySelector(container);
      if (!element) throw new Error(`Container not found: ${container}`);
      this.container = element as HTMLElement;
    } else {
      this.container = container;
    }

    this.editor = new ArmorEditorElement();
    this.container.appendChild(this.editor);
  }

  // Proxy methods to the web component
  getContent(): string {
    return this.editor.getContent();
  }

  setContent(html: string) {
    this.editor.setContent(html);
  }

  getText(): string {
    return this.editor.getText();
  }

  focus() {
    this.editor.focus();
  }

  insertHTML(html: string) {
    this.editor.insertHTML(html);
  }

  setAttribute(name: string, value: string) {
    this.editor.setAttribute(name, value);
  }

  addEventListener(event: string, handler: EventListener) {
    this.editor.addEventListener(event, handler);
  }

  destroy() {
    this.editor.remove();
  }
}
