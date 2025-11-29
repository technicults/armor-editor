// Version info
export const VERSION = '1.0.8';

import { icons } from './icons';

export interface EditorOptions {
  container: HTMLElement | string;
  placeholder?: string;
  toolbar?: boolean | string[];
  height?: string;
  width?: string;
  theme?: 'light' | 'dark';
  language?: string;
  plugins?: string[];
  onChange?: (content: string) => void;
  onReady?: () => void;
  uploadUrl?: string;
  collaboration?: {
    channelId: string;
    userId: string;
    userName: string;
  };
  trackChanges?: boolean;
  comments?: boolean;
  spellCheck?: boolean;
  spellCheckOptions?: {
    language?: string;
    apiKey?: string;
    customDictionary?: string[];
  };
  wordCount?: boolean;
  autoSave?: {
    interval: number;
    callback: (content: string) => void;
  };
  export?: {
    pdf?: boolean;
    word?: boolean;
  };
  mathType?: boolean;
  mediaEmbed?: boolean;
  mentions?: {
    feeds: Array<{name: string, id: string}>;
  };
  customFonts?: string[];
  customCSS?: string;
}

export class ArmorEditor {
  private container!: HTMLElement;
  private editor!: HTMLDivElement;
  private toolbar!: HTMLDivElement;
  private options: EditorOptions;
  private colorPicker: HTMLDivElement | null = null;
  private linkDialog: HTMLDivElement | null = null;
  private imageDialog: HTMLDivElement | null = null;
  private tableDialog: HTMLDivElement | null = null;
  private commentSidebar: HTMLDivElement | null = null;
  private trackChangesPanel: HTMLDivElement | null = null;
  private wordCountPanel: HTMLDivElement | null = null;
  private collaborators: Map<string, any> = new Map();
  private comments: Array<any> = [];
  private changes: Array<{id: string, type: string, text: string, author: string, timestamp: string}> = [];
  private autoSaveTimer: number | null = null;
  private spellCheckEnabled = false;
  private isSSR = false;

  private undoStack: string[] = [];
  private redoStack: string[] = [];
  private maxUndoSteps = 50;
  private lastContent = '';

  constructor(options: EditorOptions) {
    // Check for SSR environment
    this.isSSR = typeof window === 'undefined' || typeof document === 'undefined';
    
    if (this.isSSR) {
      console.warn('ArmorEditor: SSR detected. Editor will initialize on client-side.');
      this.options = { theme: 'light', ...options };
      return;
    }

    this.options = { theme: 'light', ...options };
    
    if (typeof options.container === 'string') {
      const element = document.querySelector(options.container);
      if (!element) {
        throw new Error(`Container element not found: ${options.container}`);
      }
      this.container = element as HTMLElement;
    } else {
      this.container = options.container;
    }
    
    this.loadGoogleFonts();
    
    // Delay initialization for Next.js/Nuxt hydration
    if (this.isNextJS() || this.isNuxtJS()) {
      this.delayedInit();
    } else {
      this.init();
    }
  }

  private loadGoogleFonts() {
    if (!this.options.customFonts || this.options.customFonts.length === 0) return;
    
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = `https://fonts.googleapis.com/css2?${this.options.customFonts.map(font => 
      `family=${font.replace(/\s+/g, '+')}`
    ).join('&')}&display=swap`;
    document.head.appendChild(link);
  }

  private isNextJS(): boolean {
    return typeof window !== 'undefined' && 
           (window as any).__NEXT_DATA__ !== undefined;
  }

  private isNuxtJS(): boolean {
    return typeof window !== 'undefined' && 
           ((window as any).__NUXT__ !== undefined || 
            (window as any).$nuxt !== undefined);
  }

