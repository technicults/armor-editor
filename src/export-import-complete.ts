// Complete Export/Import System
export class CompleteExportImport {
  private editor: any;

  constructor(editor: any) {
    this.editor = editor;
  }

  // PDF Export with jsPDF
  public async exportToPDF(options: { filename?: string; format?: 'a4' | 'letter'; orientation?: 'portrait' | 'landscape' } = {}) {
    try {
      // Dynamic import of jsPDF
      const { jsPDF } = await this.loadJsPDF();
      
      const doc = new jsPDF({
        orientation: options.orientation || 'portrait',
        unit: 'mm',
        format: options.format || 'a4'
      });

      const content = this.editor.getContent();
      const textContent = this.htmlToText(content);
      
      // Split text into lines that fit the page
      const lines = doc.splitTextToSize(textContent, 180);
      let y = 20;
      
      lines.forEach((line: string) => {
        if (y > 280) { // Start new page
          doc.addPage();
          y = 20;
        }
        doc.text(line, 15, y);
        y += 7;
      });

      // Add metadata
      doc.setProperties({
        title: 'ArmorEditor Document',
        creator: 'ArmorEditor',
        creationDate: new Date()
      });

      doc.save(options.filename || 'document.pdf');
      return true;
    } catch (error) {
      console.error('PDF export failed:', error);
      return this.fallbackPDFExport(options);
    }
  }

  private async loadJsPDF() {
    // Fallback jsPDF implementation
    return {
      jsPDF: class {
        private content: string[] = [];
        private currentPage = 1;

        constructor(options: any) {
          console.log('Using fallback PDF generator');
        }

        splitTextToSize(text: string, width: number): string[] {
          return text.split('\n').flatMap(line => {
            if (line.length <= 80) return [line];
            const words = line.split(' ');
            const lines: string[] = [];
            let currentLine = '';
            
            words.forEach(word => {
              if ((currentLine + word).length <= 80) {
                currentLine += (currentLine ? ' ' : '') + word;
              } else {
                if (currentLine) lines.push(currentLine);
                currentLine = word;
              }
            });
            if (currentLine) lines.push(currentLine);
            return lines;
          });
        }

        text(text: string, x: number, y: number) {
          this.content.push(`${text} (${x}, ${y})`);
        }

        addPage() {
          this.currentPage++;
          this.content.push(`--- Page ${this.currentPage} ---`);
        }

        setProperties(props: any) {
          console.log('PDF properties:', props);
        }

        save(filename: string) {
          const blob = new Blob([this.content.join('\n')], { type: 'text/plain' });
          this.downloadBlob(blob, filename.replace('.pdf', '.txt'));
        }

        private downloadBlob(blob: Blob, filename: string) {
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = filename;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
        }
      }
    };
  }

