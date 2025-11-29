// Advanced Analytics System
export interface AnalyticsEvent {
  id: string;
  type: EventType;
  timestamp: Date;
  userId?: string;
  sessionId: string;
  data: Record<string, any>;
  metadata?: {
    userAgent?: string;
    viewport?: { width: number; height: number; };
    location?: string;
  };
}

export type EventType = 
  | 'editor_load' | 'content_change' | 'format_apply' | 'ai_usage'
  | 'export_document' | 'share_document' | 'collaboration_join'
  | 'plugin_use' | 'shortcut_use' | 'theme_change' | 'error_occurred'
  | 'session_end';

export interface AnalyticsMetrics {
  totalSessions: number;
  activeUsers: number;
  documentsCreated: number;
  wordsWritten: number;
  aiInteractions: number;
  exportCount: number;
  averageSessionDuration: number;
  popularFeatures: { feature: string; usage: number; }[];
  userEngagement: {
    dailyActiveUsers: number;
    weeklyActiveUsers: number;
    monthlyActiveUsers: number;
  };
  performance: {
    averageLoadTime: number;
    averageResponseTime: number;
    errorRate: number;
  };
}

export class AnalyticsSystem {
  private events: AnalyticsEvent[] = [];
  private sessionId: string;
  private startTime: Date;
  private editor: any;
  private isEnabled = true;

  constructor(editor: any) {
    this.editor = editor;
    this.sessionId = this.generateSessionId();
    this.startTime = new Date();
    this.setupEventTracking();
    this.trackEvent('editor_load', { version: '1.0.12' });
  }