  private delayedInit(): void {
    // Wait for hydration to complete
    if (typeof window !== 'undefined') {
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
          setTimeout(() => {
            this.init();
            // Ensure onReady is called
            if (!this.isSSR) {
              this.options.onReady?.();
            }
          }, 100);
        });
      } else {
        setTimeout(() => {
          this.init();
          // Ensure onReady is called
          if (!this.isSSR) {
            this.options.onReady?.();
          }
        }, 100);
      }
    }
  }

  // Static method for SSR-safe initialization
  static create(options: EditorOptions): Promise<ArmorEditor> {
    return new Promise((resolve) => {
      if (typeof window === 'undefined') {
        // Return a placeholder for SSR
        resolve(new ArmorEditor(options));
      } else {
        const editor = new ArmorEditor(options);
        if (editor.isSSR) {
          // Wait for client-side hydration
          const checkReady = () => {
            if (!editor.isSSR && editor.editor) {
              resolve(editor);
            } else {
              setTimeout(checkReady, 50);
            }
          };
          checkReady();
        } else {
          resolve(editor);
        }
      }
    });
  }

  private init() {
    // Skip initialization in SSR
    if (this.isSSR) return;
    
    this.container.innerHTML = '';
    this.setupStyles();
    
    if (this.options.toolbar !== false) {
      this.createToolbar();
    }
    
    this.createEditor();
    this.attachEvents();
    this.setupAutoSave();
    this.setupCollaboration();
    
    if (this.options.spellCheck) {
      this.toggleSpellCheck();
    }
    
    if (this.options.wordCount) {
      this.toggleWordCount();
    }
    
    // Mark as client-side initialized
    this.isSSR = false;
    
    // Initialize undo system
    this.lastContent = this.getContent();
    
    // Expose methods globally for track changes
    (window as any).armorEditor = {
      acceptChange: (id: string) => this.acceptChange(id),
      rejectChange: (id: string) => this.rejectChange(id)
    };
    
    this.options.onReady?.();
  }

  private setupStyles() {
    const isDark = this.options.theme === 'dark';
    this.container.style.cssText = `
      border: 1px solid ${isDark ? '#444' : '#ddd'};
      border-radius: 4px;
      font-family: Arial, sans-serif;
      background: ${isDark ? '#2d2d2d' : '#fff'};
      color: ${isDark ? '#fff' : '#000'};
      ${this.options.width ? `width: ${this.options.width};` : ''}
    `;
    
    // Add global styles for SVG icons and collaboration
    if (!document.querySelector('#armor-editor-styles')) {
      const style = document.createElement('style');
      style.id = 'armor-editor-styles';
      style.textContent = `
        .armor-editor-toolbar button svg {
          width: 16px;
          height: 16px;
          pointer-events: none;
        }
        .armor-editor-toolbar button:hover svg {
          opacity: 0.8;
        }
        .armor-editor-toolbar button:active svg {
          opacity: 0.6;
        }
        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
        .collaborators-panel {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }
      `;
      document.head.appendChild(style);
    }
  }

  private createToolbar() {
    const isDark = this.options.theme === 'dark';
    this.toolbar = document.createElement('div');
    this.toolbar.className = 'armor-editor-toolbar';
    this.toolbar.style.cssText = `
      border-bottom: 1px solid ${isDark ? '#444' : '#ddd'};
      padding: 8px;
      background: ${isDark ? '#333' : '#f9f9f9'};
      display: flex;
      flex-wrap: wrap;
      gap: 4px;
      align-items: center;
    `;
    
    const toolbarItems = Array.isArray(this.options.toolbar) 
      ? this.options.toolbar 
      : ['bold', 'italic', 'underline', 'strikethrough', '|', 'fontSize', 'fontFamily', 'textColor', 'backgroundColor', '|', 
         'alignLeft', 'alignCenter', 'alignRight', 'alignJustify', '|', 'orderedList', 'unorderedList', 'indent', 'outdent', '|',
         'link', 'image', 'table', 'code', 'blockquote', '|', 'mathType', 'mediaEmbed', 'mentions', '|',
         'trackChanges', 'comments', 'spellCheck', '|', 'exportPdf', 'exportWord', 'importWord', '|',
         'undo', 'redo', 'removeFormat', 'fullscreen', 'wordCount'];

    toolbarItems.forEach(item => {
      if (item === '|') {
        const separator = document.createElement('div');
        separator.style.cssText = `width: 1px; height: 20px; background: ${isDark ? '#555' : '#ccc'}; margin: 0 4px;`;
        this.toolbar.appendChild(separator);
      } else {
        this.createToolbarButton(item);
      }
    });

    this.container.appendChild(this.toolbar);
  }

  private createToolbarButton(type: string) {
    const isDark = this.options.theme === 'dark';
    
    const buttons: Record<string, {icon: string, title: string, action: () => void}> = {
      bold: { icon: icons.bold, title: 'Bold', action: () => this.execCommand('bold') },
      italic: { icon: icons.italic, title: 'Italic', action: () => this.execCommand('italic') },
      underline: { icon: icons.underline, title: 'Underline', action: () => this.execCommand('underline') },
      strikethrough: { icon: icons.strikethrough, title: 'Strikethrough', action: () => this.execCommand('strikethrough') },
      alignLeft: { icon: icons.alignLeft, title: 'Align Left', action: () => this.execCommand('justifyLeft') },
      alignCenter: { icon: icons.alignCenter, title: 'Align Center', action: () => this.execCommand('justifyCenter') },
      alignRight: { icon: icons.alignRight, title: 'Align Right', action: () => this.execCommand('justifyRight') },
      alignJustify: { icon: icons.alignJustify, title: 'Justify', action: () => this.execCommand('justifyFull') },
      orderedList: { icon: icons.orderedList, title: 'Ordered List', action: () => this.execCommand('insertOrderedList') },
      unorderedList: { icon: icons.unorderedList, title: 'Unordered List', action: () => this.execCommand('insertUnorderedList') },
      indent: { icon: icons.indent, title: 'Indent', action: () => this.execCommand('indent') },
      outdent: { icon: icons.outdent, title: 'Outdent', action: () => this.execCommand('outdent') },
      link: { icon: icons.link, title: 'Insert Link', action: () => this.showLinkDialog() },
      image: { icon: icons.image, title: 'Insert Image', action: () => this.showImageDialog() },
      table: { icon: icons.table, title: 'Insert Table', action: () => this.showTableDialog() },
      code: { icon: icons.code, title: 'Code Block', action: () => this.insertCodeBlock() },
      blockquote: { icon: icons.blockquote, title: 'Blockquote', action: () => this.execCommand('formatBlock', 'blockquote') },
      undo: { icon: icons.undo, title: 'Undo', action: () => this.execCommand('undo') },
      redo: { icon: icons.redo, title: 'Redo', action: () => this.execCommand('redo') },
      removeFormat: { icon: icons.removeFormat, title: 'Clear Format', action: () => this.execCommand('removeFormat') },
      fullscreen: { icon: icons.fullscreen, title: 'Fullscreen', action: () => this.toggleFullscreen() },
      textColor: { icon: icons.textColor, title: 'Text Color', action: () => this.showColorPicker('color') },
      backgroundColor: { icon: icons.backgroundColor, title: 'Background Color', action: () => this.showColorPicker('backgroundColor') },
      trackChanges: { icon: icons.trackChanges, title: 'Track Changes', action: () => this.toggleTrackChanges() },
      comments: { icon: icons.comments, title: 'Comments', action: () => this.toggleComments() },
      spellCheck: { icon: icons.spellCheck, title: 'Spell Check', action: () => this.toggleSpellCheck() },
      mathType: { icon: icons.mathType, title: 'Math Formula', action: () => this.insertMathFormula() },
      mediaEmbed: { icon: icons.mediaEmbed, title: 'Embed Media', action: () => this.showMediaDialog() },
      mentions: { icon: icons.mentions, title: 'Mentions', action: () => this.showMentions() },
      exportPdf: { icon: icons.exportPdf, title: 'Export PDF', action: () => this.exportToPdf() },
      exportWord: { icon: icons.exportWord, title: 'Export Word', action: () => this.exportToWord() },
      importWord: { icon: icons.importWord, title: 'Import Word', action: () => this.importFromWord() },
      wordCount: { icon: icons.wordCount, title: 'Word Count', action: () => this.toggleWordCount() }
    };

    if (type === 'fontSize') {
      this.createFontSizeSelect();
    } else if (type === 'fontFamily') {
      this.createFontFamilySelect();
    } else if (buttons[type]) {
      const btn = buttons[type];
      const button = document.createElement('button');
      button.innerHTML = btn.icon;
      button.title = btn.title;
      button.setAttribute('data-button-type', type);
      
      const getButtonStyle = (isActive = false) => `
        padding: 8px;
        border: 1px solid ${isDark ? '#555' : '#ccc'};
        background: ${isActive ? (isDark ? '#555' : '#e0e0e0') : (isDark ? '#444' : '#fff')};
        color: ${isDark ? '#fff' : '#000'};
        cursor: pointer;
        border-radius: 4px;
        display: flex;
        align-items: center;
        justify-content: center;
        min-width: 32px;
        height: 32px;
        transition: all 0.2s ease;
      `;
      
      button.style.cssText = getButtonStyle(false);
      
      // Add hover effects
      button.onmouseenter = () => {
        if (!button.classList.contains('active')) {
          button.style.background = isDark ? '#555' : '#f0f0f0';
          button.style.transform = 'translateY(-1px)';
        }
      };
      
      button.onmouseleave = () => {
        if (!button.classList.contains('active')) {
          button.style.background = isDark ? '#444' : '#fff';
          button.style.transform = 'translateY(0)';
        } else {
          // Maintain active state
          button.style.background = '#007cba';
          button.style.transform = 'translateY(0)';
        }
      };
      
      button.onmousedown = e => {
        e.preventDefault();
        button.style.transform = 'translateY(0)';
        if (!button.classList.contains('active')) {
          button.style.background = isDark ? '#666' : '#e0e0e0';
        }
      };
      
      button.onmouseup = () => {
        if (!button.classList.contains('active')) {
          button.style.background = isDark ? '#555' : '#f0f0f0';
        } else {
          button.style.background = '#007cba';
        }
      };
      
      button.onclick = () => {
        btn.action();
        
        // Update active state for toggle buttons
        if (['spellCheck', 'trackChanges', 'comments', 'wordCount'].includes(type)) {
          this.updateButtonActiveState(type);
        }
        
        // Update formatting button states after formatting commands
        if (['bold', 'italic', 'underline', 'strikethrough'].includes(type)) {
          setTimeout(() => this.updateFormattingButtonStates(), 10);
        }
      };
      
      this.toolbar.appendChild(button);
    }
  }

  private updateButtonActiveState(buttonType: string) {
    const button = this.toolbar.querySelector(`[data-button-type="${buttonType}"]`) as HTMLButtonElement;
    if (!button) return;
    
    const isDark = this.options.theme === 'dark';
    let isActive = false;
    
    // Determine if button should be active
    switch (buttonType) {
      case 'spellCheck':
        isActive = this.spellCheckEnabled;
        break;
      case 'trackChanges':
        isActive = this.options.trackChanges || false;
        break;
      case 'comments':
        isActive = this.commentSidebar?.style.display !== 'none';
        break;
      case 'wordCount':
        isActive = this.wordCountPanel?.style.display !== 'none';
        break;
    }
    
    // Update button appearance
    if (isActive) {
      button.classList.add('active');
      button.style.background = isDark ? '#007cba' : '#007cba';
      button.style.color = '#fff';
      button.style.borderColor = '#007cba';
    } else {
      button.classList.remove('active');
      button.style.background = isDark ? '#444' : '#fff';
      button.style.color = isDark ? '#fff' : '#000';
      button.style.borderColor = isDark ? '#555' : '#ccc';
    }
  }

  private createFontSizeSelect() {
    const isDark = this.options.theme === 'dark';
    const select = document.createElement('select');
    select.style.cssText = `
      padding: 4px; 
      margin: 0 2px; 
      border: 1px solid ${isDark ? '#555' : '#ccc'}; 
      border-radius: 3px;
      background: ${isDark ? '#444' : '#fff'};
      color: ${isDark ? '#fff' : '#000'};
    `;
    
    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = 'Font Size';
    select.appendChild(defaultOption);
    
    const sizes = ['8', '9', '10', '11', '12', '14', '16', '18', '20', '24', '28', '32', '36', '48', '72'];
    sizes.forEach(size => {
      const option = document.createElement('option');
      option.value = size;
      option.textContent = size + 'px';
      select.appendChild(option);
    });
    
    select.onchange = () => {
      if (select.value) {
        this.editor.focus();
        const selection = window.getSelection();
        if (selection && selection.rangeCount > 0) {
          const range = selection.getRangeAt(0);
          if (!range.collapsed) {
            const span = document.createElement('span');
            span.style.fontSize = select.value + 'px';
            try {
              range.surroundContents(span);
            } catch (e) {
              span.appendChild(range.extractContents());
              range.insertNode(span);
            }
            selection.removeAllRanges();
            selection.addRange(range);
          }
        }
        select.selectedIndex = 0; // Reset to default
      }
    };
    
    this.toolbar.appendChild(select);
  }

  private createFontFamilySelect() {
    const isDark = this.options.theme === 'dark';
    const select = document.createElement('select');
    select.style.cssText = `
      padding: 4px; 
      margin: 0 2px; 
      border: 1px solid ${isDark ? '#555' : '#ccc'}; 
      border-radius: 3px;
      background: ${isDark ? '#444' : '#fff'};
      color: ${isDark ? '#fff' : '#000'};
    `;
    
    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = 'Font Family';
    select.appendChild(defaultOption);
    
    const fonts = this.options.customFonts || ['Arial', 'Helvetica', 'Times New Roman', 'Courier New', 'Verdana', 'Georgia', 'Palatino', 'Garamond', 'Comic Sans MS', 'Trebuchet MS'];
    fonts.forEach(font => {
      const option = document.createElement('option');
      option.value = font;
      option.textContent = font;
      option.style.fontFamily = font;
      select.appendChild(option);
    });
    
    select.onchange = () => {
      if (select.value) {
        this.execCommand('fontName', select.value);
        select.selectedIndex = 0; // Reset to default
      }
    };
    
    this.toolbar.appendChild(select);
  }

  private showColorPicker(type: 'color' | 'backgroundColor') {
    if (this.colorPicker) {
      this.colorPicker.remove();
    }
    
    this.colorPicker = document.createElement('div');
    this.colorPicker.style.cssText = `
      position: absolute;
      background: white;
      border: 1px solid #ccc;
      border-radius: 4px;
      padding: 10px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      z-index: 1000;
      display: grid;
      grid-template-columns: repeat(8, 1fr);
      gap: 4px;
    `;
    
    // Position relative to container, not body
    const containerRect = this.container.getBoundingClientRect();
    this.colorPicker.style.left = '10px';
    this.colorPicker.style.top = '50px';
    
    const colors = ['#000000', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF', '#FFFFFF',
                   '#800000', '#008000', '#000080', '#808000', '#800080', '#008080', '#C0C0C0', '#808080'];
    
    colors.forEach(color => {
      const colorBtn = document.createElement('div');
      colorBtn.style.cssText = `
        width: 20px;
        height: 20px;
        background: ${color};
        border: 1px solid #ccc;
        cursor: pointer;
        border-radius: 2px;
      `;
      colorBtn.onclick = () => {
        this.applyColor(type, color);
        if (this.colorPicker) {
          this.colorPicker.remove();
          this.colorPicker = null;
        }
      };
      if (this.colorPicker) {
        this.colorPicker.appendChild(colorBtn);
      }
    });
    
    // Append to container instead of body
    this.container.style.position = 'relative';
    this.container.appendChild(this.colorPicker);
    
    setTimeout(() => {
      document.addEventListener('click', (e) => {
        if (this.colorPicker && !this.colorPicker.contains(e.target as Node)) {
          this.colorPicker.remove();
          this.colorPicker = null;
        }
      }, { once: true });
    }, 100);
  }

  private applyColor(type: 'color' | 'backgroundColor', color: string) {
    this.editor.focus();
    
    // Use execCommand for better compatibility and formatting persistence
    if (type === 'color') {
      this.execCommand('foreColor', color);
    } else {
      this.execCommand('backColor', color);
    }
    
    // Trigger change event
    this.options.onChange?.(this.getContent());
  }

  private showLinkDialog() {
    // Get selected text before creating dialog
    const selection = window.getSelection();
    let selectedText = '';
    
    if (selection && selection.rangeCount > 0 && !selection.isCollapsed) {
      selectedText = selection.toString().trim();
    }
    
    this.linkDialog = document.createElement('div');
    this.linkDialog.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: white;
      border: 1px solid #ccc;
      border-radius: 8px;
      padding: 20px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.3);
      z-index: 1001;
      min-width: 400px;
    `;
    
    this.linkDialog.innerHTML = `
      <h3>Insert Link</h3>
      <div style="margin-bottom: 15px;">
        <label style="display: block; margin-bottom: 5px;">Link Text:</label>
        <input type="text" id="link-text" value="${selectedText}" placeholder="Enter link text" 
               style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px; box-sizing: border-box;">
      </div>
      <div style="margin-bottom: 15px;">
        <label style="display: block; margin-bottom: 5px;">URL:</label>
        <input type="url" id="link-url" placeholder="https://example.com" 
               style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px; box-sizing: border-box;">
      </div>
      <div style="text-align: right; margin-top: 15px;">
        <button id="cancel-link" style="margin-right: 8px; padding: 8px 16px; border: 1px solid #ccc; background: #f5f5f5; border-radius: 4px; cursor: pointer;">Cancel</button>
        <button id="insert-link" style="padding: 8px 16px; border: none; background: #007cba; color: white; border-radius: 4px; cursor: pointer;">Insert Link</button>
      </div>
    `;
    
    document.body.appendChild(this.linkDialog);
    
    const textInput = this.linkDialog.querySelector('#link-text') as HTMLInputElement;
    const urlInput = this.linkDialog.querySelector('#link-url') as HTMLInputElement;
    const cancelBtn = this.linkDialog.querySelector('#cancel-link') as HTMLButtonElement;
    const insertBtn = this.linkDialog.querySelector('#insert-link') as HTMLButtonElement;
    
    // Focus appropriate input
    if (selectedText) {
      urlInput.focus();
    } else {
      textInput.focus();
    }
    
    cancelBtn.onclick = () => {
      if (this.linkDialog) {
        this.linkDialog.remove();
        this.linkDialog = null;
      }
    };
    
    insertBtn.onclick = () => {
      const text = textInput.value.trim();
      const url = urlInput.value.trim();
      
      if (text && url) {
        this.insertLink(text, url);
        if (this.linkDialog) {
          this.linkDialog.remove();
          this.linkDialog = null;
        }
      }
    };
  }

  private insertLink(text: string, url: string) {
    this.editor.focus();
    
    const link = document.createElement('a');
    link.href = url;
    link.textContent = text;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      
      // If there's selected text, replace it
      if (!selection.isCollapsed) {
        range.deleteContents();
      }
      
      range.insertNode(link);
      range.setStartAfter(link);
      range.collapse(true);
      selection.removeAllRanges();
      selection.addRange(range);
    } else {
      // Fallback: append to editor
      this.editor.appendChild(link);
    }
    
    // Trigger change event
    this.options.onChange?.(this.getContent());
  }

  private showImageDialog() {
    this.imageDialog = document.createElement('div');
    this.imageDialog.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: white;
      border: 1px solid #ccc;
      border-radius: 8px;
      padding: 20px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.3);
      z-index: 1001;
      min-width: 300px;
    `;
    
    this.imageDialog.innerHTML = `
      <h3>Insert Image</h3>
      <input type="text" placeholder="Image URL" style="width: 100%; padding: 8px; margin: 8px 0; border: 1px solid #ccc; border-radius: 4px;">
      <input type="file" accept="image/*" style="width: 100%; padding: 8px; margin: 8px 0;">
      <input type="text" placeholder="Alt Text" style="width: 100%; padding: 8px; margin: 8px 0; border: 1px solid #ccc; border-radius: 4px;">
      <div style="text-align: right; margin-top: 15px;">
        <button onclick="this.parentElement.parentElement.remove()" style="margin-right: 8px; padding: 8px 16px; border: 1px solid #ccc; background: #f5f5f5; border-radius: 4px; cursor: pointer;">Cancel</button>
        <button style="padding: 8px 16px; border: none; background: #007cba; color: white; border-radius: 4px; cursor: pointer;">Insert</button>
      </div>
    `;
    
    const insertBtn = this.imageDialog?.querySelector('button:last-child') as HTMLButtonElement;
    const urlInput = this.imageDialog?.querySelector('input[type="text"]:first-of-type') as HTMLInputElement;
    const fileInput = this.imageDialog?.querySelector('input[type="file"]') as HTMLInputElement;
    const altInput = this.imageDialog?.querySelector('input[type="text"]:last-of-type') as HTMLInputElement;
    
    if (!insertBtn || !urlInput || !fileInput || !altInput) return;
    
    insertBtn.onclick = () => {
      const url = urlInput?.value || '';
      const alt = altInput?.value || '';
      
      if (url) {
        this.insertImage(url, alt);
        this.imageDialog?.remove();
      } else if (fileInput.files?.[0]) {
        const file = fileInput.files[0];
        const reader = new FileReader();
        reader.onload = (e) => {
          this.insertImage(e.target?.result as string, alt);
          this.imageDialog?.remove();
        };
        reader.readAsDataURL(file);
      }
    };
    
    document.body.appendChild(this.imageDialog);
  }

  private insertImage(src: string, alt: string = '') {
    const img = document.createElement('img');
    img.src = src;
    img.alt = alt;
    img.style.maxWidth = '100%';
    img.style.height = 'auto';
    img.style.display = 'block';
    img.style.margin = '10px 0';
    img.style.cursor = 'pointer';
    
    // Add resize functionality
    this.makeImageResizable(img);
    
    this.editor.focus();
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      range.deleteContents();
      range.insertNode(img);
      
      // Move cursor after image
      range.setStartAfter(img);
      range.collapse(true);
      selection.removeAllRanges();
      selection.addRange(range);
    } else {
      // Fallback: append to editor
      this.editor.appendChild(img);
    }
    
    // Trigger change event
    this.options.onChange?.(this.getContent());
  }

  private makeImageResizable(img: HTMLImageElement) {
    let isResizing = false;
    let startX = 0;
    let startWidth = 0;
    
    // Create wrapper for positioning
    const wrapper = document.createElement('div');
    wrapper.className = 'resize-wrapper';
    wrapper.style.cssText = `
      position: relative;
      display: inline-block;
      margin: 10px 0;
    `;
    
    // Replace image with wrapper
    if (img.parentNode) {
      img.parentNode.insertBefore(wrapper, img);
      wrapper.appendChild(img);
    }
    
    // Create resize handle
    const handle = document.createElement('div');
    handle.className = 'resize-handle';
    handle.style.cssText = `
      position: absolute;
      width: 10px;
      height: 10px;
      background: #007cba;
      bottom: -5px;
      right: -5px;
      cursor: se-resize;
      border: 1px solid #fff;
      z-index: 1000;
      display: none;
    `;
    
    wrapper.appendChild(handle);
    
    // Show/hide handle on hover
    wrapper.addEventListener('mouseenter', () => {
      handle.style.display = 'block';
    });
    
    wrapper.addEventListener('mouseleave', () => {
      if (!isResizing) {
        handle.style.display = 'none';
      }
    });
    
    // Resize functionality
    handle.addEventListener('mousedown', (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      isResizing = true;
      startX = e.clientX;
      startWidth = parseInt(window.getComputedStyle(img).width, 10);
      
      const handleResize = (e: MouseEvent) => {
        if (!isResizing) return;
        
        const width = startWidth + e.clientX - startX;
        img.style.width = Math.max(50, Math.min(width, 800)) + 'px';
        img.style.height = 'auto';
      };
      
      const stopResize = () => {
        isResizing = false;
        handle.style.display = 'none';
        document.removeEventListener('mousemove', handleResize);
        document.removeEventListener('mouseup', stopResize);
        this.options.onChange?.(this.getContent());
      };
      
      document.addEventListener('mousemove', handleResize);
      document.addEventListener('mouseup', stopResize);
    });
  }

  private showTableDialog() {
    this.tableDialog = document.createElement('div');
    this.tableDialog.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: white;
      border: 1px solid #ccc;
      border-radius: 8px;
      padding: 20px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.3);
      z-index: 1001;
      min-width: 300px;
    `;
    
    this.tableDialog.innerHTML = `
      <h3>Insert Table</h3>
      <label>Rows: <input type="number" value="3" min="1" max="20" style="width: 60px; padding: 4px; margin: 8px; border: 1px solid #ccc; border-radius: 4px;"></label>
      <label>Columns: <input type="number" value="3" min="1" max="20" style="width: 60px; padding: 4px; margin: 8px; border: 1px solid #ccc; border-radius: 4px;"></label>
      <div style="text-align: right; margin-top: 15px;">
        <button onclick="this.parentElement.parentElement.remove()" style="margin-right: 8px; padding: 8px 16px; border: 1px solid #ccc; background: #f5f5f5; border-radius: 4px; cursor: pointer;">Cancel</button>
        <button style="padding: 8px 16px; border: none; background: #007cba; color: white; border-radius: 4px; cursor: pointer;">Insert</button>
      </div>
    `;
    
    const insertBtn = this.tableDialog?.querySelector('button:last-child') as HTMLButtonElement;
    const rowsInput = this.tableDialog?.querySelector('input[type="number"]:first-of-type') as HTMLInputElement;
    const colsInput = this.tableDialog?.querySelector('input[type="number"]:last-of-type') as HTMLInputElement;
    
    if (!insertBtn || !rowsInput || !colsInput) return;
    
    insertBtn.onclick = () => {
      const rows = parseInt(rowsInput?.value || '3');
      const cols = parseInt(colsInput?.value || '3');
      this.insertTable(rows, cols);
      this.tableDialog?.remove();
    };
    
    document.body.appendChild(this.tableDialog);
  }

  private insertTable(rows: number, cols: number) {
    const table = document.createElement('table');
    table.style.cssText = 'border-collapse: collapse; width: 100%; margin: 10px 0;';
    
    for (let i = 0; i < rows; i++) {
      const row = document.createElement('tr');
      for (let j = 0; j < cols; j++) {
        const cell = document.createElement(i === 0 ? 'th' : 'td');
        cell.style.cssText = 'border: 1px solid #ccc; padding: 8px; text-align: left;';
        cell.innerHTML = '&nbsp;';
        row.appendChild(cell);
      }
      table.appendChild(row);
    }
    
    const selection = window.getSelection();
    if (selection?.rangeCount) {
      const range = selection.getRangeAt(0);
      range.insertNode(table);
      range.collapse(false);
    }
  }

  private insertCodeBlock() {
    const pre = document.createElement('pre');
    const code = document.createElement('code');
    code.style.cssText = 'background: #f4f4f4; padding: 10px; display: block; border-radius: 4px; font-family: monospace;';
    code.textContent = 'Code here...';
    pre.appendChild(code);
    
    const selection = window.getSelection();
    if (selection?.rangeCount) {
      const range = selection.getRangeAt(0);
      range.insertNode(pre);
      range.collapse(false);
    }
  }

  private toggleTrackChanges() {
    this.options.trackChanges = !this.options.trackChanges;
    if (this.options.trackChanges) {
      this.enableTrackChanges();
    } else {
      this.disableTrackChanges();
    }
    this.updateButtonActiveState('trackChanges');
  }

  private enableTrackChanges() {
    if (!this.trackChangesPanel) {
      this.trackChangesPanel = document.createElement('div');
      this.trackChangesPanel.style.cssText = `
        position: fixed;
        right: 10px;
        top: 50%;
        transform: translateY(-50%);
        width: 300px;
        background: white;
        border: 1px solid #ccc;
        border-radius: 8px;
        padding: 15px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.1);
        z-index: 1000;
        max-height: 400px;
        overflow-y: auto;
      `;
      
      const changesHtml = `
        <h4>Track Changes</h4>
        <div id="changes-list">${this.renderChanges()}</div>
        <button id="close-changes-btn" style="margin-top: 10px; padding: 5px 10px; border: 1px solid #ccc; background: #f5f5f5; border-radius: 4px; cursor: pointer;">Close</button>
      `;
      
      this.trackChangesPanel.innerHTML = changesHtml;
      
      const closeBtn = this.trackChangesPanel?.querySelector('#close-changes-btn') as HTMLButtonElement;
      if (closeBtn) {
        closeBtn.onclick = () => {
          if (this.trackChangesPanel) {
            this.trackChangesPanel.style.display = 'none';
          }
        };
      }
      
      document.body.appendChild(this.trackChangesPanel);
    }
    this.trackChangesPanel.style.display = 'block';
  }

  private renderChanges(): string {
    return this.changes.map(change => `
      <div style="border-bottom: 1px solid #eee; padding: 8px 0; margin-bottom: 8px;">
        <div style="font-weight: bold; color: ${change.type === 'insert' ? 'green' : 'red'};">
          ${change.type === 'insert' ? 'Added' : 'Deleted'}: "${change.text}"
        </div>
        <div style="font-size: 12px; color: #666;">
          by ${change.author} at ${change.timestamp}
        </div>
        <div style="margin-top: 4px;">
          <button onclick="window.armorEditor?.acceptChange?.('${change.id}')" style="padding: 2px 8px; margin-right: 4px; border: none; background: #4caf50; color: white; border-radius: 2px; cursor: pointer; font-size: 11px;">Accept</button>
          <button onclick="window.armorEditor?.rejectChange?.('${change.id}')" style="padding: 2px 8px; border: none; background: #f44336; color: white; border-radius: 2px; cursor: pointer; font-size: 11px;">Reject</button>
        </div>
      </div>
    `).join('');
  }

  public acceptChange(changeId: string) {
    this.changes = this.changes.filter(c => c.id !== changeId);
    this.updateTrackChangesDisplay();
  }

  public rejectChange(changeId: string) {
    const change = this.changes.find(c => c.id === changeId);
    if (change) {
      // Revert the change
      if (change.type === 'insert') {
        // Remove the inserted text
        const content = this.getContent();
        this.setContent(content.replace(change.text, ''));
      } else if (change.type === 'delete') {
        // Restore the deleted text
        this.insertHTML(change.text);
      }
    }
    this.changes = this.changes.filter(c => c.id !== changeId);
    this.updateTrackChangesDisplay();
  }

  private updateTrackChangesDisplay() {
    if (this.trackChangesPanel) {
      const changesList = this.trackChangesPanel.querySelector('#changes-list');
      if (changesList) {
        changesList.innerHTML = this.renderChanges();
      }
    }
  }

  private disableTrackChanges() {
    if (this.trackChangesPanel) {
      this.trackChangesPanel.style.display = 'none';
    }
  }

  private toggleComments() {
    if (!this.commentSidebar) {
      this.createCommentSidebar();
    }
    this.commentSidebar!.style.display = this.commentSidebar!.style.display === 'none' ? 'block' : 'none';
    this.updateButtonActiveState('comments');
  }

  private createCommentSidebar() {
    this.commentSidebar = document.createElement('div');
    this.commentSidebar.style.cssText = `
      position: fixed;
      right: 10px;
      top: 10px;
      width: 300px;
      height: 400px;
      background: white;
      border: 1px solid #ccc;
      border-radius: 8px;
      padding: 15px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.1);
      z-index: 1000;
      overflow-y: auto;
    `;
    
    const commentsHtml = `
      <h4>Comments</h4>
      <div id="comments-list">${this.renderComments()}</div>
      <textarea id="comment-input" placeholder="Add a comment..." style="width: 100%; height: 60px; margin: 10px 0; padding: 8px; border: 1px solid #ccc; border-radius: 4px; resize: vertical;"></textarea>
      <div>
        <button id="add-comment-btn" style="padding: 8px 16px; border: none; background: #007cba; color: white; border-radius: 4px; cursor: pointer;">Add Comment</button>
        <button id="close-comments-btn" style="margin-left: 8px; padding: 8px 16px; border: 1px solid #ccc; background: #f5f5f5; border-radius: 4px; cursor: pointer;">Close</button>
      </div>
    `;
    
    this.commentSidebar.innerHTML = commentsHtml;
    
    // Add event listeners
    const addBtn = this.commentSidebar?.querySelector('#add-comment-btn') as HTMLButtonElement;
    const closeBtn = this.commentSidebar?.querySelector('#close-comments-btn') as HTMLButtonElement;
    const input = this.commentSidebar?.querySelector('#comment-input') as HTMLTextAreaElement;
    
    if (addBtn && closeBtn && input) {
      addBtn.onclick = () => this.addComment(input.value);
      closeBtn.onclick = () => {
        if (this.commentSidebar) {
          this.commentSidebar.style.display = 'none';
        }
      };
    }
    
    document.body.appendChild(this.commentSidebar);
  }

  private renderComments(): string {
    return this.comments.map(comment => `
      <div style="border-bottom: 1px solid #eee; padding: 8px 0; margin-bottom: 8px;">
        <strong>${comment.author}</strong>
        <div style="font-size: 12px; color: #666;">${comment.timestamp}</div>
        <div style="margin-top: 4px;">${comment.text}</div>
      </div>
    `).join('');
  }

  private addComment(text: string) {
    if (!text.trim()) return;
    
    const comment = {
      id: Date.now().toString(),
      text: text.trim(),
      author: this.options.collaboration?.userName || 'Anonymous',
      timestamp: new Date().toLocaleString()
    };
    
    this.comments.push(comment);
    
    // Update comments list
    const commentsList = this.commentSidebar?.querySelector('#comments-list');
    if (commentsList) {
      commentsList.innerHTML = this.renderComments();
    }
    
    // Clear input
    const input = this.commentSidebar?.querySelector('#comment-input') as HTMLTextAreaElement;
    if (input) {
      input.value = '';
    }
  }

  private toggleSpellCheck() {
    this.spellCheckEnabled = !this.spellCheckEnabled;
    this.editor.spellcheck = this.spellCheckEnabled;
    
    if (this.spellCheckEnabled) {
      this.runAdvancedSpellCheck();
      this.setupSpellCheckListener();
    } else {
      this.clearSpellCheckHighlights();
      this.removeSpellCheckListener();
    }
    
    // Update button visual state
    this.updateButtonActiveState('spellCheck');
  }

  private spellCheckListener: ((e: Event) => void) | null = null;

  private setupSpellCheckListener() {
    // Remove existing listener first
    this.removeSpellCheckListener();
    
    // Debounced spell check on typing
    let spellCheckTimeout: number;
    
    this.spellCheckListener = () => {
      if (!this.spellCheckEnabled) return;
      
      clearTimeout(spellCheckTimeout);
      spellCheckTimeout = window.setTimeout(() => {
        if (this.spellCheckEnabled) {
          this.runAdvancedSpellCheck();
        }
      }, 1000); // Check after 1 second of no typing
    };
    
    this.editor.addEventListener('input', this.spellCheckListener);
  }

  private removeSpellCheckListener() {
    if (this.spellCheckListener) {
      this.editor.removeEventListener('input', this.spellCheckListener);
      this.spellCheckListener = null;
    }
  }

  private async runAdvancedSpellCheck() {
    // Don't run if spell check is disabled
    if (!this.spellCheckEnabled) return;
    
    const text = this.getText();
    if (!text.trim()) return;
    
    // Get spell check options
    const spellOptions = this.options.spellCheckOptions || {};
    const language = spellOptions.language || 'en-US';
    const customDict = spellOptions.customDictionary || [];
    
    try {
      // Use LanguageTool API (free tier: 20 requests/minute)
      const response = await fetch('https://api.languagetool.org/v2/check', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          'text': text,
          'language': language,
          'enabledOnly': 'false'
        })
      });
      
      if (response.ok && this.spellCheckEnabled) {
        const result = await response.json();
        // Filter out words in custom dictionary
        const filteredMatches = result.matches.filter((match: any) => {
          const word = match.context.text.substring(match.offset, match.offset + match.length);
          return !customDict.includes(word.toLowerCase());
        });
        this.highlightSpellingErrors(filteredMatches);
      } else {
        // Fallback to basic spell check
        if (this.spellCheckEnabled) {
          this.runBasicSpellCheck();
        }
      }
    } catch (error) {
      console.warn('Advanced spell check failed, using basic check:', error);
      if (this.spellCheckEnabled) {
        this.runBasicSpellCheck();
      }
    }
  }

  private runBasicSpellCheck() {
    // Don't run if spell check is disabled
    if (!this.spellCheckEnabled) return;
    
    const text = this.getText();
    const words = text.split(/\s+/);
    const customDict = this.options.spellCheckOptions?.customDictionary || [];
    
    const misspelled = words.filter(word => {
      const cleanWord = word.toLowerCase().replace(/[^a-z]/g, '');
      return cleanWord.length > 0 && 
             !customDict.includes(cleanWord) && 
             this.isWordMisspelled(cleanWord);
    });
    
    if (misspelled.length > 0) {
      this.highlightBasicErrors(misspelled);
    }
  }

  private highlightSpellingErrors(matches: any[]) {
    this.clearSpellCheckHighlights();
    
    const content = this.editor.innerHTML;
    let modifiedContent = content;
    
    // Sort matches by offset (descending) to avoid position shifts
    matches.sort((a, b) => b.offset - a.offset);
    
    matches.forEach((match, index) => {
      const errorText = match.context.text.substring(match.offset, match.offset + match.length);
      const suggestions = match.replacements.slice(0, 3).map((r: any) => r.value);
      
      const highlightSpan = `<span class="spell-error" data-error-id="${index}" data-suggestions="${suggestions.join('|')}" style="background: #ffebee; border-bottom: 2px wavy #f44336; cursor: pointer;" title="Suggestions: ${suggestions.join(', ')}">${errorText}</span>`;
      
      // Replace the error text with highlighted version
      const textContent = this.editor.textContent || '';
      const beforeError = textContent.substring(0, match.offset);
      const afterError = textContent.substring(match.offset + match.length);
      
      // Find the error in HTML and replace
      const regex = new RegExp(this.escapeRegex(errorText), 'g');
      modifiedContent = modifiedContent.replace(regex, highlightSpan);
    });
    
    if (modifiedContent !== content) {
      this.editor.innerHTML = modifiedContent;
      this.attachSpellCheckClickHandlers();
    }
  }

  private highlightBasicErrors(misspelledWords: string[]) {
    this.clearSpellCheckHighlights();
    
    let content = this.editor.innerHTML;
    
    misspelledWords.forEach(word => {
      const cleanWord = word.replace(/[^\w]/g, '');
      if (cleanWord.length > 2) {
        const regex = new RegExp(`\\b${this.escapeRegex(cleanWord)}\\b`, 'gi');
        content = content.replace(regex, `<span class="spell-error-basic" style="background: #fff3cd; border-bottom: 2px wavy #ffc107; cursor: pointer;" title="Possible spelling error">${cleanWord}</span>`);
      }
    });
    
    this.editor.innerHTML = content;
  }

  private attachSpellCheckClickHandlers() {
    const errorSpans = this.editor.querySelectorAll('.spell-error');
    
    errorSpans.forEach(span => {
      span.addEventListener('click', (e) => {
        // Don't show suggestions if spell check is disabled
        if (!this.spellCheckEnabled) return;
        
        e.preventDefault();
        this.showSpellCheckSuggestions(span as HTMLElement);
      });
    });
  }

  private showSpellCheckSuggestions(errorSpan: HTMLElement) {
    // Don't show suggestions if spell check is disabled
    if (!this.spellCheckEnabled) return;
    
    const suggestions = errorSpan.getAttribute('data-suggestions')?.split('|') || [];
    const errorText = errorSpan.textContent || '';
    
    // Remove existing suggestion popup
    const existingPopup = document.querySelector('.spell-suggestions');
    if (existingPopup) {
      existingPopup.remove();
    }
    
    // Create suggestion popup
    const popup = document.createElement('div');
    popup.className = 'spell-suggestions';
    popup.style.cssText = `
      position: absolute;
      background: white;
      border: 1px solid #ddd;
      border-radius: 6px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      z-index: 1000;
      min-width: 150px;
      max-width: 250px;
    `;
    
    const rect = errorSpan.getBoundingClientRect();
    const containerRect = this.container.getBoundingClientRect();
    
    // Position relative to container
    popup.style.left = (rect.left - containerRect.left) + 'px';
    popup.style.top = (rect.bottom - containerRect.top + 5) + 'px';
    
    // Ensure popup stays within container bounds
    this.container.style.position = 'relative';
    this.container.appendChild(popup);
    
    // Add suggestions
    if (suggestions.length > 0) {
      suggestions.forEach(suggestion => {
        const item = document.createElement('div');
        item.style.cssText = `
          padding: 8px 12px;
          cursor: pointer;
          border-bottom: 1px solid #f0f0f0;
          font-size: 14px;
        `;
        item.textContent = suggestion;
        
        item.onmouseover = () => item.style.background = '#f8f9fa';
        item.onmouseout = () => item.style.background = 'white';
        
        item.onclick = () => {
          // Replace only the text content, not HTML
          const textNode = document.createTextNode(suggestion);
          const parent = errorSpan.parentNode;
          if (parent) {
            parent.replaceChild(textNode, errorSpan);
            parent.normalize(); // Merge adjacent text nodes
          }
          popup.remove();
          
          // Trigger change event
          this.options.onChange?.(this.getContent());
        };
        
        popup.appendChild(item);
      });
    } else {
      const noSuggestions = document.createElement('div');
      noSuggestions.style.cssText = 'padding: 8px 12px; color: #666; font-style: italic;';
      noSuggestions.textContent = 'No suggestions available';
      popup.appendChild(noSuggestions);
    }
    
    // Add "Add to Dictionary" option
    const addToDictItem = document.createElement('div');
    addToDictItem.style.cssText = `
      padding: 8px 12px;
      cursor: pointer;
      border-top: 1px solid #e0e0e0;
      color: #666;
      font-size: 13px;
    `;
    addToDictItem.textContent = 'Add to Dictionary';
    
    addToDictItem.onmouseover = () => addToDictItem.style.background = '#f8f9fa';
    addToDictItem.onmouseout = () => addToDictItem.style.background = 'white';
    
    addToDictItem.onclick = () => {
      const errorText = errorSpan.textContent || '';
      this.addToCustomDictionary(errorText);
      
      // Remove highlighting
      const textNode = document.createTextNode(errorText);
      const parent = errorSpan.parentNode;
      if (parent) {
        parent.replaceChild(textNode, errorSpan);
        parent.normalize();
      }
      popup.remove();
    };
    
    popup.appendChild(addToDictItem);
    
    // Add ignore option
    const ignoreItem = document.createElement('div');
    ignoreItem.style.cssText = `
      padding: 8px 12px;
      cursor: pointer;
      border-top: 1px solid #e0e0e0;
      color: #666;
      font-size: 13px;
    `;
    ignoreItem.textContent = 'Ignore';
    
    ignoreItem.onmouseover = () => ignoreItem.style.background = '#f8f9fa';
    ignoreItem.onmouseout = () => ignoreItem.style.background = 'white';
    
    ignoreItem.onclick = () => {
      // Remove highlighting but keep as text node
      const textNode = document.createTextNode(errorSpan.textContent || '');
      const parent = errorSpan.parentNode;
      if (parent) {
        parent.replaceChild(textNode, errorSpan);
        parent.normalize();
      }
      popup.remove();
    };
    
    popup.appendChild(ignoreItem);
    
    // Remove the document.body.appendChild line since we're using container
    // document.body.appendChild(popup);
    
    // Remove popup when clicking outside
    setTimeout(() => {
      const handleClickOutside = (e: MouseEvent) => {
        if (!popup.contains(e.target as Node)) {
          popup.remove();
          document.removeEventListener('click', handleClickOutside);
        }
      };
      document.addEventListener('click', handleClickOutside);
    }, 100);
  }

  private clearSpellCheckHighlights() {
    // Remove all spell check highlights immediately
    const errorSpans = this.editor.querySelectorAll('.spell-error, .spell-error-basic');
    errorSpans.forEach(span => {
      const textContent = span.textContent || '';
      const textNode = document.createTextNode(textContent);
      const parent = span.parentNode;
      if (parent) {
        parent.replaceChild(textNode, span);
      }
    });
    
    // Normalize the editor content to merge adjacent text nodes
    this.editor.normalize();
    
    // Remove any existing spell check popups
    const existingPopups = document.querySelectorAll('.spell-suggestions');
    existingPopups.forEach(popup => popup.remove());
    
    // Also remove popups from container if they exist there
    const containerPopups = this.container.querySelectorAll('.spell-suggestions');
    containerPopups.forEach(popup => popup.remove());
  }

  private addToCustomDictionary(word: string) {
    if (!this.options.spellCheckOptions) {
      this.options.spellCheckOptions = {};
    }
    if (!this.options.spellCheckOptions.customDictionary) {
      this.options.spellCheckOptions.customDictionary = [];
    }
    
    const cleanWord = word.toLowerCase().replace(/[^a-z]/g, '');
    if (cleanWord && !this.options.spellCheckOptions.customDictionary.includes(cleanWord)) {
      this.options.spellCheckOptions.customDictionary.push(cleanWord);
      
      // Re-run spell check to remove other instances of this word
      if (this.spellCheckEnabled) {
        this.clearSpellCheckHighlights();
        setTimeout(() => this.runAdvancedSpellCheck(), 100);
      }
    }
  }

  public getSpellCheckOptions() {
    return this.options.spellCheckOptions || {};
  }

  public updateSpellCheckOptions(options: {language?: string, apiKey?: string, customDictionary?: string[]}) {
    this.options.spellCheckOptions = {
      ...this.options.spellCheckOptions,
      ...options
    };
    
    // Re-run spell check with new options
    if (this.spellCheckEnabled) {
      this.clearSpellCheckHighlights();
      setTimeout(() => this.runAdvancedSpellCheck(), 100);
    }
  }

  private escapeRegex(string: string): string {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  private isWordMisspelled(word: string): boolean {
    // Clean the word
    const cleanWord = word.toLowerCase().replace(/[^\w]/g, '');
    if (cleanWord.length < 3) return false;
    
    // Basic English dictionary (most common words)
    const commonWords = new Set([
      'the', 'and', 'for', 'are', 'but', 'not', 'you', 'all', 'can', 'had', 'her', 'was', 'one', 'our', 'out', 'day', 'get', 'has', 'him', 'his', 'how', 'man', 'new', 'now', 'old', 'see', 'two', 'way', 'who', 'boy', 'did', 'its', 'let', 'put', 'say', 'she', 'too', 'use',
      'about', 'after', 'again', 'before', 'being', 'below', 'between', 'both', 'during', 'each', 'few', 'from', 'further', 'here', 'into', 'more', 'most', 'other', 'over', 'same', 'some', 'such', 'than', 'that', 'their', 'them', 'these', 'they', 'this', 'those', 'through', 'time', 'very', 'what', 'when', 'where', 'which', 'while', 'with', 'your',
      'against', 'because', 'could', 'does', 'down', 'each', 'even', 'every', 'first', 'good', 'great', 'group', 'hand', 'high', 'important', 'large', 'last', 'life', 'little', 'long', 'make', 'many', 'next', 'number', 'part', 'people', 'place', 'point', 'problem', 'public', 'right', 'small', 'state', 'system', 'take', 'think', 'under', 'water', 'well', 'work', 'world', 'would', 'year', 'young',
      'able', 'back', 'call', 'came', 'come', 'different', 'early', 'example', 'find', 'give', 'government', 'help', 'home', 'house', 'information', 'interest', 'keep', 'kind', 'know', 'leave', 'line', 'look', 'made', 'might', 'move', 'much', 'name', 'need', 'never', 'night', 'open', 'order', 'own', 'play', 'program', 'question', 'read', 'really', 'school', 'seem', 'service', 'show', 'side', 'social', 'still', 'story', 'student', 'study', 'sure', 'tell', 'thing', 'turn', 'until', 'want', 'week', 'went', 'were', 'will', 'without', 'word', 'write',
      'always', 'american', 'another', 'around', 'become', 'began', 'believe', 'better', 'black', 'book', 'business', 'case', 'change', 'child', 'children', 'city', 'class', 'close', 'company', 'country', 'course', 'create', 'develop', 'education', 'end', 'experience', 'fact', 'family', 'feel', 'few', 'final', 'follow', 'form', 'found', 'free', 'friend', 'full', 'general', 'girl', 'going', 'grow', 'growth', 'happen', 'head', 'health', 'hear', 'history', 'however', 'human', 'include', 'increase', 'indeed', 'international', 'job', 'level', 'local', 'love', 'market', 'member', 'mind', 'minute', 'money', 'music', 'national', 'nature', 'office', 'often', 'once', 'only', 'opportunity', 'organization', 'others', 'person', 'policy', 'political', 'possible', 'power', 'president', 'price', 'private', 'process', 'provide', 'rather', 'reason', 'receive', 'report', 'research', 'result', 'return', 'room', 'run', 'second', 'section', 'series', 'set', 'several', 'should', 'since', 'society', 'special', 'start', 'support', 'table', 'technology', 'today', 'together', 'toward', 'trade', 'training', 'travel', 'try', 'understand', 'university', 'upon', 'value', 'various', 'view', 'white', 'within', 'woman', 'women', 'working'
    ]);
    
    return !commonWords.has(cleanWord);
  }

  // Alternative spell check APIs as fallbacks
  private async tryAlternativeSpellCheck(text: string) {
    const apis = [
      // Bing Spell Check API (free tier available)
      {
        name: 'bing',
        url: 'https://api.cognitive.microsoft.com/bing/v7.0/spellcheck',
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `text=${encodeURIComponent(text)}&mode=spell`
      },
      // After the Deadline API (free)
      {
        name: 'atd',
        url: 'https://service.afterthedeadline.com/checkDocument',
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `data=${encodeURIComponent(text)}`
      }
    ];
    
    for (const api of apis) {
      try {
        const response = await fetch(api.url, {
          method: api.method,
          headers: api.headers,
          body: api.body
        });
        
        if (response.ok) {
          const result = await response.json();
          return this.parseSpellCheckResponse(result, api.name);
        }
      } catch (error) {
        console.warn(`${api.name} spell check failed:`, error);
        continue;
      }
    }
    
    return null;
  }

  private parseSpellCheckResponse(response: any, apiName: string) {
    switch (apiName) {
      case 'bing':
        return response.flaggedTokens?.map((token: any) => ({
          offset: token.offset,
          length: token.token.length,
          suggestions: token.suggestions?.map((s: any) => s.suggestion) || [],
          context: { text: token.token }
        })) || [];
        
      case 'atd':
        // Parse ATD XML response
        if (typeof response === 'string') {
          const parser = new DOMParser();
          const doc = parser.parseFromString(response, 'text/xml');
          const errors = doc.querySelectorAll('error');
          
          return Array.from(errors).map(error => ({
            offset: parseInt(error.getAttribute('offset') || '0'),
            length: parseInt(error.getAttribute('length') || '0'),
            suggestions: error.getAttribute('suggestions')?.split('\t') || [],
            context: { text: error.getAttribute('string') || '' }
          }));
        }
        return [];
        
      default:
        return [];
    }
  }

  private insertMathFormula() {
    const formula = prompt('Enter LaTeX formula:');
    if (formula) {
      const mathSpan = document.createElement('span');
      mathSpan.style.cssText = 'background: #f0f0f0; padding: 4px 8px; border-radius: 4px; font-family: monospace;';
      mathSpan.textContent = `$$${formula}$$`;
      mathSpan.title = 'Math Formula';
      
      const selection = window.getSelection();
      if (selection?.rangeCount) {
        const range = selection.getRangeAt(0);
        range.insertNode(mathSpan);
        range.collapse(false);
      }
    }
  }

  private showMediaDialog() {
    const mediaDialog = document.createElement('div');
    mediaDialog.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: white;
      border: 1px solid #ccc;
      border-radius: 8px;
      padding: 20px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.3);
      z-index: 1001;
      min-width: 400px;
    `;
    
    mediaDialog.innerHTML = `
      <h3>Embed Media</h3>
      <input type="text" placeholder="YouTube/Vimeo URL" style="width: 100%; padding: 8px; margin: 8px 0; border: 1px solid #ccc; border-radius: 4px;">
      <div style="text-align: right; margin-top: 15px;">
        <button onclick="this.parentElement.parentElement.remove()" style="margin-right: 8px; padding: 8px 16px; border: 1px solid #ccc; background: #f5f5f5; border-radius: 4px; cursor: pointer;">Cancel</button>
        <button style="padding: 8px 16px; border: none; background: #007cba; color: white; border-radius: 4px; cursor: pointer;">Embed</button>
      </div>
    `;
    
    const embedBtn = mediaDialog?.querySelector('button:last-child') as HTMLButtonElement;
    const urlInput = mediaDialog?.querySelector('input') as HTMLInputElement;
    
    if (!embedBtn || !urlInput) return;
    
    embedBtn.onclick = () => {
      const url = urlInput.value;
      if (url) {
        this.embedMedia(url);
        mediaDialog.remove();
      }
    };
    
    document.body.appendChild(mediaDialog);
  }

  private embedMedia(url: string) {
    let embedCode = '';
    
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      const videoId = this.extractYouTubeId(url);
      if (videoId) {
        embedCode = `<div style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; max-width: 100%; margin: 10px 0;">
          <iframe src="https://www.youtube.com/embed/${videoId}" 
                  style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;" 
                  frameborder="0" allowfullscreen></iframe>
        </div>`;
      }
    } else if (url.includes('vimeo.com')) {
      const videoId = url.split('/').pop();
      if (videoId) {
        embedCode = `<div style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; max-width: 100%; margin: 10px 0;">
          <iframe src="https://player.vimeo.com/video/${videoId}" 
                  style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;" 
                  frameborder="0" allowfullscreen></iframe>
        </div>`;
      }
    } else {
      // Generic embed for other URLs
      embedCode = `<div style="border: 1px solid #ccc; padding: 10px; margin: 10px 0; border-radius: 4px;">
        <a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a>
      </div>`;
    }
    
    if (embedCode) {
      this.insertHTML(embedCode);
    }
  }

  private makeVideoResizable(container: HTMLElement) {
    let isResizing = false;
    let startX = 0;
    let startY = 0;
    let startWidth = 0;
    let startHeight = 0;
    
    // Create wrapper for positioning
    const wrapper = document.createElement('div');
    wrapper.className = 'resize-wrapper';
    wrapper.style.cssText = `
      position: relative;
      display: inline-block;
      margin: 10px 0;
    `;
    
    // Replace container with wrapper
    if (container.parentNode) {
      container.parentNode.insertBefore(wrapper, container);
      wrapper.appendChild(container);
    }
    
    // Create resize handle
    const handle = document.createElement('div');
    handle.className = 'resize-handle';
    handle.style.cssText = `
      position: absolute;
      width: 10px;
      height: 10px;
      background: #007cba;
      bottom: -5px;
      right: -5px;
      cursor: se-resize;
      border: 1px solid #fff;
      z-index: 1000;
      display: none;
    `;
    
    wrapper.appendChild(handle);
    
    // Show/hide handle on hover
    wrapper.addEventListener('mouseenter', () => {
      handle.style.display = 'block';
    });
    
    wrapper.addEventListener('mouseleave', () => {
      if (!isResizing) {
        handle.style.display = 'none';
      }
    });
    
    // Resize functionality
    handle.addEventListener('mousedown', (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      isResizing = true;
      startX = e.clientX;
      startY = e.clientY;
      startWidth = parseInt(window.getComputedStyle(container).width, 10);
      startHeight = parseInt(window.getComputedStyle(container).height, 10);
      
      const handleResize = (e: MouseEvent) => {
        if (!isResizing) return;
        
        const width = startWidth + e.clientX - startX;
        const height = startHeight + e.clientY - startY;
        
        container.style.width = Math.max(200, Math.min(width, 800)) + 'px';
        container.style.height = Math.max(150, Math.min(height, 600)) + 'px';
      };
      
      const stopResize = () => {
        isResizing = false;
        handle.style.display = 'none';
        document.removeEventListener('mousemove', handleResize);
        document.removeEventListener('mouseup', stopResize);
        this.options.onChange?.(this.getContent());
      };
      
      document.addEventListener('mousemove', handleResize);
      document.addEventListener('mouseup', stopResize);
    });
  }

  private extractYouTubeId(url: string): string | null {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/,
      /youtube\.com\/embed\/([^&\n?#]+)/,
      /youtube\.com\/v\/([^&\n?#]+)/
    ];
    
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) return match[1];
    }
    
    return null;
  }

  private showMentions() {
    if (!this.options.mentions?.feeds) return;
    
    // Remove existing mention dialog
    const existingDialog = document.querySelector('.mention-dialog');
    if (existingDialog) {
      existingDialog.remove();
    }
    
    const mentionDialog = document.createElement('div');
    mentionDialog.className = 'mention-dialog';
    mentionDialog.style.cssText = `
      position: absolute;
      background: white;
      border: 1px solid #ccc;
      border-radius: 4px;
      padding: 8px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      z-index: 1000;
      max-height: 200px;
      overflow-y: auto;
      min-width: 200px;
    `;
    
    // Position near cursor
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      mentionDialog.style.left = rect.left + 'px';
      mentionDialog.style.top = (rect.bottom + 5) + 'px';
    }
    
    this.options.mentions.feeds.forEach(user => {
      const userItem = document.createElement('div');
      userItem.style.cssText = `
        padding: 8px 12px; 
        cursor: pointer; 
        border-radius: 4px;
        display: flex;
        align-items: center;
      `;
      userItem.innerHTML = `
        <div style="width: 24px; height: 24px; border-radius: 50%; background: #007cba; color: white; display: flex; align-items: center; justify-content: center; margin-right: 8px; font-size: 12px;">
          ${user.name.charAt(0).toUpperCase()}
        </div>
        <span>${user.name}</span>
      `;
      
      userItem.onclick = () => {
        this.insertHTML(`<span style="background: #e3f2fd; padding: 2px 4px; border-radius: 3px; color: #1976d2;">@${user.name}</span>&nbsp;`);
        mentionDialog.remove();
      };
      
      userItem.onmouseover = () => userItem.style.background = '#f0f0f0';
      userItem.onmouseout = () => userItem.style.background = 'transparent';
      
      mentionDialog.appendChild(userItem);
    });
    
    document.body.appendChild(mentionDialog);
    
    // Auto-remove after 10 seconds or on click outside
    setTimeout(() => {
      if (mentionDialog.parentNode) {
        mentionDialog.remove();
      }
    }, 10000);
    
    // Remove on click outside
    const handleClickOutside = (e: MouseEvent) => {
      if (!mentionDialog.contains(e.target as Node)) {
        mentionDialog.remove();
        document.removeEventListener('click', handleClickOutside);
      }
    };
    
    setTimeout(() => {
      document.addEventListener('click', handleClickOutside);
    }, 100);
  }

  private exportToPdf() {
    try {
      const content = this.getContent();
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>Export PDF</title>
              <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; margin: 20px; }
                table { border-collapse: collapse; width: 100%; }
                th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                th { background-color: #f2f2f2; }
                img { max-width: 100%; height: auto; }
                @media print { body { margin: 0; } }
              </style>
            </head>
            <body>${content}</body>
          </html>
        `);
        printWindow.document.close();
        printWindow.focus();
        setTimeout(() => {
          printWindow.print();
        }, 250);
      } else {
        alert('Please allow popups to export PDF');
      }
    } catch (error) {
      console.error('PDF export failed:', error);
      alert('PDF export failed. Please try again.');
    }
  }

  private exportToWord() {
    try {
      const content = this.getContent();
      const htmlContent = `
        <html xmlns:o='urn:schemas-microsoft-com:office:office' 
              xmlns:w='urn:schemas-microsoft-com:office:word' 
              xmlns='http://www.w3.org/TR/REC-html40'>
          <head>
            <meta charset='utf-8'>
            <title>Export Word Document</title>
            <!--[if gte mso 9]>
            <xml>
              <w:WordDocument>
                <w:View>Print</w:View>
                <w:Zoom>90</w:Zoom>
                <w:DoNotPromptForConvert/>
                <w:DoNotShowInsertionsAndDeletions/>
              </w:WordDocument>
            </xml>
            <![endif]-->
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; }
              table { border-collapse: collapse; width: 100%; }
              th, td { border: 1px solid #000; padding: 8px; }
            </style>
          </head>
          <body>${content}</body>
        </html>
      `;
      
      const blob = new Blob([htmlContent], { 
        type: 'application/vnd.ms-word;charset=utf-8' 
      });
      
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `document-${new Date().toISOString().split('T')[0]}.doc`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Word export failed:', error);
      alert('Word export failed. Please try again.');
    }
  }

  private importFromWord() {
    try {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.doc,.docx,.html,.htm';
      input.style.display = 'none';
      
      input.onchange = (e) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (e) => {
            try {
              let content = e.target?.result as string;
              
              // Basic cleanup for Word HTML
              content = content
                .replace(/<o:p\s*\/?>|<\/o:p>/gi, '')
                .replace(/<w:[^>]*>|<\/w:[^>]*>/gi, '')
                .replace(/class="[^"]*"/gi, '')
                .replace(/style="[^"]*"/gi, '')
                .replace(/<span[^>]*>([^<]*)<\/span>/gi, '$1')
                .replace(/<font[^>]*>([^<]*)<\/font>/gi, '$1');
              
              this.setContent(content);
            } catch (error) {
              console.error('Import failed:', error);
              alert('Failed to import file. Please try a different file.');
            }
          };
          
          reader.onerror = () => {
            alert('Failed to read file. Please try again.');
          };
          
          reader.readAsText(file);
        }
      };
      
      document.body.appendChild(input);
      input.click();
      document.body.removeChild(input);
    } catch (error) {
      console.error('Import failed:', error);
      alert('Import failed. Please try again.');
    }
  }

  private toggleWordCount() {
    if (!this.wordCountPanel) {
      this.createWordCountPanel();
    }
    this.wordCountPanel!.style.display = this.wordCountPanel!.style.display === 'none' ? 'block' : 'none';
    this.updateWordCount();
    this.updateButtonActiveState('wordCount');
  }

  private createWordCountPanel() {
    this.wordCountPanel = document.createElement('div');
    this.wordCountPanel.style.cssText = `
      position: fixed;
      bottom: 10px;
      right: 10px;
      background: white;
      border: 1px solid #ccc;
      border-radius: 4px;
      padding: 10px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      z-index: 1000;
      font-size: 12px;
    `;
    document.body.appendChild(this.wordCountPanel);
  }

  private updateWordCount() {
    if (!this.wordCountPanel || this.wordCountPanel.style.display === 'none') return;
    
    const text = this.getText();
    const words = text.trim() ? text.trim().split(/\s+/).filter(word => word.length > 0).length : 0;
    const characters = text.length;
    const charactersNoSpaces = text.replace(/\s/g, '').length;
    const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim().length > 0).length;
    
    this.wordCountPanel.innerHTML = `
      <div style="font-weight: bold; margin-bottom: 8px;">Document Statistics</div>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 4px; font-size: 11px;">
        <div>Words:</div><div style="font-weight: bold;">${words}</div>
        <div>Characters:</div><div style="font-weight: bold;">${characters}</div>
        <div>No spaces:</div><div style="font-weight: bold;">${charactersNoSpaces}</div>
        <div>Paragraphs:</div><div style="font-weight: bold;">${paragraphs}</div>
      </div>
      <button onclick="this.parentElement.style.display='none'" style="margin-top: 8px; padding: 4px 8px; border: 1px solid #ccc; background: #f5f5f5; border-radius: 2px; cursor: pointer; font-size: 11px; width: 100%;">Close</button>
    `;
  }

  private toggleFullscreen() {
    if (this.container.style.position === 'fixed') {
      this.container.style.cssText = this.container.getAttribute('data-original-style') || '';
      this.container.removeAttribute('data-original-style');
    } else {
      this.container.setAttribute('data-original-style', this.container.style.cssText);
      this.container.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        z-index: 9999;
        background: white;
      `;
      this.editor.style.height = 'calc(100vh - 60px)';
    }
  }

  private setupAutoSave() {
    if (this.options.autoSave) {
      this.autoSaveTimer = window.setInterval(() => {
        const content = this.getContent();
        this.options.autoSave!.callback(content);
      }, this.options.autoSave.interval);
    }
  }

  private setupCollaboration() {
    if (this.options.collaboration) {
      // Initialize collaboration
      this.initializeCollaboration();
      
      // Track content changes
      this.editor.addEventListener('input', (e) => {
        this.handleCollaborativeChange(e);
      });
      
      // Track cursor/selection changes
      this.editor.addEventListener('selectionchange', () => {
        this.handleSelectionChange();
      });
      
      // Show collaborators panel
      this.createCollaboratorsPanel();
    }
  }

  private initializeCollaboration() {
    const { channelId, userId, userName } = this.options.collaboration!;
    
    // Add current user to collaborators
    this.collaborators.set(userId, {
      id: userId,
      name: userName,
      color: this.generateUserColor(userId),
      cursor: null,
      lastSeen: Date.now()
    });
    
    // Simulate other users joining (in real implementation, this would come from server)
    this.simulateCollaborators();
  }

  private handleCollaborativeChange(event: Event) {
    const { userId, channelId } = this.options.collaboration!;
    
    // Create change object
    const change = {
      id: Date.now().toString(),
      userId,
      channelId,
      type: 'content',
      content: this.getContent(),
      timestamp: Date.now(),
      selection: this.getSelection()
    };
    
    // In real implementation, send to collaboration server
    console.log('Collaborative change:', change);
    
    // Update collaborator activity
    this.updateCollaboratorActivity(userId);
  }

  private handleSelectionChange() {
    if (!this.options.collaboration) return;
    
    const { userId } = this.options.collaboration;
    const selection = window.getSelection();
    
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      
      // Update cursor position
      this.updateCollaboratorCursor(userId, {
        x: rect.left,
        y: rect.top,
        width: rect.width,
        height: rect.height
      });
    }
  }

  private createCollaboratorsPanel() {
    const panel = document.createElement('div');
    panel.className = 'collaborators-panel';
    panel.style.cssText = `
      position: absolute;
      top: 10px;
      right: 10px;
      background: white;
      border: 1px solid #ddd;
      border-radius: 8px;
      padding: 12px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      z-index: 1000;
      min-width: 200px;
    `;
    
    panel.innerHTML = `
      <h4 style="margin: 0 0 10px 0; font-size: 14px; color: #333;">Collaborators</h4>
      <div id="collaborators-list"></div>
    `;
    
    this.container.style.position = 'relative';
    this.container.appendChild(panel);
    
    this.updateCollaboratorsDisplay();
  }

  private updateCollaboratorsDisplay() {
    const list = this.container.querySelector('#collaborators-list');
    if (!list) return;
    
    list.innerHTML = '';
    
    this.collaborators.forEach((collaborator, userId) => {
      const item = document.createElement('div');
      item.style.cssText = `
        display: flex;
        align-items: center;
        margin-bottom: 8px;
        padding: 6px;
        border-radius: 4px;
        background: ${collaborator.color}20;
      `;
      
      const isOnline = Date.now() - collaborator.lastSeen < 30000; // 30 seconds
      
      item.innerHTML = `
        <div style="
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: ${collaborator.color};
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          font-weight: bold;
          margin-right: 8px;
        ">${collaborator.name.charAt(0).toUpperCase()}</div>
        <div style="flex: 1;">
          <div style="font-size: 13px; font-weight: 500;">${collaborator.name}</div>
          <div style="font-size: 11px; color: #666;">
            ${isOnline ? '🟢 Online' : '⚫ Offline'}
          </div>
        </div>
      `;
      
      list.appendChild(item);
    });
  }

  private updateCollaboratorCursor(userId: string, position: any) {
    const collaborator = this.collaborators.get(userId);
    if (!collaborator) return;
    
    // Remove existing cursor
    const existingCursor = document.querySelector(`[data-cursor="${userId}"]`);
    if (existingCursor) {
      existingCursor.remove();
    }
    
    // Create new cursor
    const cursor = document.createElement('div');
    cursor.setAttribute('data-cursor', userId);
    cursor.style.cssText = `
      position: absolute;
      left: ${position.x}px;
      top: ${position.y}px;
      width: 2px;
      height: ${position.height || 20}px;
      background: ${collaborator.color};
      z-index: 1000;
      pointer-events: none;
      animation: blink 1s infinite;
    `;
    
    // Add cursor label
    const label = document.createElement('div');
    label.style.cssText = `
      position: absolute;
      top: -25px;
      left: 0;
      background: ${collaborator.color};
      color: white;
      padding: 2px 6px;
      border-radius: 3px;
      font-size: 11px;
      white-space: nowrap;
      font-weight: 500;
    `;
    label.textContent = collaborator.name;
    cursor.appendChild(label);
    
    document.body.appendChild(cursor);
    
    // Remove cursor after 3 seconds of inactivity
    setTimeout(() => {
      if (cursor.parentNode) {
        cursor.remove();
      }
    }, 3000);
  }

  private updateCollaboratorActivity(userId: string) {
    const collaborator = this.collaborators.get(userId);
    if (collaborator) {
      collaborator.lastSeen = Date.now();
      this.updateCollaboratorsDisplay();
    }
  }

  private generateUserColor(userId: string): string {
    const colors = [
      '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
      '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9'
    ];
    
    let hash = 0;
    for (let i = 0; i < userId.length; i++) {
      hash = userId.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    return colors[Math.abs(hash) % colors.length];
  }

  private simulateCollaborators() {
    // Simulate other users for demo purposes
    setTimeout(() => {
      this.collaborators.set('demo-user-1', {
        id: 'demo-user-1',
        name: 'Alice Johnson',
        color: '#FF6B6B',
        cursor: null,
        lastSeen: Date.now()
      });
      
      this.collaborators.set('demo-user-2', {
        id: 'demo-user-2',
        name: 'Bob Smith',
        color: '#4ECDC4',
        cursor: null,
        lastSeen: Date.now() - 15000 // 15 seconds ago
      });
      
      this.updateCollaboratorsDisplay();
    }, 2000);
  }

  private createEditor() {
    const isDark = this.options.theme === 'dark';
    this.editor = document.createElement('div');
    this.editor.contentEditable = 'true';
    this.editor.className = 'armor-editor-content';
    this.editor.style.cssText = `
      padding: 12px;
      min-height: ${this.options.height || '300px'};
      outline: none;
      overflow-y: auto;
      line-height: 1.6;
      background: ${isDark ? '#2d2d2d' : '#fff'};
      color: ${isDark ? '#fff' : '#000'};
    `;
    
    // Add accessibility attributes
    this.editor.setAttribute('role', 'textbox');
    this.editor.setAttribute('aria-multiline', 'true');
    this.editor.setAttribute('aria-label', 'Rich text editor');
    this.editor.setAttribute('tabindex', '0');
    
    if (this.options.placeholder) {
      this.editor.setAttribute('data-placeholder', this.options.placeholder);
      this.editor.setAttribute('aria-placeholder', this.options.placeholder);
      const style = document.createElement('style');
      style.textContent = `
        [contenteditable][data-placeholder]:empty::before {
          content: attr(data-placeholder);
          color: #999;
          position: absolute;
          pointer-events: none;
        }
      `;
      document.head.appendChild(style);
    }

    this.container.appendChild(this.editor);
  }

  // Bound methods for proper cleanup
  private handleInput = () => {
    // Save undo state periodically during typing
    clearTimeout(this.undoTimeout);
    this.undoTimeout = window.setTimeout(() => {
      this.saveUndoState();
    }, 1000); // Save undo state after 1 second of inactivity
    
    this.options.onChange?.(this.getContent());
    this.updateWordCount();
  };

  private undoTimeout: number | undefined;

  private handleKeydown = (e: KeyboardEvent) => {
    if (e.ctrlKey || e.metaKey) {
      const shortcuts: Record<string, () => void> = {
        'b': () => this.execCommand('bold'),
        'i': () => this.execCommand('italic'),
        'u': () => this.execCommand('underline'),
        'z': () => this.execCommand('undo'),
        'y': () => this.execCommand('redo'),
        'k': () => this.showLinkDialog(),
        's': () => this.options.autoSave?.callback(this.getContent())
      };
      
      if (shortcuts[e.key]) {
        e.preventDefault();
        shortcuts[e.key]();
        setTimeout(() => this.updateFormattingButtonStates(), 10);
      }
    }
    
    if (e.key === 'Tab') {
      e.preventDefault();
      this.execCommand('insertHTML', '&nbsp;&nbsp;&nbsp;&nbsp;');
    }
    
    if (e.key === '@' && this.options.mentions) {
      setTimeout(() => this.showMentions(), 100);
    }
  };

  private handlePaste = (e: ClipboardEvent) => {
    e.preventDefault();
    const text = e.clipboardData?.getData('text/plain') || '';
    this.execCommand('insertText', text);
  };

  private selectionTimeout: number | null = null;
  
  private updateFormattingButtonStatesDebounced = () => {
    if (this.selectionTimeout) {
      clearTimeout(this.selectionTimeout);
    }
    this.selectionTimeout = window.setTimeout(() => {
      this.updateFormattingButtonStates();
    }, 50);
  };

  private handleMouseUp = () => {
    this.updateFormattingButtonStatesDebounced();
  };

  private handleKeyUp = () => {
    this.updateFormattingButtonStatesDebounced();
  };

  private handleFocus = () => {
    this.updateFormattingButtonStatesDebounced();
  };

  private handleDocumentSelectionChange = () => {
    if (document.activeElement === this.editor) {
      this.updateFormattingButtonStatesDebounced();
    }
  };

  private attachEvents() {
    this.editor.addEventListener('input', this.handleInput);
    this.editor.addEventListener('keydown', this.handleKeydown);
    this.editor.addEventListener('paste', this.handlePaste);
    this.editor.addEventListener('mouseup', this.handleMouseUp);
    this.editor.addEventListener('keyup', this.handleKeyUp);
    this.editor.addEventListener('focus', this.handleFocus);
    
    // Document selection change for better coverage
    document.addEventListener('selectionchange', this.handleDocumentSelectionChange);
  }

  private updateFormattingButtonStates() {
    if (!this.toolbar) return;

    const formattingButtons = ['bold', 'italic', 'underline', 'strikethrough'];
    
    formattingButtons.forEach(buttonType => {
      const button = this.toolbar.querySelector(`[data-button-type="${buttonType}"]`) as HTMLButtonElement;
      if (!button) return;

      const isActive = this.isFormatActive(buttonType);
      this.setButtonActiveState(button, isActive, buttonType);
    });
  }

  private isFormatActive(format: string): boolean {
    try {
      // Use document.queryCommandState for more reliable detection
      if (typeof document.queryCommandState === 'function') {
        switch (format) {
          case 'bold':
            return document.queryCommandState('bold');
          case 'italic':
            return document.queryCommandState('italic');
          case 'underline':
            return document.queryCommandState('underline');
          case 'strikethrough':
            return document.queryCommandState('strikeThrough');
        }
      }
      
      // Fallback to DOM inspection
      const selection = window.getSelection();
      if (!selection || selection.rangeCount === 0) return false;

      const range = selection.getRangeAt(0);
      let element: Node | null = range.commonAncestorContainer;

      // If it's a text node, get its parent element
      if (element.nodeType === Node.TEXT_NODE) {
        element = element.parentElement;
      }

      // Check the element and its parents for formatting
      while (element && element !== this.editor && element instanceof HTMLElement) {
        const style = window.getComputedStyle(element);
        
        switch (format) {
          case 'bold':
            if (element.tagName === 'B' || element.tagName === 'STRONG' || 
                style.fontWeight === 'bold' || parseInt(style.fontWeight) >= 700) {
              return true;
            }
            break;
          case 'italic':
            if (element.tagName === 'I' || element.tagName === 'EM' || 
                style.fontStyle === 'italic') {
              return true;
            }
            break;
          case 'underline':
            if (element.tagName === 'U' || 
                style.textDecoration.includes('underline')) {
              return true;
            }
            break;
          case 'strikethrough':
            if (element.tagName === 'S' || element.tagName === 'STRIKE' || 
                style.textDecoration.includes('line-through')) {
              return true;
            }
            break;
        }
        
        element = element.parentElement;
      }

      return false;
    } catch (error) {
      return false;
    }
  }

  private setButtonActiveState(button: HTMLButtonElement, isActive: boolean, buttonType: string) {
    const isDark = this.options.theme === 'dark';
    
    if (isActive) {
      button.classList.add('active');
      button.style.background = '#007cba';
      button.style.color = '#fff';
      button.style.borderColor = '#007cba';
    } else {
      button.classList.remove('active');
      button.style.background = isDark ? '#444' : '#fff';
      button.style.color = isDark ? '#fff' : '#000';
      button.style.borderColor = isDark ? '#555' : '#ccc';
    }
  }

  private saveUndoState() {
    const currentContent = this.getContent();
    if (currentContent !== this.lastContent) {
      this.undoStack.push(this.lastContent);
      if (this.undoStack.length > this.maxUndoSteps) {
        this.undoStack.shift();
      }
      this.redoStack = []; // Clear redo stack when new action is performed
      this.lastContent = currentContent;
    }
  }

  private performUndo() {
    if (this.undoStack.length > 0) {
      const currentContent = this.getContent();
      this.redoStack.push(currentContent);
      
      const previousContent = this.undoStack.pop()!;
      this.lastContent = previousContent;
      
      // Temporarily disable onChange to avoid infinite loop
      const originalOnChange = this.options.onChange;
      this.options.onChange = undefined;
      
      this.setContent(previousContent);
      
      // Restore onChange
      this.options.onChange = originalOnChange;
      
      return true;
    }
    return false;
  }

  private performRedo() {
    if (this.redoStack.length > 0) {
      const currentContent = this.getContent();
      this.undoStack.push(currentContent);
      
      const nextContent = this.redoStack.pop()!;
      this.lastContent = nextContent;
      
      // Temporarily disable onChange to avoid infinite loop
      const originalOnChange = this.options.onChange;
      this.options.onChange = undefined;
      
      this.setContent(nextContent);
      
      // Restore onChange
      this.options.onChange = originalOnChange;
      
      return true;
    }
    return false;
  }

  private execCommand(command: string, value?: string) {
    this.editor.focus();
    
    // Handle custom undo/redo
    if (command === 'undo') {
      this.performUndo();
      return;
    }
    
    if (command === 'redo') {
      this.performRedo();
      return;
    }
    
    // Save state before executing command (for undo)
    this.saveUndoState();
    
    // Check if execCommand is available (not in Node.js/JSDOM)
    if (typeof document.execCommand === 'function') {
      // For color commands, use styleWithCSS for better compatibility
      if (command === 'foreColor' || command === 'backColor') {
        document.execCommand('styleWithCSS', false, 'true');
      }
      document.execCommand(command, false, value);
    } else {
      // Fallback for testing environments
      console.warn('execCommand not available, using fallback');
      if (command === 'insertHTML' && value) {
        // Simple fallback for insertHTML
        this.editor.innerHTML += value;
      }
    }
  }

  public getContent(): string {
    if (this.isSSR || !this.editor) return '';
    return this.editor.innerHTML;
  }

  public setContent(html: string): void {
    if (this.isSSR || !this.editor) return;
    if (typeof html !== 'string') {
      console.warn('setContent expects a string, received:', typeof html);
      html = String(html || '');
    }
    
    // Sanitize HTML content before setting
    const sanitizedHtml = this.sanitizeHTML(html);
    this.editor.innerHTML = sanitizedHtml;
    
    // Make existing images and videos resizable
    this.makeExistingMediaResizable();
    
    this.updateWordCount();
  }

  private makeExistingMediaResizable() {
    // Make images resizable
    const images = this.editor.querySelectorAll('img');
    images.forEach(img => {
      if (!img.parentElement?.classList.contains('resize-wrapper')) {
        this.makeImageResizable(img as HTMLImageElement);
      }
    });
    
    // Make video containers resizable
    const videoContainers = this.editor.querySelectorAll('div[style*="position: relative"][style*="padding-bottom"]');
    videoContainers.forEach(container => {
      if (!container.parentElement?.classList.contains('resize-wrapper')) {
        this.makeVideoResizable(container as HTMLElement);
      }
    });
  }

  private sanitizeHTML(html: string): string {
    // Create a temporary div to parse HTML
    const temp = document.createElement('div');
    temp.innerHTML = html;
    
    // Remove potentially dangerous elements
    const dangerousElements = ['script', 'iframe', 'object', 'embed', 'form'];
    dangerousElements.forEach(tag => {
      const elements = temp.querySelectorAll(tag);
      elements.forEach(el => el.remove());
    });
    
    // Remove dangerous attributes from all elements
    const allElements = temp.querySelectorAll('*');
    allElements.forEach(el => {
      const dangerousAttrs = ['onclick', 'onload', 'onerror', 'onmouseover', 'onfocus'];
      dangerousAttrs.forEach(attr => {
        if (el.hasAttribute(attr)) {
          el.removeAttribute(attr);
        }
      });
      
      // Sanitize href attributes
      if (el.hasAttribute('href')) {
        const href = el.getAttribute('href') || '';
        if (href.startsWith('javascript:') || href.startsWith('data:')) {
          el.removeAttribute('href');
        }
      }
    });
    
    return temp.innerHTML;
  }

  public getText(): string {
    if (this.isSSR || !this.editor) return '';
    return this.editor.textContent || '';
  }

  public focus(): void {
    if (this.isSSR || !this.editor) return;
    this.editor.focus();
  }

  public insertHTML(html: string): void {
    if (this.isSSR || !this.editor) return;
    if (typeof html !== 'string') {
      console.warn('insertHTML expects a string, received:', typeof html);
      return;
    }
    this.editor.focus();
    try {
      this.execCommand('insertHTML', html);
    } catch (error) {
      console.error('Failed to insert HTML:', error);
      // Fallback method
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const div = document.createElement('div');
        div.innerHTML = html;
        const fragment = document.createDocumentFragment();
        while (div.firstChild) {
          fragment.appendChild(div.firstChild);
        }
        range.insertNode(fragment);
      }
    }
  }

  public getSelection(): Selection | null {
    if (this.isSSR) return null;
    return window.getSelection();
  }

  public destroy(): void {
    if (this.isSSR) return;
    
    // Clear timers
    if (this.autoSaveTimer) {
      clearInterval(this.autoSaveTimer);
      this.autoSaveTimer = null;
    }
    
    if (this.selectionTimeout) {
      clearTimeout(this.selectionTimeout);
      this.selectionTimeout = null;
    }
    
    if (this.undoTimeout) {
      clearTimeout(this.undoTimeout);
      this.undoTimeout = undefined;
    }
    
    // Remove spell check listener
    this.removeSpellCheckListener();
    
    // Remove all event listeners with proper cleanup
    if (this.editor) {
      this.editor.removeEventListener('input', this.handleInput);
      this.editor.removeEventListener('keydown', this.handleKeydown);
      this.editor.removeEventListener('paste', this.handlePaste);
      this.editor.removeEventListener('mouseup', this.handleMouseUp);
      this.editor.removeEventListener('keyup', this.handleKeyUp);
      this.editor.removeEventListener('focus', this.handleFocus);
      
      // Remove image resize listeners
      const images = this.editor.querySelectorAll('img');
      images.forEach(img => {
        img.removeEventListener('mouseenter', this.handleImageMouseEnter);
        img.removeEventListener('mouseleave', this.handleImageMouseLeave);
      });
    }
    
    // Remove document listeners
    document.removeEventListener('selectionchange', this.handleDocumentSelectionChange);
    
    // Remove collaboration listeners if they exist
    if (this.options.collaboration && this.editor) {
      this.editor.removeEventListener('input', this.handleCollaborativeInput);
      this.editor.removeEventListener('selectionchange', this.handleCollaborativeSelectionChange);
    }
    
    // Clean up DOM elements
    this.colorPicker?.remove();
    this.linkDialog?.remove();
    this.imageDialog?.remove();
    this.tableDialog?.remove();
    this.commentSidebar?.remove();
    this.trackChangesPanel?.remove();
    this.wordCountPanel?.remove();
    
    // Clean up collaboration elements
    const collaboratorsPanel = this.container?.querySelector('.collaborators-panel');
    collaboratorsPanel?.remove();
    
    // Remove all cursors
    document.querySelectorAll('[data-cursor]').forEach(cursor => cursor.remove());
    
    // Remove popups
    document.querySelectorAll('.spell-suggestions, .mention-dialog, .resize-handle').forEach(popup => popup.remove());
    
    if (this.container) {
      this.container.innerHTML = '';
    }
  }

  // Add missing bound methods for image resize
  private handleImageMouseEnter = (e: Event) => {
    // Implementation for image resize hover
  };

  private handleImageMouseLeave = (e: Event) => {
    // Implementation for image resize leave
  };

  private handleCollaborativeInput = (e: Event) => {
    this.handleCollaborativeChange(e);
  };

  private handleCollaborativeSelectionChange = () => {
    this.handleSelectionChange();
  };
}

// Auto-initialization for data attributes (SSR-safe)
if (typeof window !== 'undefined' && typeof document !== 'undefined') {
  const initializeEditors = () => {
    const elements = document.querySelectorAll('[data-armor-editor]');
    if (!elements.length) return;
    
    elements.forEach(el => {
      try {
        const height = el.getAttribute('data-height') || '300px';
        const theme = (el.getAttribute('data-theme') as 'light' | 'dark') || 'light';
        const placeholder = el.getAttribute('data-placeholder') || '';
        
        new ArmorEditor({ 
          container: el as HTMLElement,
          height,
          theme,
          placeholder
        });
      } catch (error) {
        console.error('Failed to initialize ArmorEditor:', error);
      }
    });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeEditors);
  } else {
    // For Next.js/Nuxt.js - delay initialization
    setTimeout(initializeEditors, 100);
  }
}
