// Workflow Integration System
export interface WorkflowStep {
  id: string;
  name: string;
  type: 'approval' | 'review' | 'notification' | 'automation';
  assignee?: string;
  dueDate?: Date;
  status: 'pending' | 'in_progress' | 'completed' | 'rejected';
  conditions?: WorkflowCondition[];
  actions?: WorkflowAction[];
}

export interface WorkflowCondition {
  field: string;
  operator: 'equals' | 'contains' | 'greater_than' | 'less_than';
  value: any;
}

export interface WorkflowAction {
  type: 'email' | 'webhook' | 'status_change' | 'assignment';
  config: Record<string, any>;
}

export interface Workflow {
  id: string;
  name: string;
  description: string;
  trigger: WorkflowTrigger;
  steps: WorkflowStep[];
  isActive: boolean;
  createdBy: string;
  createdAt: Date;
}

export interface WorkflowTrigger {
  event: 'document_created' | 'document_updated' | 'document_shared' | 'manual';
  conditions?: WorkflowCondition[];
}

export class WorkflowSystem {
  private workflows: Map<string, Workflow> = new Map();
  private activeWorkflows: Map<string, WorkflowExecution> = new Map();
  private editor: any;

  constructor(editor: any) {
    this.editor = editor;
    this.setupDefaultWorkflows();
    this.setupEventListeners();
  }

  private setupDefaultWorkflows() {
    // Document Review Workflow
    const reviewWorkflow: Workflow = {
      id: 'document-review',
      name: 'Document Review Process',
      description: 'Standard document review and approval process',
      trigger: {
        event: 'manual'
      },
      steps: [
        {
          id: 'peer-review',
          name: 'Peer Review',
          type: 'review',
          status: 'pending',
          assignee: 'reviewer@company.com'
        },
        {
          id: 'manager-approval',
          name: 'Manager Approval',
          type: 'approval',
          status: 'pending',
          assignee: 'manager@company.com'
        },
        {
          id: 'publish',
          name: 'Publish Document',
          type: 'automation',
          status: 'pending',
          actions: [
            {
              type: 'status_change',
              config: { status: 'published' }
            },
            {
              type: 'email',
              config: {
                to: 'team@company.com',
                subject: 'Document Published',
                template: 'document_published'
              }
            }
          ]
        }
      ],
      isActive: true,
      createdBy: 'system',
      createdAt: new Date()
    };

    this.workflows.set(reviewWorkflow.id, reviewWorkflow);

    // Content Approval Workflow
    const approvalWorkflow: Workflow = {
      id: 'content-approval',
      name: 'Content Approval',
      description: 'Multi-stage content approval process',
      trigger: {
        event: 'document_updated',
        conditions: [
          { field: 'wordCount', operator: 'greater_than', value: 1000 }
        ]
      },
      steps: [
        {
          id: 'content-review',
          name: 'Content Review',
          type: 'review',
          status: 'pending',
          dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000) // 2 days
        },
        {
          id: 'legal-review',
          name: 'Legal Review',
          type: 'review',
          status: 'pending',
          conditions: [
            { field: 'category', operator: 'equals', value: 'legal' }
          ]
        },
        {
          id: 'final-approval',
          name: 'Final Approval',
          type: 'approval',
          status: 'pending'
        }
      ],
      isActive: true,
      createdBy: 'system',
      createdAt: new Date()
    };

