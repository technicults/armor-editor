// AI Enhancements for ArmorEditor
export interface AIProvider {
  name: string;
  apiKey: string;
  models: string[];
  defaultModel: string;
}

export interface AIConfig {
  enabled: boolean;
  providers?: {
    openai?: AIProvider;
    anthropic?: AIProvider;
    google?: AIProvider;
    cohere?: AIProvider;
    huggingface?: AIProvider;
  };
  defaultProvider?: string;
  features?: {
    smartSuggestions?: boolean;
    contentGeneration?: boolean;
    grammarCheck?: boolean;
    toneAdjustment?: boolean;
  };
}

export interface ContentTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  content: string;
  variables: string[];
}

export class AIEnhancements {
  private editor: any;
  private config: AIConfig;
  private suggestionBox: HTMLElement | null = null;
  private templates: ContentTemplate[] = [];

  constructor(editor: any, config: AIConfig) {
    this.editor = editor;
    this.config = config;
    this.initializeTemplates();
    
    if (config.enabled) {
      this.setupSmartSuggestions();
    }
  }

  private initializeTemplates() {
    this.templates = [
      {
        id: 'blog-post',
        name: 'Blog Post',
        description: 'Professional blog post template',
        category: 'Content',
        content: '# {{title}}\n\n{{introduction}}\n\n## Main Content\n{{main_points}}\n\n## Conclusion\n{{conclusion}}\n\n---\n*Published on {{date}}*',
        variables: ['title', 'introduction', 'main_points', 'conclusion', 'date']
      },
      {
        id: 'meeting-notes',
        name: 'Meeting Notes',
        description: 'Structured meeting notes template',
        category: 'Business',
        content: '# Meeting Notes - {{meeting_title}}\n\n**Date:** {{date}}\n**Attendees:** {{attendees}}\n**Duration:** {{duration}}\n\n## Agenda\n{{agenda_items}}\n\n## Discussion Points\n{{discussion}}\n\n## Action Items\n{{action_items}}\n\n## Next Steps\n{{next_steps}}',
        variables: ['meeting_title', 'date', 'attendees', 'duration', 'agenda_items', 'discussion', 'action_items', 'next_steps']
      }
    ];
  }

  private setupSmartSuggestions() {
    let typingTimer: number;
    
    this.editor.editor.addEventListener('input', () => {
      clearTimeout(typingTimer);
      typingTimer = setTimeout(() => {
        this.checkForSuggestions();
      }, 1000) as any;
    });

    // Template trigger
    this.editor.editor.addEventListener('keydown', (e: KeyboardEvent) => {
      if (e.key === '/' && this.editor.getText().trim() === '') {
        e.preventDefault();
        this.showTemplateSelector();
      }
    });
  }

  private async checkForSuggestions() {
    const content = this.editor.getText();
    if (content.length < 10) return;

    const suggestions = await this.getAISuggestions(content);
    if (suggestions.length > 0) {
      this.showSuggestions(suggestions);
    }
  }

  private async getAISuggestions(content: string): Promise<string[]> {
    try {
      // Simulate AI suggestions (in real implementation, call AI API)
      const suggestions = [
        'Consider adding more specific examples',
        'This paragraph could be more concise',
        'Add a transition sentence here'
      ];

      return suggestions.slice(0, 2); // Return top 2 suggestions
    } catch (error) {
      console.error('AI suggestions failed:', error);
      return [];
    }
  }

  private showSuggestions(suggestions: string[]) {
    this.hideSuggestions();

    this.suggestionBox = document.createElement('div');
    this.suggestionBox.className = 'ai-suggestions';
    this.suggestionBox.innerHTML = `
      <div class="ai-suggestions-header">
        <span>💡 AI Suggestions</span>
        <button class="close-btn" onclick="this.parentElement.parentElement.remove()">×</button>
      </div>
      <div class="ai-suggestions-list">
        ${suggestions.map(suggestion => `
          <div class="suggestion-item" onclick="this.dispatchEvent(new CustomEvent('apply-suggestion', {detail: '${suggestion}', bubbles: true}))">
            ${suggestion}
          </div>
        `).join('')}
      </div>
    `;

    // Add styles
    const style = document.createElement('style');
    style.textContent = `
      .ai-suggestions {
        position: absolute;
        top: 100%;
        right: 0;
        width: 300px;
        background: white;
        border: 1px solid #e1e5e9;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 1000;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      }
      
      .ai-suggestions-header {
        padding: 12px 16px;
        border-bottom: 1px solid #e1e5e9;
        display: flex;
        justify-content: space-between;
        align-items: center;
        background: #f8f9fa;
        border-radius: 8px 8px 0 0;
        font-weight: 600;
        font-size: 14px;
      }
      
      .close-btn {
        background: none;
        border: none;
        font-size: 18px;
        cursor: pointer;
        color: #6c757d;
      }
      
      .ai-suggestions-list {
        padding: 8px 0;
      }
      
      .suggestion-item {
        padding: 12px 16px;
        cursor: pointer;
        font-size: 14px;
        line-height: 1.4;
        color: #495057;
      }
      
      .suggestion-item:hover {
        background: #f8f9fa;
      }
    `;

    if (!document.head.querySelector('#ai-suggestions-styles')) {
      style.id = 'ai-suggestions-styles';
      document.head.appendChild(style);
    }

    // Position relative to editor
    const editorRect = this.editor.container.getBoundingClientRect();
    this.suggestionBox.style.position = 'fixed';
    this.suggestionBox.style.top = editorRect.top + 10 + 'px';
    this.suggestionBox.style.right = '20px';

    document.body.appendChild(this.suggestionBox);

    // Handle suggestion application
    this.suggestionBox.addEventListener('apply-suggestion', (e: any) => {
      this.applySuggestion(e.detail);
    });
  }

