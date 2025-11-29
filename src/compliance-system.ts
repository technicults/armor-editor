// GDPR/HIPAA Compliance System
export interface ComplianceConfig {
  gdpr: {
    enabled: boolean;
    dataRetentionDays: number;
    consentRequired: boolean;
    rightToErasure: boolean;
  };
  hipaa: {
    enabled: boolean;
    auditLogging: boolean;
    encryptionRequired: boolean;
    accessControls: boolean;
  };
}

export interface DataProcessingRecord {
  id: string;
  userId: string;
  action: string;
  dataType: string;
  timestamp: Date;
  legalBasis?: string;
  consentId?: string;
}

export class ComplianceSystem {
  private config: ComplianceConfig;
  private processingRecords: DataProcessingRecord[] = [];
  private consentRecords: Map<string, any> = new Map();

  constructor(config: ComplianceConfig) {
    this.config = config;
    this.initializeCompliance();
  }

  private initializeCompliance() {
    if (this.config.gdpr.enabled) {
      this.setupGDPRCompliance();
    }
    
    if (this.config.hipaa.enabled) {
      this.setupHIPAACompliance();
    }
  }

  private setupGDPRCompliance() {
    // Show consent banner if required
    if (this.config.gdpr.consentRequired) {
      this.showConsentBanner();
    }
    
    // Setup data retention cleanup
    this.setupDataRetention();
    
    // Add GDPR controls to editor
    this.addGDPRControls();
  }

  private setupHIPAACompliance() {
    // Enable audit logging
    if (this.config.hipaa.auditLogging) {
      this.enableAuditLogging();
    }
    
    // Enforce encryption
    if (this.config.hipaa.encryptionRequired) {
      this.enforceEncryption();
    }
    
    // Setup access controls
    if (this.config.hipaa.accessControls) {
      this.setupAccessControls();
    }
  }

  private showConsentBanner() {
    const banner = document.createElement('div');
    banner.className = 'gdpr-consent-banner';
    banner.innerHTML = `
      <div class="consent-content">
        <p>We use cookies and process personal data to improve your experience. 
           By using our editor, you consent to data processing as described in our Privacy Policy.</p>
        <div class="consent-buttons">
          <button id="accept-all">Accept All</button>
          <button id="manage-preferences">Manage Preferences</button>
          <button id="reject-all">Reject All</button>
        </div>
      </div>
    `;

    document.body.appendChild(banner);
    this.setupConsentHandlers(banner);
  }

  private setupConsentHandlers(banner: HTMLElement) {
    banner.querySelector('#accept-all')?.addEventListener('click', () => {
      this.recordConsent('all', true);
      banner.remove();
    });

    banner.querySelector('#reject-all')?.addEventListener('click', () => {
      this.recordConsent('all', false);
      banner.remove();
    });

    banner.querySelector('#manage-preferences')?.addEventListener('click', () => {
      this.showPreferencesModal();
    });
  }

