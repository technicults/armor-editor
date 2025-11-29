// Video Call Integration System
export interface VideoCall {
  id: string;
  participants: string[];
  isActive: boolean;
  startTime: Date;
  recordingUrl?: string;
}

export class VideoIntegration {
  private editor: any;
  private currentCall: VideoCall | null = null;
  private localVideo: HTMLVideoElement | null = null;
  private remoteVideos: Map<string, HTMLVideoElement> = new Map();

  constructor(editor: any) {
    this.editor = editor;
    this.setupVideoIntegration();
  }

  private setupVideoIntegration() {
    const videoBtn = document.createElement('button');
    videoBtn.innerHTML = '📹';
    videoBtn.title = 'Start Video Call';
    videoBtn.onclick = () => this.startVideoCall();
    
    this.editor.toolbar?.appendChild(videoBtn);
  }

  async startVideoCall() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: true 
      });

      this.createVideoInterface();
      this.setupLocalVideo(stream);
      
      this.currentCall = {
        id: Date.now().toString(),
        participants: ['current-user'],
        isActive: true,
        startTime: new Date()
      };

    } catch (error) {
      console.error('Failed to start video call:', error);
    }
  }

  private createVideoInterface() {
    const videoContainer = document.createElement('div');
    videoContainer.className = 'video-call-container';
    videoContainer.innerHTML = `
      <div class="video-header">
        <span>Video Call</span>
        <button onclick="this.parentElement.parentElement.remove()">×</button>
      </div>
      <div class="video-grid" id="video-grid"></div>
      <div class="video-controls">
        <button id="mute-btn">🎤</button>
        <button id="video-btn">📹</button>
        <button id="end-call-btn">📞</button>
      </div>
    `;

    document.body.appendChild(videoContainer);
  }

  private setupLocalVideo(stream: MediaStream) {
    this.localVideo = document.createElement('video');
    this.localVideo.srcObject = stream;
    this.localVideo.autoplay = true;
    this.localVideo.muted = true;
    this.localVideo.className = 'local-video';

    const videoGrid = document.getElementById('video-grid');
    videoGrid?.appendChild(this.localVideo);
  }

  endVideoCall() {
    if (this.currentCall) {
      this.currentCall.isActive = false;
      this.localVideo?.srcObject && (this.localVideo.srcObject as MediaStream).getTracks().forEach(track => track.stop());
      this.remoteVideos.clear();
      document.querySelector('.video-call-container')?.remove();
      this.currentCall = null;
    }
  }

  addParticipant(userId: string, stream: MediaStream) {
    const video = document.createElement('video');
    video.srcObject = stream;
    video.autoplay = true;
    video.className = 'remote-video';

    this.remoteVideos.set(userId, video);
    document.getElementById('video-grid')?.appendChild(video);
  }

  removeParticipant(userId: string) {
    const video = this.remoteVideos.get(userId);
    if (video) {
      video.remove();
      this.remoteVideos.delete(userId);
    }
  }
}