  private applySuggestion(suggestion: string) {
    // Insert suggestion as comment or highlight
    this.editor.insertHTML('<span class="ai-suggestion" title="' + suggestion + '">💡</span>');
    this.hideSuggestions();
  }

  private hideSuggestions() {
    if (this.suggestionBox) {
      this.suggestionBox.remove();
      this.suggestionBox = null;
    }
  }

  private showTemplateSelector() {
    const selector = document.createElement('div');
    selector.className = 'template-selector';
    selector.innerHTML = `
      <div class="template-selector-header">
        <span>📝 Choose Template</span>
        <button class="close-btn" onclick="this.parentElement.parentElement.remove()">×</button>
      </div>
      <div class="template-list">
        ${this.templates.map(template => `
          <div class="template-item" data-template-id="${template.id}">
            <div class="template-name">${template.name}</div>
            <div class="template-description">${template.description}</div>
            <div class="template-category">${template.category}</div>
          </div>
        `).join('')}
      </div>
    `;

    // Add styles
    const style = document.createElement('style');
    style.textContent = `
      .template-selector {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 500px;
        max-height: 600px;
        background: white;
        border: 1px solid #e1e5e9;
        border-radius: 12px;
        box-shadow: 0 8px 32px rgba(0,0,0,0.2);
        z-index: 1001;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      }
      
      .template-selector-header {
        padding: 20px 24px;
        border-bottom: 1px solid #e1e5e9;
        display: flex;
        justify-content: space-between;
        align-items: center;
        background: #f8f9fa;
        border-radius: 12px 12px 0 0;
        font-weight: 600;
        font-size: 16px;
      }
      
      .template-list {
        padding: 16px;
        max-height: 400px;
        overflow-y: auto;
      }
      
      .template-item {
        padding: 16px;
        border: 1px solid #e1e5e9;
        border-radius: 8px;
        margin-bottom: 12px;
        cursor: pointer;
        transition: all 0.2s;
      }
      
      .template-item:hover {
        border-color: #007bff;
        box-shadow: 0 2px 8px rgba(0,123,255,0.1);
      }
      
      .template-name {
        font-weight: 600;
        font-size: 16px;
        color: #212529;
        margin-bottom: 4px;
      }
      
      .template-description {
        font-size: 14px;
        color: #6c757d;
        margin-bottom: 8px;
      }
      
      .template-category {
        font-size: 12px;
        color: #007bff;
        font-weight: 500;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }
    `;

    if (!document.head.querySelector('#template-selector-styles')) {
      style.id = 'template-selector-styles';
      document.head.appendChild(style);
    }

    document.body.appendChild(selector);

    // Handle template selection
    selector.addEventListener('click', (e) => {
      const templateItem = (e.target as HTMLElement).closest('.template-item');
      if (templateItem) {
        const templateId = templateItem.getAttribute('data-template-id');
        const template = this.templates.find(t => t.id === templateId);
        if (template) {
          this.applyTemplate(template);
          selector.remove();
        }
      }
    });

    // Close on escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        selector.remove();
      }
    }, { once: true });
  }

  private applyTemplate(template: ContentTemplate) {
    let content = template.content;
    
    // Replace variables with placeholders
    template.variables.forEach(variable => {
      const placeholder = '[' + variable.toUpperCase() + ']';
      content = content.replace(new RegExp('{{' + variable + '}}', 'g'), placeholder);
    });

    this.editor.setContent(content);
    this.editor.focus();
  }

  async generateContent(prompt: string): Promise<string> {
    try {
      // Simulate AI content generation
      return new Promise(resolve => {
        setTimeout(() => {
          resolve('Generated content based on: "' + prompt + '"');
        }, 1000);
      });
    } catch (error) {
      console.error('AI generation failed:', error);
      return '';
    }
  }

  addTemplate(template: ContentTemplate) {
    this.templates.push(template);
  }

  getTemplates(): ContentTemplate[] {
    return this.templates;
  }

  destroy() {
    this.hideSuggestions();
  }
}