  private showPreferencesModal() {
    const modal = document.createElement('div');
    modal.className = 'preferences-modal';
    modal.innerHTML = `
      <div class="modal-content">
        <h3>Privacy Preferences</h3>
        <div class="preference-item">
          <label>
            <input type="checkbox" id="essential" checked disabled>
            Essential Cookies (Required)
          </label>
        </div>
        <div class="preference-item">
          <label>
            <input type="checkbox" id="analytics">
            Analytics Cookies
          </label>
        </div>
        <div class="preference-item">
          <label>
            <input type="checkbox" id="marketing">
            Marketing Cookies
          </label>
        </div>
        <div class="modal-buttons">
          <button id="save-preferences">Save Preferences</button>
          <button id="cancel-preferences">Cancel</button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);
    this.setupPreferencesHandlers(modal);
  }

  private setupPreferencesHandlers(modal: HTMLElement) {
    modal.querySelector('#save-preferences')?.addEventListener('click', () => {
      const analytics = (modal.querySelector('#analytics') as HTMLInputElement)?.checked;
      const marketing = (modal.querySelector('#marketing') as HTMLInputElement)?.checked;
      
      this.recordConsent('analytics', analytics);
      this.recordConsent('marketing', marketing);
      
      modal.remove();
      document.querySelector('.gdpr-consent-banner')?.remove();
    });

    modal.querySelector('#cancel-preferences')?.addEventListener('click', () => {
      modal.remove();
    });
  }

  private recordConsent(type: string, granted: boolean) {
    const consentRecord = {
      id: Date.now().toString(),
      type,
      granted,
      timestamp: new Date(),
      ipAddress: 'masked', // IP should be masked for privacy
      userAgent: navigator.userAgent
    };

    this.consentRecords.set(consentRecord.id, consentRecord);
    localStorage.setItem('gdpr_consent', JSON.stringify(Array.from(this.consentRecords.entries())));
  }

  private setupDataRetention() {
    // Schedule data cleanup based on retention period
    setInterval(() => {
      this.cleanupExpiredData();
    }, 24 * 60 * 60 * 1000); // Daily cleanup
  }

  private cleanupExpiredData() {
    const retentionPeriod = this.config.gdpr.dataRetentionDays * 24 * 60 * 60 * 1000;
    const cutoffDate = new Date(Date.now() - retentionPeriod);

    // Clean up processing records
    this.processingRecords = this.processingRecords.filter(
      record => record.timestamp > cutoffDate
    );

    // Clean up consent records
    const entriesToDelete: string[] = [];
    this.consentRecords.forEach((record, id) => {
      if (record.timestamp < cutoffDate) {
        entriesToDelete.push(id);
      }
    });
    entriesToDelete.forEach(id => this.consentRecords.delete(id));
  }

  private addGDPRControls() {
    // Add data export button
    const exportBtn = document.createElement('button');
    exportBtn.innerHTML = '📥';
    exportBtn.title = 'Export My Data (GDPR)';
    exportBtn.onclick = () => this.exportUserData();
    
    // Add data deletion button
    const deleteBtn = document.createElement('button');
    deleteBtn.innerHTML = '🗑️';
    deleteBtn.title = 'Delete My Data (GDPR)';
    deleteBtn.onclick = () => this.requestDataDeletion();
    
    // Add to a GDPR controls container
    const controlsContainer = document.createElement('div');
    controlsContainer.className = 'gdpr-controls';
    controlsContainer.appendChild(exportBtn);
    controlsContainer.appendChild(deleteBtn);
    
    document.body.appendChild(controlsContainer);
  }

  private enableAuditLogging() {
    // Log all user actions for HIPAA compliance
    document.addEventListener('click', (e) => {
      this.logAction('click', e.target);
    });

    document.addEventListener('input', (e) => {
      this.logAction('input', e.target);
    });
  }

  private logAction(action: string, target: any) {
    const record: DataProcessingRecord = {
      id: Date.now().toString(),
      userId: 'current-user', // Should be actual user ID
      action,
      dataType: target?.tagName || 'unknown',
      timestamp: new Date(),
      legalBasis: this.config.hipaa.enabled ? 'healthcare_provision' : 'legitimate_interest'
    };

    this.processingRecords.push(record);
    
    // Send to secure audit log
    this.sendToAuditLog(record);
  }

  private async sendToAuditLog(record: DataProcessingRecord) {
    try {
      await fetch('/api/audit-log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(record)
      });
    } catch (error) {
      console.error('Failed to send audit log:', error);
    }
  }

  private enforceEncryption() {
    // Ensure all data is encrypted before storage
    const originalSetItem = localStorage.setItem;
    localStorage.setItem = function(key: string, value: string) {
      // Encrypt value before storing
      const encrypted = btoa(value); // Simple encoding, use proper encryption in production
      originalSetItem.call(this, key, encrypted);
    };
  }

  private setupAccessControls() {
    // Implement role-based access controls
    const userRole = this.getCurrentUserRole();
    
    if (userRole !== 'admin' && userRole !== 'healthcare_provider') {
      // Restrict access to sensitive features
      this.restrictSensitiveFeatures();
    }
  }

  private getCurrentUserRole(): string {
    // Get user role from authentication system
    return localStorage.getItem('user_role') || 'user';
  }

  private restrictSensitiveFeatures() {
    // Hide or disable features based on user role
    const sensitiveButtons = document.querySelectorAll('[data-sensitive="true"]');
    sensitiveButtons.forEach(btn => {
      (btn as HTMLElement).style.display = 'none';
    });
  }

  async exportUserData(): Promise<void> {
    const userData = {
      processingRecords: this.processingRecords,
      consentRecords: Array.from(this.consentRecords.entries()),
      editorContent: localStorage.getItem('editor_content'),
      preferences: localStorage.getItem('user_preferences')
    };

    const dataBlob = new Blob([JSON.stringify(userData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = 'my-data-export.json';
    link.click();
    
    URL.revokeObjectURL(url);
  }

  async requestDataDeletion(): Promise<void> {
    if (confirm('Are you sure you want to delete all your data? This action cannot be undone.')) {
      // Clear local data
      localStorage.clear();
      sessionStorage.clear();
      
      // Request server-side deletion
      try {
        await fetch('/api/delete-user-data', {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${localStorage.getItem('auth_token')}` }
        });
        
        alert('Your data has been scheduled for deletion.');
      } catch (error) {
        console.error('Failed to request data deletion:', error);
        alert('Failed to process deletion request. Please contact support.');
      }
    }
  }

  getProcessingRecords(): DataProcessingRecord[] {
    return [...this.processingRecords];
  }

  getConsentStatus(): Record<string, boolean> {
    const status: Record<string, boolean> = {};
    
    this.consentRecords.forEach((record) => {
      status[record.type] = record.granted;
    });
    
    return status;
  }
}
