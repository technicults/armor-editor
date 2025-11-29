// Real-time Collaboration System
export interface CollaborationUser {
  id: string;
  name: string;
  color: string;
  cursor?: { line: number; column: number };
  selection?: { start: number; end: number };
}

export interface CollaborationOperation {
  type: 'insert' | 'delete' | 'retain';
  position: number;
  content?: string;
  length?: number;
  userId: string;
  timestamp: number;
}

export class RealtimeCollaboration {
  private editor: any;
  private socket: WebSocket | null = null;
  private channelId: string;
  private userId: string;
  private userName: string;
  private users: Map<string, CollaborationUser> = new Map();
  private operationQueue: CollaborationOperation[] = [];
  private isConnected = false;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  constructor(editor: any, config: { channelId: string; userId: string; userName: string; serverUrl?: string }) {
    this.editor = editor;
    this.channelId = config.channelId;
    this.userId = config.userId;
    this.userName = config.userName;
    
    this.connect(config.serverUrl || 'ws://localhost:8080');
    this.setupEventListeners();
  }

  private connect(serverUrl: string) {
    try {
      this.socket = new WebSocket(`${serverUrl}/collaboration`);
      
      this.socket.onopen = () => {
        this.isConnected = true;
        this.reconnectAttempts = 0;
        this.joinChannel();
        console.log('Connected to collaboration server');
      };

      this.socket.onmessage = (event) => {
        const message = JSON.parse(event.data);
        this.handleMessage(message);
      };

      this.socket.onclose = () => {
        this.isConnected = false;
        this.attemptReconnect(serverUrl);
      };

      this.socket.onerror = (error) => {
        console.error('WebSocket error:', error);
      };
    } catch (error) {
      console.error('Failed to connect to collaboration server:', error);
      this.setupFallbackMode();
    }
  }

  private setupFallbackMode() {
    // Fallback to localStorage-based collaboration for demo
    console.log('Using localStorage fallback for collaboration');
    setInterval(() => {
      const stored = localStorage.getItem(`collaboration_${this.channelId}`);
      if (stored) {
        const data = JSON.parse(stored);
        if (data.userId !== this.userId) {
          this.handleRemoteOperation(data.operation);
        }
      }
    }, 1000);
  }

  private joinChannel() {
    if (this.socket && this.isConnected) {
      this.socket.send(JSON.stringify({
        type: 'join',
        channelId: this.channelId,
        user: {
          id: this.userId,
          name: this.userName,
          color: this.generateUserColor()
        }
      }));
    }
  }

  private handleMessage(message: any) {
    switch (message.type) {
      case 'user_joined':
        this.addUser(message.user);
        break;
      case 'user_left':
        this.removeUser(message.userId);
        break;
      case 'operation':
        this.handleRemoteOperation(message.operation);
        break;
      case 'cursor_update':
        this.updateUserCursor(message.userId, message.cursor);
        break;
      case 'users_list':
        this.updateUsersList(message.users);
        break;
    }
  }

