import { ArmorEditor } from '../src/index';

describe('ArmorEditor', () => {
  let container: HTMLDivElement;
  let editor: ArmorEditor;

  beforeEach(() => {
    container = document.createElement('div');
    container.id = 'test-editor';
    document.body.appendChild(container);
  });

  afterEach(() => {
    if (editor) {
      editor.destroy();
    }
    document.body.removeChild(container);
  });

  describe('Initialization', () => {
    test('should create editor instance', () => {
      editor = new ArmorEditor({
        container: '#test-editor',
        height: '300px'
      });

      expect(editor).toBeInstanceOf(ArmorEditor);
    });

    test('should create editor with DOM element', () => {
      editor = new ArmorEditor({
        container: container,
        height: '300px'
      });

      expect(editor).toBeInstanceOf(ArmorEditor);
    });

    test('should throw error for invalid container', () => {
      expect(() => {
        new ArmorEditor({
          container: '#non-existent',
          height: '300px'
        });
      }).toThrow();
    });
  });

  describe('Content Management', () => {
    beforeEach(() => {
      editor = new ArmorEditor({
        container: '#test-editor',
        height: '300px'
      });
    });

    test('should set and get content', () => {
      const testContent = '<p>Hello World</p>';
      editor.setContent(testContent);
      expect(editor.getContent()).toBe(testContent);
    });

    test('should get plain text', () => {
      editor.setContent('<p>Hello <strong>World</strong></p>');
      expect(editor.getText()).toBe('Hello World');
    });

    test('should sanitize malicious content', () => {
      const maliciousContent = '<p>Safe content</p><script>alert("xss")</script>';
      editor.setContent(maliciousContent);
      expect(editor.getContent()).not.toContain('<script>');
      expect(editor.getContent()).toContain('<p>Safe content</p>');
    });
  });

  describe('Read-only Mode', () => {
    test('should initialize in read-only mode', () => {
      editor = new ArmorEditor({
        container: '#test-editor',
        readOnly: true
      });

      expect(editor.isReadOnly()).toBe(true);
    });

    test('should toggle read-only mode', () => {
      editor = new ArmorEditor({
        container: '#test-editor'
      });

      expect(editor.isReadOnly()).toBe(false);
      
      editor.setReadOnly(true);
      expect(editor.isReadOnly()).toBe(true);
      
      editor.setReadOnly(false);
      expect(editor.isReadOnly()).toBe(false);
    });
  });

  describe('Events', () => {
    test('should trigger onChange event', (done) => {
      editor = new ArmorEditor({
        container: '#test-editor',
        onChange: (content) => {
          expect(content).toBe('<p>Test</p>');
          done();
        }
      });

      editor.setContent('<p>Test</p>');
    });

    test('should trigger onReady event', (done) => {
      editor = new ArmorEditor({
        container: '#test-editor',
        onReady: () => {
          done();
        }
      });
    });
  });

  describe('AI Integration', () => {
    test('should initialize without AI by default', () => {
      editor = new ArmorEditor({
        container: '#test-editor'
      });

      // AI button should not be present
      const aiButton = container.querySelector('[title="AI Writing Assistant"]');
      expect(aiButton).toBeNull();
    });

    test('should initialize with AI when enabled', () => {
      editor = new ArmorEditor({
        container: '#test-editor',
        ai: {
          enabled: true,
          provider: 'openai',
          apiKey: 'test-key'
        }
      });

      // AI button should be present
      const aiButton = container.querySelector('[title="AI Writing Assistant"]');
      expect(aiButton).toBeTruthy();
    });
  });

  describe('Mobile Support', () => {
    test('should detect mobile environment', () => {
      // Mock mobile user agent
      Object.defineProperty(navigator, 'userAgent', {
        value: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)',
        configurable: true
      });

      editor = new ArmorEditor({
        container: '#test-editor',
        mobile: {
          enabled: true,
          collapsibleToolbar: true
        }
      });

      expect(editor).toBeInstanceOf(ArmorEditor);
    });
  });

  describe('Cleanup', () => {
    test('should destroy editor properly', () => {
      editor = new ArmorEditor({
        container: '#test-editor'
      });

      const editorElement = container.querySelector('.armor-editor-editor');
      expect(editorElement).toBeTruthy();

      editor.destroy();

      const editorElementAfter = container.querySelector('.armor-editor-editor');
      expect(editorElementAfter).toBeNull();
    });
  });
});
