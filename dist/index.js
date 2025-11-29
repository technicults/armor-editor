'use strict';

const icons = {
    bold: `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M15.6 10.79c.97-.67 1.65-1.77 1.65-2.79 0-2.26-1.75-4-4-4H7v14h7.04c2.09 0 3.71-1.7 3.71-3.79 0-1.52-.86-2.82-2.15-3.42zM10 6.5h3c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5h-3v-3zm3.5 9H10v-3h3.5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5z"/></svg>`,
    italic: `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M10 4v3h2.21l-3.42 8H6v3h8v-3h-2.21l3.42-8H18V4z"/></svg>`,
    underline: `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 17c3.31 0 6-2.69 6-6V3h-2.5v8c0 1.93-1.57 3.5-3.5 3.5S8.5 12.93 8.5 11V3H6v8c0 3.31 2.69 6 6 6zm-7 2v2h14v-2H5z"/></svg>`,
    strikethrough: `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M10 19h4v-3h-4v3zM5 4v3h5v3h4V7h5V4H5zM3 14h18v-2H3v2z"/></svg>`,
    alignLeft: `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M15 15H3v2h12v-2zm0-8H3v2h12V7zM3 13h18v-2H3v2zm0 8h18v-2H3v2zM3 3v2h18V3H3z"/></svg>`,
    alignCenter: `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M7 15v2h10v-2H7zm-4 6h18v-2H3v2zm0-8h18v-2H3v2zm4-6v2h10V7H7zM3 3v2h18V3H3z"/></svg>`,
    alignRight: `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M3 21h18v-2H3v2zm6-4h12v-2H9v2zm-6-4h18v-2H3v2zm6-4h12V7H9v2zM3 3v2h18V3H3z"/></svg>`,
    alignJustify: `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M3 21h18v-2H3v2zm0-4h18v-2H3v2zm0-4h18v-2H3v2zm0-4h18V7H3v2zm0-6v2h18V3H3z"/></svg>`,
    orderedList: `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M2 17h2v.5H3v1h1v.5H2v1h3v-4H2v1zm1-9h1V4H2v1h1v3zm-1 3h1.8L2 13.1v.9h3v-1H3.2L5 10.9V10H2v1zm5-6v2h14V5H7zm0 14h14v-2H7v2zm0-6h14v-2H7v2z"/></svg>`,
    unorderedList: `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M4 10.5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5zm0-6c-.83 0-1.5.67-1.5 1.5S3.17 7.5 4 7.5 5.5 6.83 5.5 6 4.83 4.5 4 4.5zm0 12c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5zM7 19h14v-2H7v2zm0-6h14v-2H7v2zm0-8v2h14V5H7z"/></svg>`,
    indent: `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M3 21h18v-2H3v2zM3 8v8l4-4-4-4zm8 9h10v-2H11v2zM3 3v2h18V3H3zm8 6h10V7H11v2zm0 4h10v-2H11v2z"/></svg>`,
    outdent: `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M11 17h10v-2H11v2zm-8-5l4 4V8l-4 4zm0 9h18v-2H3v2zM3 3v2h18V3H3zm8 6h10V7H11v2zm0 4h10v-2H11v2z"/></svg>`,
    link: `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z"/></svg>`,
    image: `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/></svg>`,
    table: `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M10 10.02h5V21h-5zM17 21h3c1.1 0 2-.9 2-2v-9h-5v11zm3-18H5c-1.1 0-2 .9-2 2v3h19V5c0-1.1-.9-2-2-2zM3 19c0 1.1.9 2 2 2h3V10H3v9z"/></svg>`,
    code: `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0L19.2 12l-4.6-4.6L16 6l6 6-6 6-1.4-1.4z"/></svg>`,
    blockquote: `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z"/></svg>`,
    undo: `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12.5 8c-2.65 0-5.05.99-6.9 2.6L2 7v9h9l-3.62-3.62c1.39-1.16 3.16-1.88 5.12-1.88 3.54 0 6.55 2.31 7.6 5.5l2.37-.78C21.08 11.03 17.15 8 12.5 8z"/></svg>`,
    redo: `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18.4 10.6C16.55 8.99 14.15 8 11.5 8c-4.65 0-8.58 3.03-9.96 7.22L3.9 16c1.05-3.19 4.05-5.5 7.6-5.5 1.95 0 3.73.72 5.12 1.88L13 16h9V7l-3.6 3.6z"/></svg>`,
    removeFormat: `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M6 5v.18L8.82 8h2.4l-.72 1.68 2.1 2.1L14.21 8H20V5H6zm-.27 14.49L17.73 7.49l1.41 1.41L7.14 20.9l-1.41-1.41z"/></svg>`,
    fullscreen: `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/></svg>`,
    textColor: `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M9.62 12L12 5.67 14.38 12H9.62zM11 3L5.5 17h2.25l1.12-3h6.25l1.12 3H18.5L13 3H11zM3 20h18v3H3v-3z"/></svg>`,
    backgroundColor: `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M16.56 8.94L7.62 0 6.21 1.41l2.38 2.38-5.15 5.15c-.59.59-.59 1.54 0 2.12l5.5 5.5c.29.29.68.44 1.06.44s.77-.15 1.06-.44l5.5-5.5c.59-.58.59-1.53 0-2.12zM5.21 10L10 5.21 14.79 10H5.21zM19 11.5s-2 2.17-2 3.5c0 1.1.9 2 2 2s2-.9 2-2c0-1.33-2-3.5-2-3.5z"/><path d="M2 20h20v4H2z"/></svg>`,
    trackChanges: `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M14.06 9.02l.92.92L5.92 19H5v-.92l9.06-9.06M17.66 3c-.25 0-.51.1-.7.29l-1.83 1.83 3.75 3.75 1.83-1.83c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.2-.2-.45-.29-.71-.29zm-3.6 3.19L3 17.25V21h3.75L17.81 9.94l-3.75-3.75z"/></svg>`,
    comments: `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M21.99 4c0-1.1-.89-2-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4-.01-18zM18 14H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/></svg>`,
    spellCheck: `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12.45 16h2.09L9.43 3H7.57L2.46 16h2.09l1.12-3h5.64l1.14 3zm-6.02-5L8.5 5.48 10.57 11H6.43zm15.16.59l-8.09 8.09L9.83 16l-1.41 1.41 5.09 5.09L23 13l-1.41-1.41z"/></svg>`,
    mathType: `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M15.5 11.5c0 2-1.5 3.5-3.5 3.5s-3.5-1.5-3.5-3.5S10 8 12 8s3.5 1.5 3.5 3.5zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8 0-1.12.23-2.18.65-3.15L8 11.5c0 2.21 1.79 4 4 4s4-1.79 4-4-1.79-4-4-4c-.63 0-1.22.15-1.76.4l-2.35-2.35C9.82 4.23 10.88 4 12 4c4.41 0 8 3.59 8 8s-3.59 8-8 8z"/></svg>`,
    mediaEmbed: `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4zM14 13h-3v3H9v-3H6v-2h3V8h2v3h3v2z"/></svg>`,
    mentions: `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1L13.5 2.5L16.17 5.17L10.58 10.76C10.22 10.54 9.8 10.38 9.35 10.35L8.8 10.3C8.32 10.25 7.86 10.39 7.5 10.68L4.5 13.68C4.15 14.03 4 14.53 4 15.03V19C4 20.1 4.9 21 6 21H18C19.1 21 20 20.1 20 19V15C20 14.45 19.55 14 19 14S18 14.45 18 15V19H6V15.03L9 12.03L9.56 12.08C10.07 12.13 10.54 12.35 10.89 12.71L12.89 14.71L15.71 11.89C16.1 11.5 16.1 10.87 15.71 10.47L12.53 7.29L21 9Z"/></svg>`,
    exportPdf: `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/></svg>`,
    exportWord: `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20M7,13V15H9V13H7M11,13V15H13V13H11M15,13V15H17V13H15Z"/></svg>`,
    importWord: `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20M12,12L16,16H13.5V19H10.5V16H8L12,12Z"/></svg>`,
    wordCount: `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M3,3V21H21V3H3M5,5H19V19H5V5M7,7V9H17V7H7M7,11V13H17V11H7M7,15V17H14V15H7Z"/></svg>`
};

