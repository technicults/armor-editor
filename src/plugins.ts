// Plugin system for ArmorEditor
export interface Plugin {
  name: string;
  version: string;
  init: (editor: any) => void;
  destroy?: () => void;
}

export class PluginManager {
  private plugins: Map<string, Plugin> = new Map();
  private editor: any;

  constructor(editor: any) {
    this.editor = editor;
  }

  register(plugin: Plugin) {
    if (this.plugins.has(plugin.name)) {
      console.warn(`Plugin ${plugin.name} is already registered`);
      return;
    }

    this.plugins.set(plugin.name, plugin);
    plugin.init(this.editor);
  }

  unregister(pluginName: string) {
    const plugin = this.plugins.get(pluginName);
    if (plugin && plugin.destroy) {
      plugin.destroy();
    }
    this.plugins.delete(pluginName);
  }

  getPlugin(name: string): Plugin | undefined {
    return this.plugins.get(name);
  }

  getAllPlugins(): Plugin[] {
    return Array.from(this.plugins.values());
  }

  destroy() {
    this.plugins.forEach(plugin => {
      if (plugin.destroy) {
        plugin.destroy();
      }
    });
    this.plugins.clear();
  }
}

// Built-in plugins
export const wordCountPlugin: Plugin = {
  name: 'wordCount',
  version: '1.0.0',
  init: (editor) => {
    const updateWordCount = () => {
      const text = editor.getText();
      const words = text.trim().split(/\s+/).filter((word: string) => word.length > 0).length;
      const chars = text.length;
      
      let counter = editor.container.querySelector('.word-counter');
      if (!counter) {
        counter = document.createElement('div');
        counter.className = 'word-counter';
        counter.style.cssText = `
          position: absolute;
          bottom: 5px;
          right: 10px;
          font-size: 12px;
          color: #666;
          background: rgba(255,255,255,0.9);
          padding: 2px 6px;
          border-radius: 3px;
        `;
        editor.container.appendChild(counter);
      }
      
      counter.textContent = `${words} words, ${chars} chars`;
    };

    editor.on('change', updateWordCount);
    updateWordCount();
  }
};

export const autoSavePlugin: Plugin = {
  name: 'autoSave',
  version: '1.0.0',
  init: (editor) => {
    let timeout: number;
    
    const autoSave = () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        const content = editor.getContent();
        localStorage.setItem(`armor-editor-${editor.id}`, content);
        console.log('Content auto-saved');
      }, 2000);
    };

    editor.on('change', autoSave);
  }
};
