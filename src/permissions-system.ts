// Advanced Permissions System
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

export interface UserRole {
  id: string;
  name: string;
  permissions: Permission[];
}

export interface Permission {
  action: PermissionAction;
  resource: PermissionResource;
  conditions?: PermissionCondition[];
}

export type PermissionAction = 
  | 'read' | 'write' | 'delete' | 'share' | 'export' 
  | 'comment' | 'suggest' | 'approve' | 'admin';

export type PermissionResource = 
  | 'document' | 'comments' | 'suggestions' | 'settings' 
  | 'users' | 'analytics' | 'templates';

export interface PermissionCondition {
  field: string;
  operator: 'equals' | 'contains' | 'startsWith' | 'endsWith';
  value: any;
}

export class PermissionsSystem {
  private currentUser: User | null = null;
  private documentPermissions: Map<string, Permission[]> = new Map();
  private roles: Map<string, UserRole> = new Map();
  private editor: any;

  constructor(editor: any) {
    this.editor = editor;
    this.initializeDefaultRoles();
  }

  private initializeDefaultRoles() {
    // Owner role
    this.roles.set('owner', {
      id: 'owner',
      name: 'Owner',
      permissions: [
        { action: 'read', resource: 'document' },
        { action: 'write', resource: 'document' },
        { action: 'delete', resource: 'document' },
        { action: 'share', resource: 'document' },
        { action: 'export', resource: 'document' },
        { action: 'admin', resource: 'settings' },
        { action: 'admin', resource: 'users' }
      ]
    });

    // Editor role
    this.roles.set('editor', {
      id: 'editor',
      name: 'Editor',
      permissions: [
        { action: 'read', resource: 'document' },
        { action: 'write', resource: 'document' },
        { action: 'comment', resource: 'comments' },
        { action: 'suggest', resource: 'suggestions' },
        { action: 'export', resource: 'document' }
      ]
    });

    // Commenter role
    this.roles.set('commenter', {
      id: 'commenter',
      name: 'Commenter',
      permissions: [
        { action: 'read', resource: 'document' },
        { action: 'comment', resource: 'comments' }
      ]
    });

    // Viewer role
    this.roles.set('viewer', {
      id: 'viewer',
      name: 'Viewer',
      permissions: [
        { action: 'read', resource: 'document' }
      ]
    });
  }

  setCurrentUser(user: User) {
    this.currentUser = user;
    this.applyPermissions();
  }

  hasPermission(action: PermissionAction, resource: PermissionResource): boolean {
    if (!this.currentUser) return false;

    const userPermissions = this.currentUser.role.permissions;
    return userPermissions.some(permission => 
      permission.action === action && permission.resource === resource
    );
  }

  canEdit(): boolean {
    return this.hasPermission('write', 'document');
  }

  canComment(): boolean {
    return this.hasPermission('comment', 'comments');
  }

  canShare(): boolean {
    return this.hasPermission('share', 'document');
  }

  canExport(): boolean {
    return this.hasPermission('export', 'document');
  }

  canDelete(): boolean {
    return this.hasPermission('delete', 'document');
  }

  private applyPermissions() {
    if (!this.currentUser) return;

    // Apply read-only mode if user can't edit
    if (!this.canEdit()) {
      this.editor.setReadOnly(true);
    }

    // Hide/show toolbar buttons based on permissions
    this.updateToolbarVisibility();
    
    // Apply content restrictions
    this.applyContentRestrictions();
  }

  private updateToolbarVisibility() {
    const toolbar = this.editor.toolbar;
    if (!toolbar) return;

    // Hide editing tools if no write permission
    if (!this.canEdit()) {
      const editingButtons = toolbar.querySelectorAll('[data-action="bold"], [data-action="italic"], [data-action="underline"]');
      editingButtons.forEach((btn: HTMLElement) => {
        btn.style.display = 'none';
      });
    }

    // Hide export button if no export permission
    if (!this.canExport()) {
      const exportButton = toolbar.querySelector('[data-action="export"]');
      if (exportButton) {
        (exportButton as HTMLElement).style.display = 'none';
      }
    }
  }

  private applyContentRestrictions() {
    if (!this.canEdit()) {
      // Disable all editing functionality
      this.editor.editor.contentEditable = 'false';
      
      // Add visual indicator
      const indicator = document.createElement('div');
      indicator.style.cssText = `
        position: absolute;
        top: 10px;
        right: 10px;
        background: #ffc107;
        color: #000;
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 12px;
        z-index: 1000;
      `;
      indicator.textContent = `${this.currentUser?.role.name} - Read Only`;
      this.editor.container.style.position = 'relative';
      this.editor.container.appendChild(indicator);
    }
  }

  shareDocument(userEmail: string, roleId: string): Promise<boolean> {
    return new Promise((resolve) => {
      // Simulate API call
      setTimeout(() => {
        console.log(`Shared document with ${userEmail} as ${roleId}`);
        resolve(true);
      }, 500);
    });
  }

  revokeAccess(userId: string): Promise<boolean> {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(`Revoked access for user ${userId}`);
        resolve(true);
      }, 500);
    });
  }

  getAvailableRoles(): UserRole[] {
    return Array.from(this.roles.values());
  }

  createCustomRole(role: UserRole): void {
    this.roles.set(role.id, role);
  }

  // Audit logging
  logAction(action: string, details: any = {}) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      userId: this.currentUser?.id,
      userName: this.currentUser?.name,
      action,
      details,
      documentId: this.editor.options.documentId || 'unknown'
    };

    // In real implementation, send to audit service
    console.log('Audit Log:', logEntry);
    
    // Store locally for demo
    const logs = JSON.parse(localStorage.getItem('armorEditorAuditLogs') || '[]');
    logs.push(logEntry);
    localStorage.setItem('armorEditorAuditLogs', JSON.stringify(logs.slice(-100))); // Keep last 100
  }

  getAuditLogs(): any[] {
    return JSON.parse(localStorage.getItem('armorEditorAuditLogs') || '[]');
  }
}
