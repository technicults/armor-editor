// Document Versioning System
export interface DocumentVersion {
  id: string;
  version: string;
  content: string;
  author: {
    id: string;
    name: string;
    email: string;
  };
  timestamp: Date;
  message: string;
  changes: ChangeSet[];
  parentVersion?: string;
  tags?: string[];
}

export interface ChangeSet {
  type: 'insert' | 'delete' | 'modify';
  position: number;
  length: number;
  oldContent?: string;
  newContent?: string;
}

export class VersionSystem {
  private versions: Map<string, DocumentVersion> = new Map();
  private currentVersion: string | null = null;
  private editor: any;
  private autoSaveEnabled = true;

  constructor(editor: any) {
    this.editor = editor;
    this.setupAutoVersioning();
  }

  private setupAutoVersioning() {
    let lastContent = this.editor.getContent();
    let changeTimer: number;

    this.editor.editor.addEventListener('input', () => {
      clearTimeout(changeTimer);
      changeTimer = setTimeout(() => {
        const currentContent = this.editor.getContent();
        if (currentContent !== lastContent && this.autoSaveEnabled) {
          this.createAutoVersion(lastContent, currentContent);
          lastContent = currentContent;
        }
      }, 5000) as any; // Auto-version every 5 seconds of inactivity
    });
  }

  createVersion(message: string, author: any): DocumentVersion {
    const content = this.editor.getContent();
    const version: DocumentVersion = {
      id: this.generateVersionId(),
      version: this.generateVersionNumber(),
      content,
      author,
      timestamp: new Date(),
      message,
      changes: this.calculateChanges(),
      parentVersion: this.currentVersion || undefined,
      tags: []
    };

    this.versions.set(version.id, version);
    this.currentVersion = version.id;
    
    // Log the version creation
    console.log('Version created:', version.version, message);
    
    return version;
  }

  private createAutoVersion(oldContent: string, newContent: string): DocumentVersion {
    const changes = this.diffContent(oldContent, newContent);
    if (changes.length === 0) return this.getCurrentVersion()!;

    const version: DocumentVersion = {
      id: this.generateVersionId(),
      version: this.generateVersionNumber(),
      content: newContent,
      author: {
        id: 'auto',
        name: 'Auto-save',
        email: 'system@armoreditor.com'
      },
      timestamp: new Date(),
      message: 'Auto-saved version',
      changes,
      parentVersion: this.currentVersion || undefined,
      tags: ['auto-save']
    };

    this.versions.set(version.id, version);
    this.currentVersion = version.id;
    
    return version;
  }

  restoreVersion(versionId: string): boolean {
    const version = this.versions.get(versionId);
    if (!version) return false;

    this.editor.setContent(version.content);
    this.currentVersion = versionId;
    
    console.log('Restored to version:', version.version);
    return true;
  }

  compareVersions(versionId1: string, versionId2: string): ChangeSet[] {
    const version1 = this.versions.get(versionId1);
    const version2 = this.versions.get(versionId2);
    
    if (!version1 || !version2) return [];
    
    return this.diffContent(version1.content, version2.content);
  }

  getVersionHistory(): DocumentVersion[] {
    return Array.from(this.versions.values())
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  getCurrentVersion(): DocumentVersion | null {
    return this.currentVersion ? this.versions.get(this.currentVersion) || null : null;
  }

  tagVersion(versionId: string, tag: string): boolean {
    const version = this.versions.get(versionId);
    if (!version) return false;

    if (!version.tags) version.tags = [];
    if (!version.tags.includes(tag)) {
      version.tags.push(tag);
    }
    
    return true;
  }

  branchFromVersion(versionId: string, branchName: string): string {
    const sourceVersion = this.versions.get(versionId);
    if (!sourceVersion) throw new Error('Source version not found');

    const branchVersion: DocumentVersion = {
      ...sourceVersion,
      id: this.generateVersionId(),
      version: `${branchName}-1.0.0`,
      timestamp: new Date(),
      message: `Branched from ${sourceVersion.version}`,
      parentVersion: versionId,
      tags: ['branch', branchName]
    };

    this.versions.set(branchVersion.id, branchVersion);
    return branchVersion.id;
  }

  private diffContent(oldContent: string, newContent: string): ChangeSet[] {
    const changes: ChangeSet[] = [];
    
    // Simple diff algorithm (in production, use a proper diff library)
    if (oldContent.length !== newContent.length) {
      changes.push({
        type: 'modify',
        position: 0,
        length: Math.max(oldContent.length, newContent.length),
        oldContent: oldContent.substring(0, 100) + '...',
        newContent: newContent.substring(0, 100) + '...'
      });
    }
    
    return changes;
  }

  private calculateChanges(): ChangeSet[] {
    // Calculate changes from previous version
    const currentVersion = this.getCurrentVersion();
    if (!currentVersion) return [];
    
    const currentContent = this.editor.getContent();
    return this.diffContent(currentVersion.content, currentContent);
  }

  private generateVersionId(): string {
    return `v_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateVersionNumber(): string {
    const versions = this.getVersionHistory();
    const majorVersion = Math.floor(versions.length / 10) + 1;
    const minorVersion = versions.length % 10;
    return `${majorVersion}.${minorVersion}.0`;
  }

  // Export version history
  exportVersionHistory(): string {
    const history = this.getVersionHistory();
    return JSON.stringify(history, null, 2);
  }

  // Import version history
  importVersionHistory(historyJson: string): boolean {
    try {
      const history: DocumentVersion[] = JSON.parse(historyJson);
      history.forEach(version => {
        version.timestamp = new Date(version.timestamp);
        this.versions.set(version.id, version);
      });
      return true;
    } catch (error) {
      console.error('Failed to import version history:', error);
      return false;
    }
  }

  // Version comparison UI
  showVersionComparison(versionId1: string, versionId2: string) {
    const version1 = this.versions.get(versionId1);
    const version2 = this.versions.get(versionId2);
    
    if (!version1 || !version2) return;

    const comparisonWindow = window.open('', '_blank', 'width=1200,height=800');
    if (!comparisonWindow) return;

    comparisonWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Version Comparison</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 20px; }
          .comparison { display: flex; gap: 20px; }
          .version { flex: 1; border: 1px solid #ddd; padding: 15px; border-radius: 8px; }
          .version h3 { margin-top: 0; color: #333; }
          .meta { background: #f8f9fa; padding: 10px; border-radius: 4px; margin-bottom: 15px; font-size: 14px; }
          .content { max-height: 600px; overflow-y: auto; border: 1px solid #eee; padding: 15px; }
          .added { background-color: #d4edda; }
          .removed { background-color: #f8d7da; }
        </style>
      </head>
      <body>
        <h1>Version Comparison</h1>
        <div class="comparison">
          <div class="version">
            <h3>Version ${version1.version}</h3>
            <div class="meta">
              <strong>Author:</strong> ${version1.author.name}<br>
              <strong>Date:</strong> ${version1.timestamp.toLocaleString()}<br>
              <strong>Message:</strong> ${version1.message}
            </div>
            <div class="content">${version1.content}</div>
          </div>
          <div class="version">
            <h3>Version ${version2.version}</h3>
            <div class="meta">
              <strong>Author:</strong> ${version2.author.name}<br>
              <strong>Date:</strong> ${version2.timestamp.toLocaleString()}<br>
              <strong>Message:</strong> ${version2.message}
            </div>
            <div class="content">${version2.content}</div>
          </div>
        </div>
      </body>
      </html>
    `);
    
    comparisonWindow.document.close();
  }
}
