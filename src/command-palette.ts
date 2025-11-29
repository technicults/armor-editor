// Command Palette System
export interface Command {
  id: string;
  title: string;
  description?: string;
  category: string;
  shortcut?: string;
  action: () => void;
}

export class CommandPalette {
  private commands: Map<string, Command> = new Map();
  private palette: HTMLElement | null = null;
  private input: HTMLInputElement | null = null;
  private results: HTMLElement | null = null;
  private editor: any;
  private isVisible = false;

  constructor(editor: any) {
    this.editor = editor;
    this.registerDefaultCommands();
    this.setupKeyListener();
  }

  private setupKeyListener() {
    document.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'P') {
        e.preventDefault();
        this.toggle();
      }
      if (e.key === 'Escape' && this.isVisible) {
        this.hide();
      }
    });
  }

  private registerDefaultCommands() {
    const commands: Command[] = [
      {
        id: 'bold',
        title: 'Bold',
        description: 'Make text bold',
        category: 'Format',
        shortcut: 'Ctrl+B',
        action: () => document.execCommand('bold')
      },
      {
        id: 'italic',
        title: 'Italic',
        description: 'Make text italic',
        category: 'Format',
        shortcut: 'Ctrl+I',
        action: () => document.execCommand('italic')
      },
      {
        id: 'theme-dark',
        title: 'Switch to Dark Theme',
        category: 'Theme',
        action: () => this.editor.setTheme('dark')
      },
      {
        id: 'theme-light',
        title: 'Switch to Light Theme',
        category: 'Theme',
        action: () => this.editor.setTheme('light')
      },
      {
        id: 'save',
        title: 'Save Document',
        category: 'File',
        shortcut: 'Ctrl+S',
        action: () => this.editor.options.autoSave?.callback?.(this.editor.getContent())
      }
    ];

    commands.forEach(cmd => this.registerCommand(cmd));
  }

  registerCommand(command: Command) {
    this.commands.set(command.id, command);
  }

  private createPalette() {
    this.palette = document.createElement('div');
    this.palette.className = 'command-palette';
    this.palette.style.cssText = `
      position: fixed;
      top: 20%;
      left: 50%;
      transform: translateX(-50%);
      width: 600px;
      max-width: 90vw;
      background: var(--ae-bg, white);
      border: 1px solid var(--ae-border, #ccc);
      border-radius: 8px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.2);
      z-index: 10000;
      overflow: hidden;
    `;

    this.input = document.createElement('input');
    this.input.placeholder = 'Type a command...';
    this.input.style.cssText = `
      width: 100%;
      padding: 16px;
      border: none;
      outline: none;
      font-size: 16px;
      background: transparent;
      color: var(--ae-text, black);
    `;

    this.results = document.createElement('div');
    this.results.style.cssText = `
      max-height: 300px;
      overflow-y: auto;
    `;

    this.palette.appendChild(this.input);
    this.palette.appendChild(this.results);

    this.input.addEventListener('input', () => this.updateResults());
    this.input.addEventListener('keydown', (e) => this.handleKeydown(e));

    document.body.appendChild(this.palette);
  }

  private updateResults() {
    if (!this.input || !this.results) return;

    const query = this.input.value.toLowerCase();
    const filtered = Array.from(this.commands.values())
      .filter(cmd => 
        cmd.title.toLowerCase().includes(query) ||
        cmd.category.toLowerCase().includes(query)
      )
      .slice(0, 10);

    this.results.innerHTML = '';
    
    filtered.forEach((cmd, index) => {
      const item = document.createElement('div');
      item.className = `command-item ${index === 0 ? 'selected' : ''}`;
      item.style.cssText = `
        padding: 12px 16px;
        cursor: pointer;
        border-bottom: 1px solid var(--ae-border, #eee);
        display: flex;
        justify-content: space-between;
        align-items: center;
      `;
      
      item.innerHTML = `
        <div>
          <div style="font-weight: 500;">${cmd.title}</div>
          <div style="font-size: 12px; color: #666;">${cmd.category}</div>
        </div>
        ${cmd.shortcut ? `<kbd style="background: #f0f0f0; padding: 2px 6px; border-radius: 3px; font-size: 11px;">${cmd.shortcut}</kbd>` : ''}
      `;

      item.addEventListener('click', () => {
        cmd.action();
        this.hide();
      });

      this.results!.appendChild(item);
    });
  }

  private handleKeydown(e: KeyboardEvent) {
    const items = this.results?.querySelectorAll('.command-item');
    if (!items) return;

    const selected = this.results?.querySelector('.selected');
    let index = Array.from(items).indexOf(selected as Element);

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      index = Math.min(index + 1, items.length - 1);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      index = Math.max(index - 1, 0);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      (selected as HTMLElement)?.click();
      return;
    }

    items.forEach((item, i) => {
      item.classList.toggle('selected', i === index);
    });
  }

  show() {
    if (!this.palette) this.createPalette();
    if (this.palette) {
      this.palette.style.display = 'block';
      this.input?.focus();
      this.updateResults();
      this.isVisible = true;
    }
  }

  hide() {
    if (this.palette) {
      this.palette.style.display = 'none';
      this.isVisible = false;
    }
  }

  toggle() {
    this.isVisible ? this.hide() : this.show();
  }

  destroy() {
    if (this.palette) {
      document.body.removeChild(this.palette);
    }
  }
}
