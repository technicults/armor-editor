// Keyboard shortcuts system
export interface Shortcut {
  key: string;
  ctrl?: boolean;
  alt?: boolean;
  shift?: boolean;
  meta?: boolean;
  action: () => void;
  description: string;
}

export class ShortcutManager {
  private shortcuts: Map<string, Shortcut> = new Map();
  private editor: any;

  constructor(editor: any) {
    this.editor = editor;
    this.setupEventListener();
    this.registerDefaultShortcuts();
  }

  private setupEventListener() {
    this.editor.editor.addEventListener('keydown', (e: KeyboardEvent) => {
      const shortcutKey = this.getShortcutKey(e);
      const shortcut = this.shortcuts.get(shortcutKey);
      
      if (shortcut) {
        e.preventDefault();
        shortcut.action();
      }
    });
  }

  private getShortcutKey(e: KeyboardEvent): string {
    const parts = [];
    if (e.ctrlKey) parts.push('ctrl');
    if (e.altKey) parts.push('alt');
    if (e.shiftKey) parts.push('shift');
    if (e.metaKey) parts.push('meta');
    parts.push(e.key.toLowerCase());
    return parts.join('+');
  }

  register(shortcut: Shortcut) {
    const key = this.buildShortcutKey(shortcut);
    this.shortcuts.set(key, shortcut);
  }

  private buildShortcutKey(shortcut: Shortcut): string {
    const parts = [];
    if (shortcut.ctrl) parts.push('ctrl');
    if (shortcut.alt) parts.push('alt');
    if (shortcut.shift) parts.push('shift');
    if (shortcut.meta) parts.push('meta');
    parts.push(shortcut.key.toLowerCase());
    return parts.join('+');
  }

  private registerDefaultShortcuts() {
    const shortcuts: Shortcut[] = [
      {
        key: 'b',
        ctrl: true,
        action: () => document.execCommand('bold'),
        description: 'Bold text'
      },
      {
        key: 'i',
        ctrl: true,
        action: () => document.execCommand('italic'),
        description: 'Italic text'
      },
      {
        key: 'u',
        ctrl: true,
        action: () => document.execCommand('underline'),
        description: 'Underline text'
      },
      {
        key: 'z',
        ctrl: true,
        action: () => document.execCommand('undo'),
        description: 'Undo'
      },
      {
        key: 'y',
        ctrl: true,
        action: () => document.execCommand('redo'),
        description: 'Redo'
      },
      {
        key: 's',
        ctrl: true,
        action: () => {
          if (this.editor.options.autoSave?.callback) {
            this.editor.options.autoSave.callback(this.editor.getContent());
          }
        },
        description: 'Save'
      }
    ];

    shortcuts.forEach(shortcut => this.register(shortcut));
  }

  getShortcuts(): Shortcut[] {
    return Array.from(this.shortcuts.values());
  }
}