// Version info
const VERSION = '1.0.0';
class ArmorEditor {
    constructor(options) {
        this.colorPicker = null;
        this.linkDialog = null;
        this.imageDialog = null;
        this.tableDialog = null;
        this.commentSidebar = null;
        this.trackChangesPanel = null;
        this.wordCountPanel = null;
        this.collaborators = new Map();
        this.comments = [];
        this.changes = [];
        this.autoSaveTimer = null;
        this.spellCheckEnabled = false;
        this.isSSR = false;
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
            this.container = element;
        }
        else {
            this.container = options.container;
        }
        this.loadGoogleFonts();
        // Delay initialization for Next.js/Nuxt hydration
        if (this.isNextJS() || this.isNuxtJS()) {
            this.delayedInit();
        }
        else {
            this.init();
        }
    }
    loadGoogleFonts() {
        if (!this.options.customFonts || this.options.customFonts.length === 0)
            return;
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = `https://fonts.googleapis.com/css2?${this.options.customFonts.map(font => `family=${font.replace(/\s+/g, '+')}`).join('&')}&display=swap`;
        document.head.appendChild(link);
    }
    isNextJS() {
        return typeof window !== 'undefined' &&
            window.__NEXT_DATA__ !== undefined;
    }
    isNuxtJS() {
        return typeof window !== 'undefined' &&
            (window.__NUXT__ !== undefined ||
                window.$nuxt !== undefined);
    }
    delayedInit() {
        // Wait for hydration to complete
        if (typeof window !== 'undefined') {
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => {
                    setTimeout(() => {
                        var _a, _b;
                        this.init();
                        // Ensure onReady is called
                        if (!this.isSSR) {
                            (_b = (_a = this.options).onReady) === null || _b === void 0 ? void 0 : _b.call(_a);
                        }
                    }, 100);
                });
            }
            else {
                setTimeout(() => {
                    var _a, _b;
                    this.init();
                    // Ensure onReady is called
                    if (!this.isSSR) {
                        (_b = (_a = this.options).onReady) === null || _b === void 0 ? void 0 : _b.call(_a);
                    }
                }, 100);
            }
        }
    }
    // Static method for SSR-safe initialization
    static create(options) {
        return new Promise((resolve) => {
            if (typeof window === 'undefined') {
                // Return a placeholder for SSR
                resolve(new ArmorEditor(options));
            }
            else {
                const editor = new ArmorEditor(options);
                if (editor.isSSR) {
                    // Wait for client-side hydration
                    const checkReady = () => {
                        if (!editor.isSSR && editor.editor) {
                            resolve(editor);
                        }
                        else {
                            setTimeout(checkReady, 50);
                        }
                    };
                    checkReady();
                }
                else {
                    resolve(editor);
                }
            }
        });
    }
    init() {
        var _a, _b;
        // Skip initialization in SSR
        if (this.isSSR)
            return;
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
        (_b = (_a = this.options).onReady) === null || _b === void 0 ? void 0 : _b.call(_a);
    }
    setupStyles() {
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
    createToolbar() {
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
            }
            else {
                this.createToolbarButton(item);
            }
        });
        this.container.appendChild(this.toolbar);
    }
    createToolbarButton(type) {
        const isDark = this.options.theme === 'dark';
        const buttons = {
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
        }
        else if (type === 'fontFamily') {
            this.createFontFamilySelect();
        }
        else if (buttons[type]) {
            const btn = buttons[type];
            const button = document.createElement('button');
            button.innerHTML = btn.icon;
            button.title = btn.title;
            button.style.cssText = `
        padding: 8px;
        border: 1px solid ${isDark ? '#555' : '#ccc'};
        background: ${isDark ? '#444' : '#fff'};
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
            // Add hover effects
            button.onmouseenter = () => {
                button.style.background = isDark ? '#555' : '#f0f0f0';
                button.style.transform = 'translateY(-1px)';
            };
            button.onmouseleave = () => {
                button.style.background = isDark ? '#444' : '#fff';
                button.style.transform = 'translateY(0)';
            };
            button.onmousedown = e => {
                e.preventDefault();
                button.style.transform = 'translateY(0)';
                button.style.background = isDark ? '#666' : '#e0e0e0';
            };
            button.onmouseup = () => {
                button.style.background = isDark ? '#555' : '#f0f0f0';
            };
            button.onclick = btn.action;
            this.toolbar.appendChild(button);
        }
    }
    createFontSizeSelect() {
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
                        }
                        catch (e) {
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
    createFontFamilySelect() {
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
    showColorPicker(type) {
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
                this.execCommand(type === 'color' ? 'foreColor' : 'backColor', color);
                if (this.colorPicker) {
                    this.colorPicker.remove();
                    this.colorPicker = null;
                }
            };
            if (this.colorPicker) {
                this.colorPicker.appendChild(colorBtn);
            }
        });
        document.body.appendChild(this.colorPicker);
        setTimeout(() => {
            document.addEventListener('click', () => {
                var _a;
                (_a = this.colorPicker) === null || _a === void 0 ? void 0 : _a.remove();
                this.colorPicker = null;
            }, { once: true });
        }, 100);
    }
    showLinkDialog() {
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
      min-width: 300px;
    `;
        this.linkDialog.innerHTML = `
      <h3>Insert Link</h3>
      <input type="text" placeholder="URL" style="width: 100%; padding: 8px; margin: 8px 0; border: 1px solid #ccc; border-radius: 4px;">
      <input type="text" placeholder="Link Text" style="width: 100%; padding: 8px; margin: 8px 0; border: 1px solid #ccc; border-radius: 4px;">
      <div style="text-align: right; margin-top: 15px;">
        <button onclick="this.parentElement.parentElement.remove()" style="margin-right: 8px; padding: 8px 16px; border: 1px solid #ccc; background: #f5f5f5; border-radius: 4px; cursor: pointer;">Cancel</button>
        <button style="padding: 8px 16px; border: none; background: #007cba; color: white; border-radius: 4px; cursor: pointer;">Insert</button>
      </div>
    `;
        const insertBtn = this.linkDialog.querySelector('button:last-child');
        const urlInput = this.linkDialog.querySelector('input[type="text"]:first-of-type');
        const textInput = this.linkDialog.querySelector('input[type="text"]:last-of-type');
        insertBtn.onclick = () => {
            var _a;
            const url = (urlInput === null || urlInput === void 0 ? void 0 : urlInput.value) || '';
            const text = (textInput === null || textInput === void 0 ? void 0 : textInput.value) || url;
            if (url) {
                this.execCommand('createLink', url);
                if (text !== url) {
                    const selection = window.getSelection();
                    if (selection === null || selection === void 0 ? void 0 : selection.rangeCount) {
                        const range = selection.getRangeAt(0);
                        range.deleteContents();
                        const link = document.createElement('a');
                        link.href = url;
                        link.textContent = text;
                        range.insertNode(link);
                    }
                }
            }
            (_a = this.linkDialog) === null || _a === void 0 ? void 0 : _a.remove();
        };
        document.body.appendChild(this.linkDialog);
    }
    showImageDialog() {
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
        const insertBtn = this.imageDialog.querySelector('button:last-child');
        const urlInput = this.imageDialog.querySelector('input[type="text"]:first-of-type');
        const fileInput = this.imageDialog.querySelector('input[type="file"]');
        const altInput = this.imageDialog.querySelector('input[type="text"]:last-of-type');
        insertBtn.onclick = () => {
            var _a, _b;
            const url = (urlInput === null || urlInput === void 0 ? void 0 : urlInput.value) || '';
            const alt = (altInput === null || altInput === void 0 ? void 0 : altInput.value) || '';
            if (url) {
                this.insertImage(url, alt);
                (_a = this.imageDialog) === null || _a === void 0 ? void 0 : _a.remove();
            }
            else if ((_b = fileInput.files) === null || _b === void 0 ? void 0 : _b[0]) {
                const file = fileInput.files[0];
                const reader = new FileReader();
                reader.onload = (e) => {
                    var _a, _b;
                    this.insertImage((_a = e.target) === null || _a === void 0 ? void 0 : _a.result, alt);
                    (_b = this.imageDialog) === null || _b === void 0 ? void 0 : _b.remove();
                };
                reader.readAsDataURL(file);
            }
        };
        document.body.appendChild(this.imageDialog);
    }
    insertImage(src, alt = '') {
        const img = document.createElement('img');
        img.src = src;
        img.alt = alt;
        img.style.maxWidth = '100%';
        img.style.height = 'auto';
        const selection = window.getSelection();
        if (selection === null || selection === void 0 ? void 0 : selection.rangeCount) {
            const range = selection.getRangeAt(0);
            range.insertNode(img);
            range.collapse(false);
        }
    }
    showTableDialog() {
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
        const insertBtn = this.tableDialog.querySelector('button:last-child');
        const rowsInput = this.tableDialog.querySelector('input[type="number"]:first-of-type');
        const colsInput = this.tableDialog.querySelector('input[type="number"]:last-of-type');
        insertBtn.onclick = () => {
            var _a;
            const rows = parseInt((rowsInput === null || rowsInput === void 0 ? void 0 : rowsInput.value) || '3');
            const cols = parseInt((colsInput === null || colsInput === void 0 ? void 0 : colsInput.value) || '3');
            this.insertTable(rows, cols);
            (_a = this.tableDialog) === null || _a === void 0 ? void 0 : _a.remove();
        };
        document.body.appendChild(this.tableDialog);
    }
    insertTable(rows, cols) {
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
        if (selection === null || selection === void 0 ? void 0 : selection.rangeCount) {
            const range = selection.getRangeAt(0);
            range.insertNode(table);
            range.collapse(false);
        }
    }
    insertCodeBlock() {
        const pre = document.createElement('pre');
        const code = document.createElement('code');
        code.style.cssText = 'background: #f4f4f4; padding: 10px; display: block; border-radius: 4px; font-family: monospace;';
        code.textContent = 'Code here...';
        pre.appendChild(code);
        const selection = window.getSelection();
        if (selection === null || selection === void 0 ? void 0 : selection.rangeCount) {
            const range = selection.getRangeAt(0);
            range.insertNode(pre);
            range.collapse(false);
        }
    }
    toggleTrackChanges() {
        this.options.trackChanges = !this.options.trackChanges;
        if (this.options.trackChanges) {
            this.enableTrackChanges();
        }
        else {
            this.disableTrackChanges();
        }
    }
    enableTrackChanges() {
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
            const closeBtn = this.trackChangesPanel.querySelector('#close-changes-btn');
            closeBtn.onclick = () => {
                if (this.trackChangesPanel) {
                    this.trackChangesPanel.style.display = 'none';
                }
            };
            document.body.appendChild(this.trackChangesPanel);
        }
        this.trackChangesPanel.style.display = 'block';
    }
    renderChanges() {
        return this.changes.map(change => `
      <div style="border-bottom: 1px solid #eee; padding: 8px 0; margin-bottom: 8px;">
        <div style="font-weight: bold; color: ${change.type === 'insert' ? 'green' : 'red'};">
          ${change.type === 'insert' ? 'Added' : 'Deleted'}: "${change.text}"
        </div>
        <div style="font-size: 12px; color: #666;">
          by ${change.author} at ${change.timestamp}
        </div>
        <div style="margin-top: 4px;">
          <button onclick="this.acceptChange('${change.id}')" style="padding: 2px 8px; margin-right: 4px; border: none; background: #4caf50; color: white; border-radius: 2px; cursor: pointer; font-size: 11px;">Accept</button>
          <button onclick="this.rejectChange('${change.id}')" style="padding: 2px 8px; border: none; background: #f44336; color: white; border-radius: 2px; cursor: pointer; font-size: 11px;">Reject</button>
        </div>
      </div>
    `).join('');
    }
    disableTrackChanges() {
        if (this.trackChangesPanel) {
            this.trackChangesPanel.style.display = 'none';
        }
    }
    toggleComments() {
        if (!this.commentSidebar) {
            this.createCommentSidebar();
        }
        this.commentSidebar.style.display = this.commentSidebar.style.display === 'none' ? 'block' : 'none';
    }
    createCommentSidebar() {
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
        const addBtn = this.commentSidebar.querySelector('#add-comment-btn');
        const closeBtn = this.commentSidebar.querySelector('#close-comments-btn');
        const input = this.commentSidebar.querySelector('#comment-input');
        addBtn.onclick = () => this.addComment(input.value);
        closeBtn.onclick = () => {
            if (this.commentSidebar) {
                this.commentSidebar.style.display = 'none';
            }
        };
        document.body.appendChild(this.commentSidebar);
    }
    renderComments() {
        return this.comments.map(comment => `
      <div style="border-bottom: 1px solid #eee; padding: 8px 0; margin-bottom: 8px;">
        <strong>${comment.author}</strong>
        <div style="font-size: 12px; color: #666;">${comment.timestamp}</div>
        <div style="margin-top: 4px;">${comment.text}</div>
      </div>
    `).join('');
    }
    addComment(text) {
        var _a, _b, _c;
        if (!text.trim())
            return;
        const comment = {
            id: Date.now().toString(),
            text: text.trim(),
            author: ((_a = this.options.collaboration) === null || _a === void 0 ? void 0 : _a.userName) || 'Anonymous',
            timestamp: new Date().toLocaleString()
        };
        this.comments.push(comment);
        // Update comments list
        const commentsList = (_b = this.commentSidebar) === null || _b === void 0 ? void 0 : _b.querySelector('#comments-list');
        if (commentsList) {
            commentsList.innerHTML = this.renderComments();
        }
        // Clear input
        const input = (_c = this.commentSidebar) === null || _c === void 0 ? void 0 : _c.querySelector('#comment-input');
        if (input) {
            input.value = '';
        }
    }
    toggleSpellCheck() {
        this.spellCheckEnabled = !this.spellCheckEnabled;
        this.editor.spellcheck = this.spellCheckEnabled;
        if (this.spellCheckEnabled) {
            this.runAdvancedSpellCheck();
            this.setupSpellCheckListener();
        }
        else {
            this.clearSpellCheckHighlights();
        }
    }
    setupSpellCheckListener() {
        // Debounced spell check on typing
        let spellCheckTimeout;
        const handleSpellCheck = () => {
            clearTimeout(spellCheckTimeout);
            spellCheckTimeout = window.setTimeout(() => {
                this.runAdvancedSpellCheck();
            }, 1000); // Check after 1 second of no typing
        };
        this.editor.addEventListener('input', handleSpellCheck);
    }
    async runAdvancedSpellCheck() {
        const text = this.getText();
        if (!text.trim())
            return;
        try {
            // Use LanguageTool API (free tier: 20 requests/minute)
            const response = await fetch('https://api.languagetool.org/v2/check', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({
                    'text': text,
                    'language': 'en-US',
                    'enabledOnly': 'false'
                })
            });
            if (response.ok) {
                const result = await response.json();
                this.highlightSpellingErrors(result.matches);
            }
            else {
                // Fallback to basic spell check
                this.runBasicSpellCheck();
            }
        }
        catch (error) {
            console.warn('Advanced spell check failed, using basic check:', error);
            this.runBasicSpellCheck();
        }
    }
    runBasicSpellCheck() {
        const text = this.getText();
        const words = text.split(/\s+/);
        const misspelled = words.filter(word => this.isWordMisspelled(word));
        if (misspelled.length > 0) {
            this.highlightBasicErrors(misspelled);
        }
    }
    highlightSpellingErrors(matches) {
        this.clearSpellCheckHighlights();
        const content = this.editor.innerHTML;
        let modifiedContent = content;
        // Sort matches by offset (descending) to avoid position shifts
        matches.sort((a, b) => b.offset - a.offset);
        matches.forEach((match, index) => {
            const errorText = match.context.text.substring(match.offset, match.offset + match.length);
            const suggestions = match.replacements.slice(0, 3).map((r) => r.value);
            const highlightSpan = `<span class="spell-error" data-error-id="${index}" data-suggestions="${suggestions.join('|')}" style="background: #ffebee; border-bottom: 2px wavy #f44336; cursor: pointer;" title="Suggestions: ${suggestions.join(', ')}">${errorText}</span>`;
            // Replace the error text with highlighted version
            const textContent = this.editor.textContent || '';
            textContent.substring(0, match.offset);
            textContent.substring(match.offset + match.length);
            // Find the error in HTML and replace
            const regex = new RegExp(this.escapeRegex(errorText), 'g');
            modifiedContent = modifiedContent.replace(regex, highlightSpan);
        });
        if (modifiedContent !== content) {
            this.editor.innerHTML = modifiedContent;
            this.attachSpellCheckClickHandlers();
        }
    }
    highlightBasicErrors(misspelledWords) {
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
    attachSpellCheckClickHandlers() {
        const errorSpans = this.editor.querySelectorAll('.spell-error');
        errorSpans.forEach(span => {
            span.addEventListener('click', (e) => {
                e.preventDefault();
                this.showSpellCheckSuggestions(span);
            });
        });
    }
    showSpellCheckSuggestions(errorSpan) {
        var _a;
        const suggestions = ((_a = errorSpan.getAttribute('data-suggestions')) === null || _a === void 0 ? void 0 : _a.split('|')) || [];
        errorSpan.textContent || '';
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
        popup.style.left = rect.left + 'px';
        popup.style.top = (rect.bottom + 5) + 'px';
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
                    errorSpan.textContent = suggestion;
                    errorSpan.style.background = 'transparent';
                    errorSpan.style.borderBottom = 'none';
                    errorSpan.classList.remove('spell-error');
                    popup.remove();
                };
                popup.appendChild(item);
            });
        }
        else {
            const noSuggestions = document.createElement('div');
            noSuggestions.style.cssText = 'padding: 8px 12px; color: #666; font-style: italic;';
            noSuggestions.textContent = 'No suggestions available';
            popup.appendChild(noSuggestions);
        }
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
            errorSpan.style.background = 'transparent';
            errorSpan.style.borderBottom = 'none';
            errorSpan.classList.remove('spell-error');
            popup.remove();
        };
        popup.appendChild(ignoreItem);
        document.body.appendChild(popup);
        // Remove popup when clicking outside
        setTimeout(() => {
            const handleClickOutside = (e) => {
                if (!popup.contains(e.target)) {
                    popup.remove();
                    document.removeEventListener('click', handleClickOutside);
                }
            };
            document.addEventListener('click', handleClickOutside);
        }, 100);
    }
    clearSpellCheckHighlights() {
        // Remove all spell check highlights
        const errorSpans = this.editor.querySelectorAll('.spell-error, .spell-error-basic');
        errorSpans.forEach(span => {
            const parent = span.parentNode;
            if (parent) {
                parent.replaceChild(document.createTextNode(span.textContent || ''), span);
                parent.normalize();
            }
        });
    }
    escapeRegex(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }
    isWordMisspelled(word) {
        // Clean the word
        const cleanWord = word.toLowerCase().replace(/[^\w]/g, '');
        if (cleanWord.length < 3)
            return false;
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
    async tryAlternativeSpellCheck(text) {
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
            }
            catch (error) {
                console.warn(`${api.name} spell check failed:`, error);
                continue;
            }
        }
        return null;
    }
    parseSpellCheckResponse(response, apiName) {
        var _a;
        switch (apiName) {
            case 'bing':
                return ((_a = response.flaggedTokens) === null || _a === void 0 ? void 0 : _a.map((token) => {
                    var _a;
                    return ({
                        offset: token.offset,
                        length: token.token.length,
                        suggestions: ((_a = token.suggestions) === null || _a === void 0 ? void 0 : _a.map((s) => s.suggestion)) || [],
                        context: { text: token.token }
                    });
                })) || [];
            case 'atd':
                // Parse ATD XML response
                if (typeof response === 'string') {
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(response, 'text/xml');
                    const errors = doc.querySelectorAll('error');
                    return Array.from(errors).map(error => {
                        var _a;
                        return ({
                            offset: parseInt(error.getAttribute('offset') || '0'),
                            length: parseInt(error.getAttribute('length') || '0'),
                            suggestions: ((_a = error.getAttribute('suggestions')) === null || _a === void 0 ? void 0 : _a.split('\t')) || [],
                            context: { text: error.getAttribute('string') || '' }
                        });
                    });
                }
                return [];
            default:
                return [];
        }
    }
    insertMathFormula() {
        const formula = prompt('Enter LaTeX formula:');
        if (formula) {
            const mathSpan = document.createElement('span');
            mathSpan.style.cssText = 'background: #f0f0f0; padding: 4px 8px; border-radius: 4px; font-family: monospace;';
            mathSpan.textContent = `$$${formula}$$`;
            mathSpan.title = 'Math Formula';
            const selection = window.getSelection();
            if (selection === null || selection === void 0 ? void 0 : selection.rangeCount) {
                const range = selection.getRangeAt(0);
                range.insertNode(mathSpan);
                range.collapse(false);
            }
        }
    }
    showMediaDialog() {
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
        const embedBtn = mediaDialog.querySelector('button:last-child');
        const urlInput = mediaDialog.querySelector('input');
        embedBtn.onclick = () => {
            const url = urlInput.value;
            if (url) {
                this.embedMedia(url);
                mediaDialog.remove();
            }
        };
        document.body.appendChild(mediaDialog);
    }
    embedMedia(url) {
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
        }
        else if (url.includes('vimeo.com')) {
            const videoId = url.split('/').pop();
            if (videoId) {
                embedCode = `<div style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; max-width: 100%; margin: 10px 0;">
          <iframe src="https://player.vimeo.com/video/${videoId}" 
                  style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;" 
                  frameborder="0" allowfullscreen></iframe>
        </div>`;
            }
        }
        else {
            // Generic embed for other URLs
            embedCode = `<div style="border: 1px solid #ccc; padding: 10px; margin: 10px 0; border-radius: 4px;">
        <a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a>
      </div>`;
        }
        if (embedCode) {
            this.insertHTML(embedCode);
        }
    }
    extractYouTubeId(url) {
        const patterns = [
            /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/,
            /youtube\.com\/embed\/([^&\n?#]+)/,
            /youtube\.com\/v\/([^&\n?#]+)/
        ];
        for (const pattern of patterns) {
            const match = url.match(pattern);
            if (match)
                return match[1];
        }
        return null;
    }
    showMentions() {
        var _a;
        if (!((_a = this.options.mentions) === null || _a === void 0 ? void 0 : _a.feeds))
            return;
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
        const handleClickOutside = (e) => {
            if (!mentionDialog.contains(e.target)) {
                mentionDialog.remove();
                document.removeEventListener('click', handleClickOutside);
            }
        };
        setTimeout(() => {
            document.addEventListener('click', handleClickOutside);
        }, 100);
    }
    exportToPdf() {
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
            }
            else {
                alert('Please allow popups to export PDF');
            }
        }
        catch (error) {
            console.error('PDF export failed:', error);
            alert('PDF export failed. Please try again.');
        }
    }
    exportToWord() {
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
        }
        catch (error) {
            console.error('Word export failed:', error);
            alert('Word export failed. Please try again.');
        }
    }
    importFromWord() {
        try {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = '.doc,.docx,.html,.htm';
            input.style.display = 'none';
            input.onchange = (e) => {
                var _a;
                const file = (_a = e.target.files) === null || _a === void 0 ? void 0 : _a[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        var _a;
                        try {
                            let content = (_a = e.target) === null || _a === void 0 ? void 0 : _a.result;
                            // Basic cleanup for Word HTML
                            content = content
                                .replace(/<o:p\s*\/?>|<\/o:p>/gi, '')
                                .replace(/<w:[^>]*>|<\/w:[^>]*>/gi, '')
                                .replace(/class="[^"]*"/gi, '')
                                .replace(/style="[^"]*"/gi, '')
                                .replace(/<span[^>]*>([^<]*)<\/span>/gi, '$1')
                                .replace(/<font[^>]*>([^<]*)<\/font>/gi, '$1');
                            this.setContent(content);
                        }
                        catch (error) {
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
        }
        catch (error) {
            console.error('Import failed:', error);
            alert('Import failed. Please try again.');
        }
    }
    toggleWordCount() {
        if (!this.wordCountPanel) {
            this.createWordCountPanel();
        }
        this.wordCountPanel.style.display = this.wordCountPanel.style.display === 'none' ? 'block' : 'none';
        this.updateWordCount();
    }
    createWordCountPanel() {
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
    updateWordCount() {
        if (!this.wordCountPanel || this.wordCountPanel.style.display === 'none')
            return;
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
    toggleFullscreen() {
        if (this.container.style.position === 'fixed') {
            this.container.style.cssText = this.container.getAttribute('data-original-style') || '';
            this.container.removeAttribute('data-original-style');
        }
        else {
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
    setupAutoSave() {
        if (this.options.autoSave) {
            this.autoSaveTimer = window.setInterval(() => {
                const content = this.getContent();
                this.options.autoSave.callback(content);
            }, this.options.autoSave.interval);
        }
    }
    setupCollaboration() {
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
    initializeCollaboration() {
        const { channelId, userId, userName } = this.options.collaboration;
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
    handleCollaborativeChange(event) {
        const { userId, channelId } = this.options.collaboration;
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
    handleSelectionChange() {
        if (!this.options.collaboration)
            return;
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
    createCollaboratorsPanel() {
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
    updateCollaboratorsDisplay() {
        const list = this.container.querySelector('#collaborators-list');
        if (!list)
            return;
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
    updateCollaboratorCursor(userId, position) {
        const collaborator = this.collaborators.get(userId);
        if (!collaborator)
            return;
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
    updateCollaboratorActivity(userId) {
        const collaborator = this.collaborators.get(userId);
        if (collaborator) {
            collaborator.lastSeen = Date.now();
            this.updateCollaboratorsDisplay();
        }
    }
    generateUserColor(userId) {
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
    simulateCollaborators() {
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
    createEditor() {
        const isDark = this.options.theme === 'dark';
        this.editor = document.createElement('div');
        this.editor.contentEditable = 'true';
        this.editor.style.cssText = `
      padding: 12px;
      min-height: ${this.options.height || '300px'};
      outline: none;
      overflow-y: auto;
      line-height: 1.6;
      background: ${isDark ? '#2d2d2d' : '#fff'};
      color: ${isDark ? '#fff' : '#000'};
    `;
        if (this.options.placeholder) {
            this.editor.setAttribute('data-placeholder', this.options.placeholder);
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
    attachEvents() {
        this.editor.addEventListener('input', () => {
            var _a, _b;
            (_b = (_a = this.options).onChange) === null || _b === void 0 ? void 0 : _b.call(_a, this.getContent());
            this.updateWordCount();
        });
        this.editor.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) {
                const shortcuts = {
                    'b': () => this.execCommand('bold'),
                    'i': () => this.execCommand('italic'),
                    'u': () => this.execCommand('underline'),
                    'z': () => this.execCommand('undo'),
                    'y': () => this.execCommand('redo'),
                    'k': () => this.showLinkDialog(),
                    's': () => { var _a; return (_a = this.options.autoSave) === null || _a === void 0 ? void 0 : _a.callback(this.getContent()); }
                };
                if (shortcuts[e.key]) {
                    e.preventDefault();
                    shortcuts[e.key]();
                }
            }
            if (e.key === 'Tab') {
                e.preventDefault();
                this.execCommand('insertHTML', '&nbsp;&nbsp;&nbsp;&nbsp;');
            }
            // Mention trigger
            if (e.key === '@' && this.options.mentions) {
                setTimeout(() => this.showMentions(), 100);
            }
        });
        this.editor.addEventListener('paste', (e) => {
            var _a;
            e.preventDefault();
            const text = ((_a = e.clipboardData) === null || _a === void 0 ? void 0 : _a.getData('text/plain')) || '';
            this.execCommand('insertText', text);
        });
    }
    execCommand(command, value) {
        this.editor.focus();
        document.execCommand(command, false, value);
    }
    getContent() {
        if (this.isSSR || !this.editor)
            return '';
        return this.editor.innerHTML;
    }
    setContent(html) {
        if (this.isSSR || !this.editor)
            return;
        if (typeof html !== 'string') {
            console.warn('setContent expects a string, received:', typeof html);
            html = String(html || '');
        }
        this.editor.innerHTML = html;
        this.updateWordCount();
    }
    getText() {
        if (this.isSSR || !this.editor)
            return '';
        return this.editor.textContent || '';
    }
    focus() {
        if (this.isSSR || !this.editor)
            return;
        this.editor.focus();
    }
    insertHTML(html) {
        if (this.isSSR || !this.editor)
            return;
        if (typeof html !== 'string') {
            console.warn('insertHTML expects a string, received:', typeof html);
            return;
        }
        this.editor.focus();
        try {
            this.execCommand('insertHTML', html);
        }
        catch (error) {
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
    getSelection() {
        if (this.isSSR)
            return null;
        return window.getSelection();
    }
    destroy() {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        if (this.isSSR)
            return;
        (_a = this.colorPicker) === null || _a === void 0 ? void 0 : _a.remove();
        (_b = this.linkDialog) === null || _b === void 0 ? void 0 : _b.remove();
        (_c = this.imageDialog) === null || _c === void 0 ? void 0 : _c.remove();
        (_d = this.tableDialog) === null || _d === void 0 ? void 0 : _d.remove();
        (_e = this.commentSidebar) === null || _e === void 0 ? void 0 : _e.remove();
        (_f = this.trackChangesPanel) === null || _f === void 0 ? void 0 : _f.remove();
        (_g = this.wordCountPanel) === null || _g === void 0 ? void 0 : _g.remove();
        // Clean up collaboration elements
        const collaboratorsPanel = (_h = this.container) === null || _h === void 0 ? void 0 : _h.querySelector('.collaborators-panel');
        collaboratorsPanel === null || collaboratorsPanel === void 0 ? void 0 : collaboratorsPanel.remove();
        // Remove all cursors
        document.querySelectorAll('[data-cursor]').forEach(cursor => cursor.remove());
        if (this.autoSaveTimer) {
            clearInterval(this.autoSaveTimer);
        }
        if (this.container) {
            this.container.innerHTML = '';
        }
    }
}
// Auto-initialization for data attributes (SSR-safe)
if (typeof window !== 'undefined' && typeof document !== 'undefined') {
    const initializeEditors = () => {
        document.querySelectorAll('[data-armor-editor]').forEach(el => {
            try {
                const height = el.getAttribute('data-height') || '300px';
                const theme = el.getAttribute('data-theme') || 'light';
                const placeholder = el.getAttribute('data-placeholder') || '';
                new ArmorEditor({
                    container: el,
                    height,
                    theme,
                    placeholder
                });
            }
            catch (error) {
                console.error('Failed to initialize ArmorEditor:', error);
            }
        });
    };
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeEditors);
    }
    else {
        // For Next.js/Nuxt.js - delay initialization
        setTimeout(initializeEditors, 100);
    }
}

exports.ArmorEditor = ArmorEditor;
exports.VERSION = VERSION;
