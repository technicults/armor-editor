// Voice Comments System
export interface VoiceComment {
  id: string;
  userId: string;
  userName: string;
  audioBlob: Blob;
  duration: number;
  timestamp: Date;
  position: { start: number; end: number };
  transcription?: string;
}

export class VoiceCommentsSystem {
  private editor: any;
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];
  private isRecording = false;
  private voiceComments: Map<string, VoiceComment> = new Map();

  constructor(editor: any) {
    this.editor = editor;
    this.setupVoiceComments();
  }

  private setupVoiceComments() {
    // Add voice comment button to toolbar
    const voiceBtn = document.createElement('button');
    voiceBtn.innerHTML = '🎤';
    voiceBtn.title = 'Add Voice Comment';
    voiceBtn.onclick = () => this.startRecording();
    
    this.editor.toolbar?.appendChild(voiceBtn);
  }

  async startRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.mediaRecorder = new MediaRecorder(stream);
      this.audioChunks = [];

      this.mediaRecorder.ondataavailable = (event) => {
        this.audioChunks.push(event.data);
      };

      this.mediaRecorder.onstop = () => {
        const audioBlob = new Blob(this.audioChunks, { type: 'audio/wav' });
        this.saveVoiceComment(audioBlob);
      };

      this.mediaRecorder.start();
      this.isRecording = true;
    } catch (error) {
      console.error('Failed to start recording:', error);
    }
  }

  stopRecording() {
    if (this.mediaRecorder && this.isRecording) {
      this.mediaRecorder.stop();
      this.isRecording = false;
    }
  }

  private saveVoiceComment(audioBlob: Blob) {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    const comment: VoiceComment = {
      id: Date.now().toString(),
      userId: 'current-user',
      userName: 'Current User',
      audioBlob,
      duration: 0, // Calculate from blob
      timestamp: new Date(),
      position: { start: range.startOffset, end: range.endOffset }
    };

    this.voiceComments.set(comment.id, comment);
    this.renderVoiceComment(comment);
  }

  private renderVoiceComment(comment: VoiceComment) {
    const commentElement = document.createElement('div');
    commentElement.className = 'voice-comment';
    commentElement.innerHTML = `
      <div class="voice-comment-header">
        <span>${comment.userName}</span>
        <span>${comment.timestamp.toLocaleString()}</span>
      </div>
      <audio controls>
        <source src="${URL.createObjectURL(comment.audioBlob)}" type="audio/wav">
      </audio>
    `;

    this.editor.commentSidebar?.appendChild(commentElement);
  }

  getVoiceComments(): VoiceComment[] {
    return Array.from(this.voiceComments.values());
  }

  deleteVoiceComment(id: string) {
    this.voiceComments.delete(id);
  }
}
