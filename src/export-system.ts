// Enhanced Export System
export interface ExportOptions {
  format: 'pdf' | 'docx' | 'markdown' | 'html' | 'csv';
  styling?: boolean;
  metadata?: {
    title?: string;
    author?: string;
    subject?: string;
  };
  pageSettings?: {
    size?: 'A4' | 'Letter' | 'Legal';
    orientation?: 'portrait' | 'landscape';
    margins?: { top: number; right: number; bottom: number; left: number; };
  };
}

export class ExportSystem {
  private editor: any;

  constructor(editor: any) {
    this.editor = editor;
  }

  async exportToPDF(options: ExportOptions = { format: 'pdf' }): Promise<Blob> {
    const content = this.editor.getContent();
    const styledContent = this.addPDFStyling(content);
    
    // Create PDF using browser's print functionality
    const printWindow = window.open('', '_blank');
    if (!printWindow) throw new Error('Popup blocked');

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>${options.metadata?.title || 'Document'}</title>
        <style>
          @page {
            size: ${options.pageSettings?.size || 'A4'};
            margin: ${this.formatMargins(options.pageSettings?.margins)};
          }
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: none;
          }
          h1, h2, h3, h4, h5, h6 { color: #2c3e50; margin-top: 1.5em; }
          blockquote { 
            border-left: 4px solid #3498db; 
            padding-left: 1em; 
            margin: 1em 0; 
            background: #f8f9fa; 
          }
          table { border-collapse: collapse; width: 100%; margin: 1em 0; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #f2f2f2; }
          code { background: #f4f4f4; padding: 2px 4px; border-radius: 3px; }
          pre { background: #f4f4f4; padding: 1em; border-radius: 5px; overflow-x: auto; }
        </style>
      </head>
      <body>${styledContent}</body>
      </html>
    `);

    printWindow.document.close();
    
    return new Promise((resolve) => {
      printWindow.onload = () => {
        setTimeout(() => {
          printWindow.print();
          printWindow.close();
          resolve(new Blob(['PDF generated'], { type: 'application/pdf' }));
        }, 500);
      };
    });
  }

  exportToMarkdown(): string {
    const content = this.editor.getContent();
    return this.htmlToMarkdown(content);
  }

  exportToHTML(options: ExportOptions = { format: 'html' }): string {
    const content = this.editor.getContent();
    
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${options.metadata?.title || 'Document'}</title>
  <style>
    body { 
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      line-height: 1.6; 
      max-width: 800px; 
      margin: 0 auto; 
      padding: 2rem;
      color: #333;
    }
    h1, h2, h3 { color: #2c3e50; }
    blockquote { 
      border-left: 4px solid #3498db; 
      padding-left: 1rem; 
      margin: 1rem 0; 
      background: #f8f9fa; 
    }
    table { border-collapse: collapse; width: 100%; }
    th, td { border: 1px solid #ddd; padding: 8px; }
    th { background: #f2f2f2; }
  </style>
</head>
<body>
  ${content}
</body>
</html>`;
  }

  async importFromMarkdown(markdown: string): Promise<void> {
    const html = this.markdownToHTML(markdown);
    this.editor.setContent(html);
  }

  async importFromHTML(html: string): Promise<void> {
    // Extract body content if full HTML document
    const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
    const content = bodyMatch ? bodyMatch[1] : html;
    this.editor.setContent(content);
  }

  private addPDFStyling(content: string): string {
    // Add page breaks and PDF-specific styling
    return content
      .replace(/<h1/g, '<h1 style="page-break-before: always; margin-top: 0;"')
      .replace(/<img/g, '<img style="max-width: 100%; height: auto;"')
      .replace(/<table/g, '<table style="page-break-inside: avoid;"');
  }

  private formatMargins(margins?: { top: number; right: number; bottom: number; left: number; }): string {
    if (!margins) return '2cm';
    return `${margins.top}mm ${margins.right}mm ${margins.bottom}mm ${margins.left}mm`;
  }

  private htmlToMarkdown(html: string): string {
    return html
      .replace(/<h1[^>]*>(.*?)<\/h1>/gi, '# $1\n\n')
      .replace(/<h2[^>]*>(.*?)<\/h2>/gi, '## $1\n\n')
      .replace(/<h3[^>]*>(.*?)<\/h3>/gi, '### $1\n\n')
      .replace(/<strong[^>]*>(.*?)<\/strong>/gi, '**$1**')
      .replace(/<b[^>]*>(.*?)<\/b>/gi, '**$1**')
      .replace(/<em[^>]*>(.*?)<\/em>/gi, '*$1*')
      .replace(/<i[^>]*>(.*?)<\/i>/gi, '*$1*')
      .replace(/<a[^>]*href="([^"]*)"[^>]*>(.*?)<\/a>/gi, '[$2]($1)')
      .replace(/<ul[^>]*>(.*?)<\/ul>/gis, (match, content) => {
        return content.replace(/<li[^>]*>(.*?)<\/li>/gi, '- $1\n') + '\n';
      })
      .replace(/<ol[^>]*>(.*?)<\/ol>/gis, (match, content) => {
        let counter = 1;
        return content.replace(/<li[^>]*>(.*?)<\/li>/gi, () => `${counter++}. $1\n`) + '\n';
      })
      .replace(/<blockquote[^>]*>(.*?)<\/blockquote>/gis, '> $1\n\n')
      .replace(/<code[^>]*>(.*?)<\/code>/gi, '`$1`')
      .replace(/<pre[^>]*>(.*?)<\/pre>/gis, '```\n$1\n```\n\n')
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<p[^>]*>(.*?)<\/p>/gi, '$1\n\n')
      .replace(/<[^>]+>/g, '')
      .replace(/\n{3,}/g, '\n\n')
      .trim();
  }

  private markdownToHTML(markdown: string): string {
    return markdown
      .replace(/^# (.*$)/gim, '<h1>$1</h1>')
      .replace(/^## (.*$)/gim, '<h2>$1</h2>')
      .replace(/^### (.*$)/gim, '<h3>$1</h3>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
      .replace(/^- (.*$)/gim, '<li>$1</li>')
      .replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>')
      .replace(/^> (.*$)/gim, '<blockquote>$1</blockquote>')
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      .replace(/```\n([\s\S]*?)\n```/g, '<pre>$1</pre>')
      .replace(/\n/g, '<br>')
      .replace(/(<h[1-6]>.*<\/h[1-6]>)<br>/g, '$1')
      .replace(/(<\/blockquote>)<br>/g, '$1')
      .replace(/(<\/ul>)<br>/g, '$1')
      .replace(/(<\/pre>)<br>/g, '$1');
  }
}