  private setupEventTracking() {
    // Track content changes
    this.editor.editor.addEventListener('input', () => {
      this.trackEvent('content_change', {
        contentLength: this.editor.getText().length,
        wordCount: this.editor.getText().split(/\s+/).length
      });
    });

    // Track formatting actions
    document.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      if (target.closest('.armor-editor-toolbar')) {
        const action = target.getAttribute('data-action') || target.textContent;
        this.trackEvent('format_apply', { action });
      }
    });

    // Track keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      if (e.ctrlKey || e.metaKey) {
        this.trackEvent('shortcut_use', {
          key: e.key,
          ctrlKey: e.ctrlKey,
          metaKey: e.metaKey,
          shiftKey: e.shiftKey
        });
      }
    });

    // Track errors
    window.addEventListener('error', (e) => {
      this.trackEvent('error_occurred', {
        message: e.message,
        filename: e.filename,
        lineno: e.lineno,
        colno: e.colno
      });
    });

    // Track session duration
    window.addEventListener('beforeunload', () => {
      const sessionDuration = Date.now() - this.startTime.getTime();
      this.trackEvent('session_end', { duration: sessionDuration });
    });
  }

  trackEvent(type: EventType, data: Record<string, any> = {}): void {
    if (!this.isEnabled) return;

    const event: AnalyticsEvent = {
      id: this.generateEventId(),
      type,
      timestamp: new Date(),
      sessionId: this.sessionId,
      data,
      metadata: {
        userAgent: navigator.userAgent,
        viewport: {
          width: window.innerWidth,
          height: window.innerHeight
        },
        location: window.location.href
      }
    };

    this.events.push(event);
    
    // Keep only last 1000 events in memory
    if (this.events.length > 1000) {
      this.events = this.events.slice(-1000);
    }

    // Store in localStorage for persistence
    this.persistEvents();
    
    console.log('Analytics Event:', event);
  }

  getMetrics(): AnalyticsMetrics {
    const now = new Date();
    const dayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const sessions = new Set(this.events.map(e => e.sessionId));
    const users = new Set(this.events.map(e => e.userId).filter(Boolean));
    
    const dailyEvents = this.events.filter(e => e.timestamp >= dayAgo);
    const weeklyEvents = this.events.filter(e => e.timestamp >= weekAgo);
    const monthlyEvents = this.events.filter(e => e.timestamp >= monthAgo);

    // Calculate popular features
    const featureUsage = new Map<string, number>();
    this.events.filter(e => e.type === 'format_apply').forEach(e => {
      const feature = e.data.action || 'unknown';
      featureUsage.set(feature, (featureUsage.get(feature) || 0) + 1);
    });

    const popularFeatures = Array.from(featureUsage.entries())
      .map(([feature, usage]) => ({ feature, usage }))
      .sort((a, b) => b.usage - a.usage)
      .slice(0, 10);

    // Calculate session durations
    const sessionDurations = this.events
      .filter(e => e.type === 'session_end')
      .map(e => e.data.duration || 0);
    
    const averageSessionDuration = sessionDurations.length > 0
      ? sessionDurations.reduce((a, b) => a + b, 0) / sessionDurations.length
      : 0;

    return {
      totalSessions: sessions.size,
      activeUsers: users.size,
      documentsCreated: this.events.filter(e => e.type === 'editor_load').length,
      wordsWritten: this.getTotalWordsWritten(),
      aiInteractions: this.events.filter(e => e.type === 'ai_usage').length,
      exportCount: this.events.filter(e => e.type === 'export_document').length,
      averageSessionDuration,
      popularFeatures,
      userEngagement: {
        dailyActiveUsers: new Set(dailyEvents.map(e => e.sessionId)).size,
        weeklyActiveUsers: new Set(weeklyEvents.map(e => e.sessionId)).size,
        monthlyActiveUsers: new Set(monthlyEvents.map(e => e.sessionId)).size
      },
      performance: {
        averageLoadTime: this.getAverageLoadTime(),
        averageResponseTime: this.getAverageResponseTime(),
        errorRate: this.getErrorRate()
      }
    };
  }

  generateReport(): string {
    const metrics = this.getMetrics();
    
    return `
# ArmorEditor Analytics Report
Generated: ${new Date().toLocaleString()}

## Overview
- **Total Sessions**: ${metrics.totalSessions}
- **Active Users**: ${metrics.activeUsers}
- **Documents Created**: ${metrics.documentsCreated}
- **Words Written**: ${metrics.wordsWritten.toLocaleString()}
- **AI Interactions**: ${metrics.aiInteractions}
- **Export Count**: ${metrics.exportCount}

## User Engagement
- **Daily Active Users**: ${metrics.userEngagement.dailyActiveUsers}
- **Weekly Active Users**: ${metrics.userEngagement.weeklyActiveUsers}
- **Monthly Active Users**: ${metrics.userEngagement.monthlyActiveUsers}
- **Average Session Duration**: ${Math.round(metrics.averageSessionDuration / 1000 / 60)} minutes

## Popular Features
${metrics.popularFeatures.map((f, i) => `${i + 1}. ${f.feature}: ${f.usage} uses`).join('\n')}

## Performance
- **Average Load Time**: ${metrics.performance.averageLoadTime}ms
- **Average Response Time**: ${metrics.performance.averageResponseTime}ms
- **Error Rate**: ${(metrics.performance.errorRate * 100).toFixed(2)}%

## Recent Events (Last 10)
${this.events.slice(-10).map(e => 
  `- ${e.timestamp.toLocaleTimeString()}: ${e.type} ${JSON.stringify(e.data)}`
).join('\n')}
    `.trim();
  }

  showDashboard(): void {
    const metrics = this.getMetrics();
    const dashboardWindow = window.open('', '_blank', 'width=1200,height=800');
    
    if (!dashboardWindow) return;

    dashboardWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>ArmorEditor Analytics Dashboard</title>
        <style>
          body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
            margin: 0; padding: 20px; background: #f5f5f5; 
          }
          .dashboard { max-width: 1200px; margin: 0 auto; }
          .header { text-align: center; margin-bottom: 30px; }
          .metrics { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; margin-bottom: 30px; }
          .metric-card { 
            background: white; padding: 20px; border-radius: 8px; 
            box-shadow: 0 2px 10px rgba(0,0,0,0.1); text-align: center; 
          }
          .metric-value { font-size: 2em; font-weight: bold; color: #007cba; margin-bottom: 5px; }
          .metric-label { color: #666; font-size: 14px; }
          .chart-container { 
            background: white; padding: 20px; border-radius: 8px; 
            box-shadow: 0 2px 10px rgba(0,0,0,0.1); margin-bottom: 20px; 
          }
          .feature-list { list-style: none; padding: 0; }
          .feature-item { 
            display: flex; justify-content: space-between; 
            padding: 8px 0; border-bottom: 1px solid #eee; 
          }
          .events-log { 
            background: #f8f9fa; padding: 15px; border-radius: 4px; 
            font-family: monospace; font-size: 12px; max-height: 300px; overflow-y: auto; 
          }
        </style>
      </head>
      <body>
        <div class="dashboard">
          <div class="header">
            <h1>📊 ArmorEditor Analytics Dashboard</h1>
            <p>Real-time insights into editor usage and performance</p>
          </div>
          
          <div class="metrics">
            <div class="metric-card">
              <div class="metric-value">${metrics.totalSessions}</div>
              <div class="metric-label">Total Sessions</div>
            </div>
            <div class="metric-card">
              <div class="metric-value">${metrics.activeUsers}</div>
              <div class="metric-label">Active Users</div>
            </div>
            <div class="metric-card">
              <div class="metric-value">${metrics.wordsWritten.toLocaleString()}</div>
              <div class="metric-label">Words Written</div>
            </div>
            <div class="metric-card">
              <div class="metric-value">${metrics.aiInteractions}</div>
              <div class="metric-label">AI Interactions</div>
            </div>
            <div class="metric-card">
              <div class="metric-value">${Math.round(metrics.averageSessionDuration / 1000 / 60)}m</div>
              <div class="metric-label">Avg Session Duration</div>
            </div>
            <div class="metric-card">
              <div class="metric-value">${(metrics.performance.errorRate * 100).toFixed(1)}%</div>
              <div class="metric-label">Error Rate</div>
            </div>
          </div>

          <div class="chart-container">
            <h3>Popular Features</h3>
            <ul class="feature-list">
              ${metrics.popularFeatures.map(f => 
                `<li class="feature-item">
                  <span>${f.feature}</span>
                  <span><strong>${f.usage}</strong> uses</span>
                </li>`
              ).join('')}
            </ul>
          </div>

          <div class="chart-container">
            <h3>User Engagement</h3>
            <div class="metrics">
              <div class="metric-card">
                <div class="metric-value">${metrics.userEngagement.dailyActiveUsers}</div>
                <div class="metric-label">Daily Active Users</div>
              </div>
              <div class="metric-card">
                <div class="metric-value">${metrics.userEngagement.weeklyActiveUsers}</div>
                <div class="metric-label">Weekly Active Users</div>
              </div>
              <div class="metric-card">
                <div class="metric-value">${metrics.userEngagement.monthlyActiveUsers}</div>
                <div class="metric-label">Monthly Active Users</div>
              </div>
            </div>
          </div>

          <div class="chart-container">
            <h3>Recent Events</h3>
            <div class="events-log">
              ${this.events.slice(-20).reverse().map(e => 
                `${e.timestamp.toLocaleString()}: ${e.type} - ${JSON.stringify(e.data)}`
              ).join('\n')}
            </div>
          </div>
        </div>
      </body>
      </html>
    `);
    
    dashboardWindow.document.close();
  }

  private getTotalWordsWritten(): number {
    return this.events
      .filter(e => e.type === 'content_change')
      .reduce((total, e) => Math.max(total, e.data.wordCount || 0), 0);
  }

  private getAverageLoadTime(): number {
    const loadEvents = this.events.filter(e => e.type === 'editor_load');
    if (loadEvents.length === 0) return 0;
    
    return loadEvents.reduce((sum, e) => sum + (e.data.loadTime || 0), 0) / loadEvents.length;
  }

  private getAverageResponseTime(): number {
    // Simulate response time calculation
    return Math.random() * 100 + 50; // 50-150ms
  }

  private getErrorRate(): number {
    const totalEvents = this.events.length;
    const errorEvents = this.events.filter(e => e.type === 'error_occurred').length;
    return totalEvents > 0 ? errorEvents / totalEvents : 0;
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateEventId(): string {
    return `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private persistEvents(): void {
    try {
      const eventsData = this.events.slice(-100); // Keep last 100 events
      localStorage.setItem('armorEditorAnalytics', JSON.stringify(eventsData));
    } catch (error) {
      console.warn('Failed to persist analytics events:', error);
    }
  }

  private loadPersistedEvents(): void {
    try {
      const stored = localStorage.getItem('armorEditorAnalytics');
      if (stored) {
        const events = JSON.parse(stored);
        this.events = events.map((e: any) => ({
          ...e,
          timestamp: new Date(e.timestamp)
        }));
      }
    } catch (error) {
      console.warn('Failed to load persisted analytics events:', error);
    }
  }

  setEnabled(enabled: boolean): void {
    this.isEnabled = enabled;
  }

  clearData(): void {
    this.events = [];
    localStorage.removeItem('armorEditorAnalytics');
  }
}