  private setupEventListeners() {
    let lastContent = this.editor.getContent();
    
    // Track content changes
    this.editor.editor.addEventListener('input', () => {
      const currentContent = this.editor.getContent();
      const operation = this.generateOperation(lastContent, currentContent);
      
      if (operation) {
        this.sendOperation(operation);
        lastContent = currentContent;
      }
    });

    // Track cursor movements
    this.editor.editor.addEventListener('selectionchange', () => {
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        this.sendCursorUpdate({
          start: range.startOffset,
          end: range.endOffset
        });
      }
    });
  }

  private generateOperation(oldContent: string, newContent: string): CollaborationOperation | null {
    // Simple diff algorithm
    let i = 0;
    while (i < Math.min(oldContent.length, newContent.length) && oldContent[i] === newContent[i]) {
      i++;
    }

    if (i === oldContent.length && i === newContent.length) {
      return null; // No change
    }

    if (newContent.length > oldContent.length) {
      // Insert operation
      return {
        type: 'insert',
        position: i,
        content: newContent.slice(i, i + (newContent.length - oldContent.length)),
        userId: this.userId,
        timestamp: Date.now()
      };
    } else if (newContent.length < oldContent.length) {
      // Delete operation
      return {
        type: 'delete',
        position: i,
        length: oldContent.length - newContent.length,
        userId: this.userId,
        timestamp: Date.now()
      };
    } else {
      // Replace operation (delete + insert)
      return {
        type: 'insert',
        position: i,
        content: newContent.slice(i),
        userId: this.userId,
        timestamp: Date.now()
      };
    }
  }

  private sendOperation(operation: CollaborationOperation) {
    if (this.socket && this.isConnected) {
      this.socket.send(JSON.stringify({
        type: 'operation',
        channelId: this.channelId,
        operation
      }));
    } else {
      // Fallback to localStorage
      localStorage.setItem(`collaboration_${this.channelId}`, JSON.stringify({
        userId: this.userId,
        operation,
        timestamp: Date.now()
      }));
    }
  }

  private handleRemoteOperation(operation: CollaborationOperation) {
    if (operation.userId === this.userId) return;

    // Apply operation to editor
    const currentContent = this.editor.getContent();
    let newContent = currentContent;

    switch (operation.type) {
      case 'insert':
        newContent = currentContent.slice(0, operation.position) + 
                   operation.content + 
                   currentContent.slice(operation.position);
        break;
      case 'delete':
        newContent = currentContent.slice(0, operation.position) + 
                   currentContent.slice(operation.position + (operation.length || 0));
        break;
    }

    // Temporarily disable change events to avoid loops
    const originalOnChange = this.editor.options.onChange;
    this.editor.options.onChange = null;
    
    this.editor.setContent(newContent);
    
    // Re-enable change events
    setTimeout(() => {
      this.editor.options.onChange = originalOnChange;
    }, 100);
  }

  private sendCursorUpdate(cursor: { start: number; end: number }) {
    if (this.socket && this.isConnected) {
      this.socket.send(JSON.stringify({
        type: 'cursor_update',
        channelId: this.channelId,
        userId: this.userId,
        cursor
      }));
    }
  }

  private addUser(user: CollaborationUser) {
    this.users.set(user.id, user);
    this.updateCollaboratorsUI();
  }

  private removeUser(userId: string) {
    this.users.delete(userId);
    this.updateCollaboratorsUI();
  }

  private updateUserCursor(userId: string, cursor: any) {
    const user = this.users.get(userId);
    if (user) {
      user.cursor = cursor;
      this.showUserCursor(user);
    }
  }

  private updateUsersList(users: CollaborationUser[]) {
    this.users.clear();
    users.forEach(user => this.users.set(user.id, user));
    this.updateCollaboratorsUI();
  }

  private generateUserColor(): string {
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8'];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  private updateCollaboratorsUI() {
    // Create or update collaborators panel
    let panel = this.editor.container.querySelector('.collaborators-panel');
    if (!panel) {
      panel = document.createElement('div');
      panel.className = 'collaborators-panel';
      panel.style.cssText = `
        position: absolute;
        top: 10px;
        right: 10px;
        background: white;
        border: 1px solid #ddd;
        border-radius: 8px;
        padding: 8px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        z-index: 1000;
      `;
      this.editor.container.appendChild(panel);
    }

    panel.innerHTML = `
      <div style="font-size: 12px; font-weight: bold; margin-bottom: 4px;">
        Online (${this.users.size + 1})
      </div>
      <div style="display: flex; gap: 4px;">
        <div style="width: 24px; height: 24px; border-radius: 50%; background: #007bff; display: flex; align-items: center; justify-content: center; color: white; font-size: 10px;" title="${this.userName}">
          ${this.userName.charAt(0).toUpperCase()}
        </div>
        ${Array.from(this.users.values()).map(user => `
          <div style="width: 24px; height: 24px; border-radius: 50%; background: ${user.color}; display: flex; align-items: center; justify-content: center; color: white; font-size: 10px;" title="${user.name}">
            ${user.name.charAt(0).toUpperCase()}
          </div>
        `).join('')}
      </div>
    `;
  }

  private showUserCursor(user: CollaborationUser) {
    // Remove existing cursor
    const existingCursor = this.editor.container.querySelector(`[data-user-cursor="${user.id}"]`);
    if (existingCursor) {
      existingCursor.remove();
    }

    if (!user.cursor) return;

    // Create cursor element
    const cursor = document.createElement('div');
    cursor.setAttribute('data-user-cursor', user.id);
    cursor.style.cssText = `
      position: absolute;
      width: 2px;
      height: 20px;
      background: ${user.color};
      pointer-events: none;
      z-index: 1000;
    `;

    // Position cursor using line and column
    cursor.style.left = `${user.cursor.column * 8}px`;
    cursor.style.top = `${user.cursor.line * 20}px`;

    this.editor.container.appendChild(cursor);

    // Remove cursor after 3 seconds of inactivity
    setTimeout(() => {
      const stillExists = this.editor.container.querySelector(`[data-user-cursor="${user.id}"]`);
      if (stillExists) {
        stillExists.remove();
      }
    }, 3000);
  }

  private attemptReconnect(serverUrl: string) {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`Attempting to reconnect... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
      
      setTimeout(() => {
        this.connect(serverUrl);
      }, Math.pow(2, this.reconnectAttempts) * 1000); // Exponential backoff
    } else {
      console.log('Max reconnection attempts reached. Using fallback mode.');
      this.setupFallbackMode();
    }
  }

  public disconnect() {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
    this.isConnected = false;
  }

  public getConnectedUsers(): CollaborationUser[] {
    return Array.from(this.users.values());
  }

  public isUserOnline(userId: string): boolean {
    return this.users.has(userId);
  }
}