    this.workflows.set(approvalWorkflow.id, approvalWorkflow);
  }

  private setupEventListeners() {
    // Listen for document changes
    this.editor.editor.addEventListener('input', () => {
      this.checkWorkflowTriggers('document_updated');
    });

    // Listen for sharing events
    document.addEventListener('document-shared', () => {
      this.checkWorkflowTriggers('document_shared');
    });
  }

  startWorkflow(workflowId: string, documentId: string, initiatedBy: string): string {
    const workflow = this.workflows.get(workflowId);
    if (!workflow || !workflow.isActive) {
      throw new Error('Workflow not found or inactive');
    }

    const executionId = this.generateExecutionId();
    const execution: WorkflowExecution = {
      id: executionId,
      workflowId,
      documentId,
      initiatedBy,
      startedAt: new Date(),
      status: 'running',
      currentStep: 0,
      stepHistory: [],
      context: {}
    };

    this.activeWorkflows.set(executionId, execution);
    this.processNextStep(executionId);
    
    console.log(`Started workflow ${workflow.name} for document ${documentId}`);
    return executionId;
  }

  approveStep(executionId: string, stepId: string, approver: string, comments?: string): boolean {
    const execution = this.activeWorkflows.get(executionId);
    if (!execution) return false;

    const workflow = this.workflows.get(execution.workflowId);
    if (!workflow) return false;

    const step = workflow.steps.find(s => s.id === stepId);
    if (!step) return false;

    // Record approval
    execution.stepHistory.push({
      stepId,
      action: 'approved',
      actor: approver,
      timestamp: new Date(),
      comments
    });

    step.status = 'completed';
    
    // Execute step actions
    if (step.actions) {
      this.executeActions(step.actions, execution);
    }

    // Move to next step
    execution.currentStep++;
    this.processNextStep(executionId);

    return true;
  }

  rejectStep(executionId: string, stepId: string, rejector: string, reason: string): boolean {
    const execution = this.activeWorkflows.get(executionId);
    if (!execution) return false;

    const workflow = this.workflows.get(execution.workflowId);
    if (!workflow) return false;

    const step = workflow.steps.find(s => s.id === stepId);
    if (!step) return false;

    // Record rejection
    execution.stepHistory.push({
      stepId,
      action: 'rejected',
      actor: rejector,
      timestamp: new Date(),
      comments: reason
    });

    step.status = 'rejected';
    execution.status = 'rejected';

    // Send rejection notification
    this.sendNotification({
      type: 'workflow_rejected',
      recipient: execution.initiatedBy,
      data: {
        workflowName: workflow.name,
        stepName: step.name,
        rejector,
        reason
      }
    });

    return true;
  }

  private processNextStep(executionId: string): void {
    const execution = this.activeWorkflows.get(executionId);
    if (!execution) return;

    const workflow = this.workflows.get(execution.workflowId);
    if (!workflow) return;

    if (execution.currentStep >= workflow.steps.length) {
      // Workflow completed
      execution.status = 'completed';
      execution.completedAt = new Date();
      
      this.sendNotification({
        type: 'workflow_completed',
        recipient: execution.initiatedBy,
        data: {
          workflowName: workflow.name,
          documentId: execution.documentId
        }
      });
      
      return;
    }

    const currentStep = workflow.steps[execution.currentStep];
    currentStep.status = 'in_progress';

    // Check conditions
    if (currentStep.conditions && !this.evaluateConditions(currentStep.conditions, execution)) {
      // Skip this step
      execution.currentStep++;
      this.processNextStep(executionId);
      return;
    }

    // Send notification to assignee
    if (currentStep.assignee) {
      this.sendNotification({
        type: 'workflow_step_assigned',
        recipient: currentStep.assignee,
        data: {
          workflowName: workflow.name,
          stepName: currentStep.name,
          documentId: execution.documentId,
          executionId,
          stepId: currentStep.id
        }
      });
    }

    // Handle automation steps
    if (currentStep.type === 'automation') {
      if (currentStep.actions) {
        this.executeActions(currentStep.actions, execution);
      }
      currentStep.status = 'completed';
      execution.currentStep++;
      this.processNextStep(executionId);
    }
  }

  private executeActions(actions: WorkflowAction[], execution: WorkflowExecution): void {
    actions.forEach(action => {
      switch (action.type) {
        case 'email':
          this.sendEmail(action.config);
          break;
        case 'webhook':
          this.callWebhook(action.config);
          break;
        case 'status_change':
          this.updateDocumentStatus(execution.documentId, action.config.status);
          break;
        case 'assignment':
          this.assignDocument(execution.documentId, action.config.assignee);
          break;
      }
    });
  }

  private evaluateConditions(conditions: WorkflowCondition[], execution: WorkflowExecution): boolean {
    return conditions.every(condition => {
      const value = this.getContextValue(condition.field, execution);
      
      switch (condition.operator) {
        case 'equals':
          return value === condition.value;
        case 'contains':
          return String(value).includes(String(condition.value));
        case 'greater_than':
          return Number(value) > Number(condition.value);
        case 'less_than':
          return Number(value) < Number(condition.value);
        default:
          return false;
      }
    });
  }

  private getContextValue(field: string, execution: WorkflowExecution): any {
    switch (field) {
      case 'wordCount':
        return this.editor.getText().split(/\s+/).length;
      case 'category':
        return execution.context.category || 'general';
      default:
        return execution.context[field];
    }
  }

  private checkWorkflowTriggers(event: string): void {
    this.workflows.forEach(workflow => {
      if (workflow.isActive && workflow.trigger.event === event) {
        if (!workflow.trigger.conditions || this.evaluateConditions(workflow.trigger.conditions, { context: {} } as any)) {
          // Auto-start workflow
          const documentId = this.editor.options.documentId || 'current';
          this.startWorkflow(workflow.id, documentId, 'system');
        }
      }
    });
  }

  private sendNotification(notification: any): void {
    console.log('Workflow Notification:', notification);
    
    // In real implementation, integrate with notification service
    if (notification.type === 'workflow_step_assigned') {
      this.showWorkflowNotification(
        `New task assigned: ${notification.data.stepName}`,
        `You have been assigned a task in the ${notification.data.workflowName} workflow.`
      );
    }
  }

  private showWorkflowNotification(title: string, message: string): void {
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #007cba;
      color: white;
      padding: 15px 20px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      z-index: 10000;
      max-width: 300px;
      animation: slideIn 0.3s ease-out;
    `;

    notification.innerHTML = `
      <div style="font-weight: bold; margin-bottom: 5px;">${title}</div>
      <div style="font-size: 14px; opacity: 0.9;">${message}</div>
      <button onclick="this.parentElement.remove()" style="
        position: absolute; top: 5px; right: 5px; 
        background: none; border: none; color: white; 
        cursor: pointer; font-size: 16px;
      ">×</button>
    `;

    document.body.appendChild(notification);

    // Auto-remove after 5 seconds
    setTimeout(() => {
      if (notification.parentElement) {
        notification.remove();
      }
    }, 5000);
  }

  private sendEmail(config: any): void {
    console.log('Sending email:', config);
    // Integrate with email service
  }

  private callWebhook(config: any): void {
    console.log('Calling webhook:', config);
    // Make HTTP request to webhook URL
  }

  private updateDocumentStatus(documentId: string, status: string): void {
    console.log(`Updated document ${documentId} status to ${status}`);
  }

  private assignDocument(documentId: string, assignee: string): void {
    console.log(`Assigned document ${documentId} to ${assignee}`);
  }

  private generateExecutionId(): string {
    return `exec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Public API methods
  getActiveWorkflows(): WorkflowExecution[] {
    return Array.from(this.activeWorkflows.values());
  }

  getWorkflowHistory(documentId: string): WorkflowExecution[] {
    return Array.from(this.activeWorkflows.values())
      .filter(exec => exec.documentId === documentId);
  }

  createWorkflow(workflow: Omit<Workflow, 'id' | 'createdAt'>): string {
    const id = `workflow_${Date.now()}`;
    const newWorkflow: Workflow = {
      ...workflow,
      id,
      createdAt: new Date()
    };
    
    this.workflows.set(id, newWorkflow);
    return id;
  }

  showWorkflowDashboard(): void {
    const activeWorkflows = this.getActiveWorkflows();
    
    const dashboardWindow = window.open('', '_blank', 'width=1000,height=700');
    if (!dashboardWindow) return;

    dashboardWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Workflow Dashboard</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 20px; }
          .workflow-item { 
            border: 1px solid #ddd; padding: 15px; margin-bottom: 15px; 
            border-radius: 8px; background: white; 
          }
          .workflow-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
          .workflow-status { 
            padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: bold; 
          }
          .status-running { background: #fff3cd; color: #856404; }
          .status-completed { background: #d4edda; color: #155724; }
          .status-rejected { background: #f8d7da; color: #721c24; }
          .steps { margin-top: 10px; }
          .step { 
            padding: 8px; margin: 5px 0; border-left: 3px solid #ddd; 
            background: #f8f9fa; border-radius: 0 4px 4px 0; 
          }
          .step.completed { border-left-color: #28a745; }
          .step.in_progress { border-left-color: #ffc107; }
          .step.rejected { border-left-color: #dc3545; }
        </style>
      </head>
      <body>
        <h1>🔄 Workflow Dashboard</h1>
        <p>Active workflows and their current status</p>
        
        ${activeWorkflows.length === 0 ? 
          '<p>No active workflows</p>' : 
          activeWorkflows.map(exec => {
            const workflow = this.workflows.get(exec.workflowId);
            return `
              <div class="workflow-item">
                <div class="workflow-header">
                  <h3>${workflow?.name || 'Unknown Workflow'}</h3>
                  <span class="workflow-status status-${exec.status}">${exec.status.toUpperCase()}</span>
                </div>
                <p><strong>Document:</strong> ${exec.documentId}</p>
                <p><strong>Started:</strong> ${exec.startedAt.toLocaleString()}</p>
                <p><strong>Initiated by:</strong> ${exec.initiatedBy}</p>
                
                <div class="steps">
                  <h4>Steps:</h4>
                  ${workflow?.steps.map((step, index) => `
                    <div class="step ${step.status}">
                      <strong>${step.name}</strong> - ${step.status}
                      ${step.assignee ? `<br><small>Assigned to: ${step.assignee}</small>` : ''}
                    </div>
                  `).join('') || ''}
                </div>
              </div>
            `;
          }).join('')
        }
      </body>
      </html>
    `);
    
    dashboardWindow.document.close();
  }
}

interface WorkflowExecution {
  id: string;
  workflowId: string;
  documentId: string;
  initiatedBy: string;
  startedAt: Date;
  completedAt?: Date;
  status: 'running' | 'completed' | 'rejected' | 'paused';
  currentStep: number;
  stepHistory: {
    stepId: string;
    action: 'approved' | 'rejected' | 'completed';
    actor: string;
    timestamp: Date;
    comments?: string;
  }[];
  context: Record<string, any>;
}
