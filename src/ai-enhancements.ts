// Advanced AI Features
export interface ContentTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  content: string;
  variables?: string[];
}

export class AIEnhancements {
  private editor: any;
  private templates: ContentTemplate[] = [];
  private suggestionBox: HTMLElement | null = null;

  constructor(editor: any) {
    this.editor = editor;
    this.loadDefaultTemplates();
    this.setupSmartSuggestions();
  }

  private loadDefaultTemplates() {
    this.templates = [
      {
        id: 'email-professional',
        name: 'Professional Email',
        description: 'Formal business email template',
        category: 'Email',
        content: `Subject: {{subject}}

Dear {{recipient}},

I hope this email finds you well. I am writing to {{purpose}}.

{{main_content}}

Please let me know if you have any questions or need further clarification.

Best regards,
{{sender_name}}`,
        variables: ['subject', 'recipient', 'purpose', 'main_content', 'sender_name']
      },
      {
        id: 'blog-post',
        name: 'Blog Post Structure',
        description: 'Standard blog post template',
        category: 'Blog',
        content: `# {{title}}

## Introduction
{{introduction}}

## Main Content
{{main_points}}

## Conclusion
{{conclusion}}

---
*Published on {{date}}*`,
        variables: ['title', 'introduction', 'main_points', 'conclusion', 'date']
      },
      {
        id: 'meeting-notes',
        name: 'Meeting Notes',
        description: 'Structured meeting notes template',
        category: 'Business',
        content: `# Meeting Notes - {{meeting_title}}

**Date:** {{date}}
**Attendees:** {{attendees}}
**Duration:** {{duration}}

## Agenda
{{agenda_items}}

## Discussion Points
{{discussion}}

## Action Items
{{action_items}}

## Next Steps
{{next_steps}}`,
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
    const words = content.split(' ');
    
    // Smart completion suggestions
    if (words.length > 3 && words.length < 20) {
      const suggestions = await this.getAISuggestions(content);
      if (suggestions.length > 0) {
        this.showSuggestions(suggestions);
      }
    }
  }

  private async getAISuggestions(content: string): Promise<string[]> {
    // Simulate AI suggestions (in real implementation, call AI API)
    const suggestions = [
      'Continue with more details about this topic',
      'Add supporting evidence or examples',
      'Conclude with a call to action',
      'Expand on the implications of this point'
    ];
    
    return suggestions.slice(0, 2); // Return top 2 suggestions
  }

  private showSuggestions(suggestions: string[]) {
    this.hideSuggestions();
    
    this.suggestionBox = document.createElement('div');
    this.suggestionBox.className = 'ai-suggestions';
    this.suggestionBox.style.cssText = `
      position: absolute;
      background: var(--ae-bg, white);
      border: 1px solid var(--ae-border, #ccc);
      border-radius: 6px;
      padding: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      z-index: 1000;
      max-width: 300px;
      font-size: 13px;
    `;

    const title = document.createElement('div');
    title.textContent = '💡 AI Suggestions';
    title.style.cssText = 'font-weight: bold; margin-bottom: 8px; color: #666;';
    this.suggestionBox.appendChild(title);

    suggestions.forEach(suggestion => {
      const item = document.createElement('div');
      item.textContent = suggestion;
      item.style.cssText = `
        padding: 6px;
        cursor: pointer;
        border-radius: 4px;
        margin-bottom: 4px;
        background: #f8f9fa;
      `;
      
      item.addEventListener('click', () => {
        this.applySuggestion(suggestion);
        this.hideSuggestions();
      });
      
      this.suggestionBox.appendChild(item);
    });

    // Position near cursor
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const rect = selection.getRangeAt(0).getBoundingClientRect();
      this.suggestionBox.style.left = `${rect.right + 10}px`;
      this.suggestionBox.style.top = `${rect.top}px`;
    }

    document.body.appendChild(this.suggestionBox);

    // Auto-hide after 10 seconds
    setTimeout(() => this.hideSuggestions(), 10000);
  }

  private applySuggestion(suggestion: string) {
    // Insert suggestion as a comment or prompt for user
    const prompt = `\n\n<!-- AI Suggestion: ${suggestion} -->\n\n`;
    this.editor.insertHTML(prompt);
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
    selector.style.cssText = `
      position: absolute;
      background: var(--ae-bg, white);
      border: 1px solid var(--ae-border, #ccc);
      border-radius: 8px;
      padding: 12px;
      box-shadow: 0 6px 20px rgba(0,0,0,0.15);
      z-index: 1000;
      width: 400px;
      max-height: 300px;
      overflow-y: auto;
    `;

    const title = document.createElement('h3');
    title.textContent = 'Choose a Template';
    title.style.margin = '0 0 12px 0';
    selector.appendChild(title);

    // Group templates by category
    const categories = [...new Set(this.templates.map(t => t.category))];
    
    categories.forEach(category => {
      const categoryTitle = document.createElement('div');
      categoryTitle.textContent = category;
      categoryTitle.style.cssText = 'font-weight: bold; margin: 8px 0 4px 0; color: #666;';
      selector.appendChild(categoryTitle);

      const categoryTemplates = this.templates.filter(t => t.category === category);
      categoryTemplates.forEach(template => {
        const item = document.createElement('div');
        item.style.cssText = `
          padding: 8px;
          cursor: pointer;
          border-radius: 4px;
          margin-bottom: 4px;
          border: 1px solid #eee;
        `;
        
        item.innerHTML = `
          <div style="font-weight: 500;">${template.name}</div>
          <div style="font-size: 12px; color: #666;">${template.description}</div>
        `;
        
        item.addEventListener('click', () => {
          this.applyTemplate(template);
          selector.remove();
        });
        
        selector.appendChild(item);
      });
    });

    // Position in center of editor
    const editorRect = this.editor.container.getBoundingClientRect();
    selector.style.left = `${editorRect.left + (editorRect.width - 400) / 2}px`;
    selector.style.top = `${editorRect.top + 50}px`;

    document.body.appendChild(selector);

    // Close on outside click
    setTimeout(() => {
      document.addEventListener('click', (e) => {
        if (!selector.contains(e.target as Node)) {
          selector.remove();
        }
      }, { once: true });
    }, 100);
  }

  private applyTemplate(template: ContentTemplate) {
    let content = template.content;
    
    // Replace variables with placeholders
    if (template.variables) {
      template.variables.forEach(variable => {
        const placeholder = `[${variable.toUpperCase()}]`;
        content = content.replace(new RegExp(`{{${variable}}}`, 'g'), placeholder);
      });
    }
    
    this.editor.setContent(content);
    this.editor.focus();
  }

  async generateContent(prompt: string): Promise<string> {
    // Simulate AI content generation
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(`Generated content based on: "${prompt}"\n\nThis is AI-generated content that would be created based on your prompt. In a real implementation, this would call your AI provider's API.`);
      }, 1000);
    });
  }

  addTemplate(template: ContentTemplate) {
    this.templates.push(template);
  }

  getTemplates(): ContentTemplate[] {
    return this.templates;
  }
}