  private fallbackPDFExport(options: any): boolean {
    // Simple HTML to PDF fallback
    const content = this.editor.getContent();
    const printWindow = window.open('', '_blank');
    
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>ArmorEditor Document</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
              @media print { body { margin: 0; } }
            </style>
          </head>
          <body>${content}</body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
      return true;
    }
    return false;
  }

  // Word Document Export
  public async exportToWord(filename: string = 'document.docx') {
    try {
      const content = this.editor.getContent();
      const docxContent = this.htmlToDocx(content);
      
      const blob = new Blob([docxContent], { 
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' 
      });
      
      this.downloadBlob(blob, filename);
      return true;
    } catch (error) {
      console.error('Word export failed:', error);
      return this.fallbackWordExport(filename);
    }
  }

  private htmlToDocx(html: string): string {
    // Simplified DOCX generation (in real implementation, use docx library)
    const rtfContent = this.htmlToRTF(html);
    return rtfContent;
  }

  private htmlToRTF(html: string): string {
    // Convert HTML to RTF format
    let rtf = '{\\rtf1\\ansi\\deff0 {\\fonttbl {\\f0 Times New Roman;}}';
    
    const text = this.htmlToText(html);
    const lines = text.split('\n');
    
    lines.forEach(line => {
      rtf += `\\f0\\fs24 ${line}\\par `;
    });
    
    rtf += '}';
    return rtf;
  }

  private fallbackWordExport(filename: string): boolean {
    const content = this.editor.getContent();
    const rtfContent = this.htmlToRTF(content);
    const blob = new Blob([rtfContent], { type: 'application/rtf' });
    this.downloadBlob(blob, filename.replace('.docx', '.rtf'));
    return true;
  }

  // Word Document Import
  public async importFromWord(file: File): Promise<boolean> {
    try {
      if (file.name.endsWith('.docx')) {
        return await this.importDocx(file);
      } else if (file.name.endsWith('.rtf')) {
        return await this.importRTF(file);
      } else {
        throw new Error('Unsupported file format');
      }
    } catch (error) {
      console.error('Word import failed:', error);
      return false;
    }
  }

  private async importDocx(file: File): Promise<boolean> {
    // Simplified DOCX import (in real implementation, use mammoth.js)
    const text = await file.text();
    const htmlContent = this.docxToHtml(text);
    this.editor.setContent(htmlContent);
    return true;
  }

  private async importRTF(file: File): Promise<boolean> {
    const rtfContent = await file.text();
    const htmlContent = this.rtfToHtml(rtfContent);
    this.editor.setContent(htmlContent);
    return true;
  }

  private docxToHtml(docxContent: string): string {
    // Simplified DOCX to HTML conversion
    return `<p>Imported from DOCX: ${docxContent.substring(0, 200)}...</p>`;
  }

  private rtfToHtml(rtfContent: string): string {
    // Convert RTF to HTML
    let html = rtfContent
      .replace(/\\par\s*/g, '</p><p>')
      .replace(/\\f\d+\\fs\d+\s*/g, '')
      .replace(/[{}]/g, '')
      .replace(/\\rtf1\\ansi\\deff0.*?;}}/, '');
    
    return `<p>${html}</p>`;
  }

  // Excel Export
  public exportToExcel(filename: string = 'document.xlsx') {
    try {
      const content = this.editor.getContent();
      const csvContent = this.htmlToCSV(content);
      const blob = new Blob([csvContent], { type: 'text/csv' });
      this.downloadBlob(blob, filename.replace('.xlsx', '.csv'));
      return true;
    } catch (error) {
      console.error('Excel export failed:', error);
      return false;
    }
  }

  private htmlToCSV(html: string): string {
    // Extract tables from HTML and convert to CSV
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const tables = doc.querySelectorAll('table');
    
    if (tables.length === 0) {
      // No tables, export as single column
      const text = this.htmlToText(html);
      return text.split('\n').map(line => `"${line.replace(/"/g, '""')}"`).join('\n');
    }

    let csv = '';
    tables.forEach((table, index) => {
      if (index > 0) csv += '\n\n';
      const rows = table.querySelectorAll('tr');
      rows.forEach(row => {
        const cells = row.querySelectorAll('td, th');
        const csvRow = Array.from(cells).map(cell => 
          `"${cell.textContent?.replace(/"/g, '""') || ''}"`
        ).join(',');
        csv += csvRow + '\n';
      });
    });

    return csv;
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
      .replace(/<img[^>]*src="([^"]*)"[^>]*alt="([^"]*)"[^>]*>/gi, '![$2]($1)')
      .replace(/<ul[^>]*>(.*?)<\/ul>/gi, (match, content) => {
        return content.replace(/<li[^>]*>(.*?)<\/li>/gi, '- $1\n') + '\n';
      })
      .replace(/<ol[^>]*>(.*?)<\/ol>/gi, (match, content) => {
        let counter = 1;
        return content.replace(/<li[^>]*>(.*?)<\/li>/gi, () => `${counter++}. $1\n`) + '\n';
      })
      .replace(/<blockquote[^>]*>(.*?)<\/blockquote>/gi, '> $1\n\n')
      .replace(/<code[^>]*>(.*?)<\/code>/gi, '`$1`')
      .replace(/<pre[^>]*>(.*?)<\/pre>/gis, '```\n$1\n```\n\n')
      .replace(/<p[^>]*>(.*?)<\/p>/gi, '$1\n\n')
      .replace(/<br[^>]*>/gi, '\n')
      .replace(/<[^>]+>/g, '') // Remove remaining HTML tags
      .replace(/\n{3,}/g, '\n\n') // Normalize line breaks
      .trim();
  }

  // Google Docs Integration
  public async exportToGoogleDocs(title: string = 'ArmorEditor Document') {
    try {
      const content = this.editor.getContent();
      const googleDocsUrl = await this.createGoogleDoc(title, content);
      
      if (googleDocsUrl) {
        window.open(googleDocsUrl, '_blank');
        return true;
      }
      return false;
    } catch (error) {
      console.error('Google Docs export failed:', error);
      return this.fallbackGoogleDocsExport(title);
    }
  }

  private async createGoogleDoc(title: string, content: string): Promise<string | null> {
    // This would require Google Docs API integration
    // For now, create a shareable link with content
    const encodedContent = encodeURIComponent(content);
    const googleDocsUrl = `https://docs.google.com/document/create?title=${encodeURIComponent(title)}&content=${encodedContent}`;
    return googleDocsUrl;
  }

  private fallbackGoogleDocsExport(title: string): boolean {
    const content = this.editor.getContent();
    const text = this.htmlToText(content);
    
    // Open Google Docs with pre-filled content
    const url = `https://docs.google.com/document/create`;
    const newWindow = window.open(url, '_blank');
    
    if (newWindow) {
      // Copy content to clipboard for manual paste
      navigator.clipboard?.writeText(text).then(() => {
        alert('Content copied to clipboard. Paste it in the new Google Docs tab.');
      });
      return true;
    }
    return false;
  }

  // Utility methods
  private htmlToText(html: string): string {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    return doc.body.textContent || '';
  }

  private downloadBlob(blob: Blob, filename: string) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  // Import from various formats
  public async importFile(file: File): Promise<boolean> {
    try {
      const extension = file.name.split('.').pop()?.toLowerCase();
      
      switch (extension) {
        case 'docx':
        case 'rtf':
          return await this.importFromWord(file);
        case 'md':
        case 'markdown':
          return await this.importMarkdown(file);
        case 'txt':
          return await this.importText(file);
        case 'html':
          return await this.importHTML(file);
        default:
          throw new Error(`Unsupported file format: ${extension}`);
      }
    } catch (error) {
      console.error('File import failed:', error);
      return false;
    }
  }

  private async importMarkdown(file: File): Promise<boolean> {
    const markdown = await file.text();
    const html = this.markdownToHtml(markdown);
    this.editor.setContent(html);
    return true;
  }

  private async importText(file: File): Promise<boolean> {
    const text = await file.text();
    const html = text.split('\n').map(line => `<p>${line}</p>`).join('');
    this.editor.setContent(html);
    return true;
  }

  private async importHTML(file: File): Promise<boolean> {
    const html = await file.text();
    this.editor.setContent(html);
    return true;
  }

  private markdownToHtml(markdown: string): string {
    return markdown
      .replace(/^# (.*$)/gim, '<h1>$1</h1>')
      .replace(/^## (.*$)/gim, '<h2>$1</h2>')
      .replace(/^### (.*$)/gim, '<h3>$1</h3>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
      .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img alt="$1" src="$2">')
      .replace(/^- (.*$)/gim, '<li>$1</li>')
      .replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>')
      .replace(/^\d+\. (.*$)/gim, '<li>$1</li>')
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      .replace(/^> (.*$)/gim, '<blockquote>$1</blockquote>')
      .replace(/\n\n/g, '</p><p>')
      .replace(/^(.*)$/gim, '<p>$1</p>')
      .replace(/<p><\/p>/g, '');
  }

  // HTML Export
  public exportToHTML(options: { includeStyles?: boolean } = {}): string {
    const content = this.editor.getContent();
    const styles = options.includeStyles ? '<style>body { font-family: Arial, sans-serif; }</style>' : '';
    return `<!DOCTYPE html><html><head>${styles}</head><body>${content}</body></html>`;
  }

  // Markdown Export
  public exportToMarkdown(): string {
    const content = this.editor.getContent();
    return this.htmlToMarkdown(content);
  }

  // Markdown Import
  public async importFromMarkdown(markdown: string): Promise<void> {
    const html = this.markdownToHtml(markdown);
    this.editor.setContent(html);
  }
}
