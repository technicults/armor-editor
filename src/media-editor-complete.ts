// Complete Media Editor with Canvas-based Editing
export interface MediaEditOptions {
  width?: number;
  height?: number;
  quality?: number;
  format?: 'jpeg' | 'png' | 'webp';
}

export interface VideoEditOptions {
  startTime?: number;
  endTime?: number;
  quality?: 'low' | 'medium' | 'high';
  format?: 'mp4' | 'webm';
}

export class CompleteMediaEditor {
  private editor: any;
  private canvas: HTMLCanvasElement | null = null;
  private ctx: CanvasRenderingContext2D | null = null;
  private currentImage: HTMLImageElement | null = null;
  private currentVideo: HTMLVideoElement | null = null;
  private editHistory: ImageData[] = [];
  private historyIndex = -1;
  private maxHistorySize = 20;

  constructor(editor: any) {
    this.editor = editor;
  }

  // Image Editing Functions
  public async editImage(imageUrl: string): Promise<void> {
    try {
      const img = await this.loadImage(imageUrl);
      this.setupCanvas(img.width, img.height);
      this.drawImage(img);
      this.saveState();
      this.showImageEditor();
    } catch (error) {
      console.error('Failed to load image for editing:', error);
      throw error;
    }
  }

  private loadImage(url: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = url;
    });
  }

  private setupCanvas(width: number, height: number) {
    this.canvas = document.createElement('canvas');
    this.canvas.width = width;
    this.canvas.height = height;
    this.ctx = this.canvas.getContext('2d');
    
    if (!this.ctx) {
      throw new Error('Failed to get canvas context');
    }
  }

  private drawImage(img: HTMLImageElement) {
    if (!this.ctx || !this.canvas) return;
    
    this.currentImage = img;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height);
  }

  private saveState() {
    if (!this.ctx || !this.canvas) return;
    
    const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
    
    // Remove future history if we're not at the end
    if (this.historyIndex < this.editHistory.length - 1) {
      this.editHistory = this.editHistory.slice(0, this.historyIndex + 1);
    }
    
    this.editHistory.push(imageData);
    this.historyIndex++;
    
    // Limit history size
    if (this.editHistory.length > this.maxHistorySize) {
      this.editHistory.shift();
      this.historyIndex--;
    }
  }

  public undo(): boolean {
    if (this.historyIndex > 0 && this.ctx && this.canvas) {
      this.historyIndex--;
      const imageData = this.editHistory[this.historyIndex];
      this.ctx.putImageData(imageData, 0, 0);
      return true;
    }
    return false;
  }

  public redo(): boolean {
    if (this.historyIndex < this.editHistory.length - 1 && this.ctx && this.canvas) {
      this.historyIndex++;
      const imageData = this.editHistory[this.historyIndex];
      this.ctx.putImageData(imageData, 0, 0);
      return true;
    }
    return false;
  }

  // Image Filters
  public applyBrightness(value: number) {
    if (!this.ctx || !this.canvas) return;
    
    const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
    const data = imageData.data;
    
    for (let i = 0; i < data.length; i += 4) {
      data[i] = Math.min(255, Math.max(0, data[i] + value));     // Red
      data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + value)); // Green
      data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + value)); // Blue
    }
    
    this.ctx.putImageData(imageData, 0, 0);
    this.saveState();
  }

  public applyContrast(value: number) {
    if (!this.ctx || !this.canvas) return;
    
    const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
    const data = imageData.data;
    const factor = (259 * (value + 255)) / (255 * (259 - value));
    
    for (let i = 0; i < data.length; i += 4) {
      data[i] = Math.min(255, Math.max(0, factor * (data[i] - 128) + 128));
      data[i + 1] = Math.min(255, Math.max(0, factor * (data[i + 1] - 128) + 128));
      data[i + 2] = Math.min(255, Math.max(0, factor * (data[i + 2] - 128) + 128));
    }
    
    this.ctx.putImageData(imageData, 0, 0);
    this.saveState();
  }

  public applySaturation(value: number) {
    if (!this.ctx || !this.canvas) return;
    
    const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
    const data = imageData.data;
    
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      
      const gray = 0.299 * r + 0.587 * g + 0.114 * b;
      
      data[i] = Math.min(255, Math.max(0, gray + value * (r - gray)));
      data[i + 1] = Math.min(255, Math.max(0, gray + value * (g - gray)));
      data[i + 2] = Math.min(255, Math.max(0, gray + value * (b - gray)));
    }
    
    this.ctx.putImageData(imageData, 0, 0);
    this.saveState();
  }

  public applyBlur(radius: number) {
    if (!this.ctx || !this.canvas) return;
    
    // Simple box blur implementation
    const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
    const data = imageData.data;
    const width = this.canvas.width;
    const height = this.canvas.height;
    const newData = new Uint8ClampedArray(data);
    
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        let r = 0, g = 0, b = 0, a = 0, count = 0;
        
        for (let dy = -radius; dy <= radius; dy++) {
          for (let dx = -radius; dx <= radius; dx++) {
            const nx = x + dx;
            const ny = y + dy;
            
            if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
              const index = (ny * width + nx) * 4;
              r += data[index];
              g += data[index + 1];
              b += data[index + 2];
              a += data[index + 3];
              count++;
            }
          }
        }
        
        const index = (y * width + x) * 4;
        newData[index] = r / count;
        newData[index + 1] = g / count;
        newData[index + 2] = b / count;
        newData[index + 3] = a / count;
      }
    }
    
    const newImageData = new ImageData(newData, width, height);
    this.ctx.putImageData(newImageData, 0, 0);
    this.saveState();
  }

  public applyGrayscale() {
    if (!this.ctx || !this.canvas) return;
    
    const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
    const data = imageData.data;
    
    for (let i = 0; i < data.length; i += 4) {
      const gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
      data[i] = gray;
      data[i + 1] = gray;
      data[i + 2] = gray;
    }
    
    this.ctx.putImageData(imageData, 0, 0);
    this.saveState();
  }

  public applySepia() {
    if (!this.ctx || !this.canvas) return;
    
    const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
    const data = imageData.data;
    
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      
      data[i] = Math.min(255, (r * 0.393) + (g * 0.769) + (b * 0.189));
      data[i + 1] = Math.min(255, (r * 0.349) + (g * 0.686) + (b * 0.168));
      data[i + 2] = Math.min(255, (r * 0.272) + (g * 0.534) + (b * 0.131));
    }
    
    this.ctx.putImageData(imageData, 0, 0);
    this.saveState();
  }

  // Crop and Resize
  public cropImage(x: number, y: number, width: number, height: number) {
    if (!this.ctx || !this.canvas) return;
    
    const imageData = this.ctx.getImageData(x, y, width, height);
    this.canvas.width = width;
    this.canvas.height = height;
    this.ctx.putImageData(imageData, 0, 0);
    this.saveState();
  }

  public resizeImage(newWidth: number, newHeight: number) {
    if (!this.ctx || !this.canvas) return;
    
    const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');
    
    if (!tempCtx) return;
    
    tempCanvas.width = this.canvas.width;
    tempCanvas.height = this.canvas.height;
    tempCtx.putImageData(imageData, 0, 0);
    
    this.canvas.width = newWidth;
    this.canvas.height = newHeight;
    this.ctx.drawImage(tempCanvas, 0, 0, newWidth, newHeight);
    this.saveState();
  }

  public rotateImage(degrees: number) {
    if (!this.ctx || !this.canvas) return;
    
    const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');
    
    if (!tempCtx) return;
    
    tempCanvas.width = this.canvas.width;
    tempCanvas.height = this.canvas.height;
    tempCtx.putImageData(imageData, 0, 0);
    
    const radians = degrees * Math.PI / 180;
    const cos = Math.abs(Math.cos(radians));
    const sin = Math.abs(Math.sin(radians));
    
    const newWidth = this.canvas.width * cos + this.canvas.height * sin;
    const newHeight = this.canvas.width * sin + this.canvas.height * cos;
    
    this.canvas.width = newWidth;
    this.canvas.height = newHeight;
    
    this.ctx.translate(newWidth / 2, newHeight / 2);
    this.ctx.rotate(radians);
    this.ctx.drawImage(tempCanvas, -tempCanvas.width / 2, -tempCanvas.height / 2);
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    
    this.saveState();
  }

  // Video Editing Functions
  public async editVideo(videoUrl: string): Promise<void> {
    try {
      const video = await this.loadVideo(videoUrl);
      this.currentVideo = video;
      this.showVideoEditor();
    } catch (error) {
      console.error('Failed to load video for editing:', error);
      throw error;
    }
  }

  private loadVideo(url: string): Promise<HTMLVideoElement> {
    return new Promise((resolve, reject) => {
      const video = document.createElement('video');
      video.crossOrigin = 'anonymous';
      video.onloadedmetadata = () => resolve(video);
      video.onerror = reject;
      video.src = url;
    });
  }

  public async trimVideo(startTime: number, endTime: number): Promise<Blob> {
    if (!this.currentVideo) {
      throw new Error('No video loaded');
    }

    try {
      // Use MediaRecorder API for video trimming
      const stream = (this.currentVideo as any).captureStream();
      const mediaRecorder = new MediaRecorder(stream);
      const chunks: Blob[] = [];

      return new Promise((resolve, reject) => {
        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            chunks.push(event.data);
          }
        };

        mediaRecorder.onstop = () => {
          const blob = new Blob(chunks, { type: 'video/webm' });
          resolve(blob);
        };

        mediaRecorder.onerror = reject;

        // Start recording at specified time
        this.currentVideo!.currentTime = startTime;
        this.currentVideo!.play();
        mediaRecorder.start();

        // Stop recording at end time
        setTimeout(() => {
          mediaRecorder.stop();
          this.currentVideo!.pause();
        }, (endTime - startTime) * 1000);
      });
    } catch (error) {
      console.error('Video trimming failed:', error);
      throw error;
    }
  }

  public captureVideoFrame(time: number): Promise<string> {
    if (!this.currentVideo) {
      throw new Error('No video loaded');
    }

    return new Promise((resolve) => {
      this.currentVideo!.currentTime = time;
      this.currentVideo!.onseeked = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
          throw new Error('Failed to get canvas context');
        }

        canvas.width = this.currentVideo!.videoWidth;
        canvas.height = this.currentVideo!.videoHeight;
        ctx.drawImage(this.currentVideo!, 0, 0);
        
        resolve(canvas.toDataURL('image/jpeg', 0.9));
      };
    });
  }

  // Audio Processing
  public async extractAudioFromVideo(videoFile: File): Promise<Blob> {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const arrayBuffer = await videoFile.arrayBuffer();
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
      
      // Convert audio buffer to WAV
      const wavBlob = this.audioBufferToWav(audioBuffer);
      return wavBlob;
    } catch (error) {
      console.error('Audio extraction failed:', error);
      throw error;
    }
  }

  private audioBufferToWav(buffer: AudioBuffer): Blob {
    const length = buffer.length;
    const numberOfChannels = buffer.numberOfChannels;
    const sampleRate = buffer.sampleRate;
    const arrayBuffer = new ArrayBuffer(44 + length * numberOfChannels * 2);
    const view = new DataView(arrayBuffer);
    
    // WAV header
    const writeString = (offset: number, string: string) => {
      for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
      }
    };
    
    writeString(0, 'RIFF');
    view.setUint32(4, 36 + length * numberOfChannels * 2, true);
    writeString(8, 'WAVE');
    writeString(12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, numberOfChannels, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * numberOfChannels * 2, true);
    view.setUint16(32, numberOfChannels * 2, true);
    view.setUint16(34, 16, true);
    writeString(36, 'data');
    view.setUint32(40, length * numberOfChannels * 2, true);
    
    // Audio data
    let offset = 44;
    for (let i = 0; i < length; i++) {
      for (let channel = 0; channel < numberOfChannels; channel++) {
        const sample = Math.max(-1, Math.min(1, buffer.getChannelData(channel)[i]));
        view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7FFF, true);
        offset += 2;
      }
    }
    
    return new Blob([arrayBuffer], { type: 'audio/wav' });
  }

  // Export Functions
  public exportImage(options: MediaEditOptions = {}): string {
    if (!this.canvas) {
      throw new Error('No image to export');
    }

    const format = options.format || 'png';
    const quality = options.quality || 0.9;
    
    return this.canvas.toDataURL(`image/${format}`, quality);
  }

  public exportImageAsBlob(options: MediaEditOptions = {}): Promise<Blob> {
    if (!this.canvas) {
      throw new Error('No image to export');
    }

    return new Promise((resolve) => {
      const format = options.format || 'png';
      const quality = options.quality || 0.9;
      
      this.canvas!.toBlob((blob) => {
        resolve(blob!);
      }, `image/${format}`, quality);
    });
  }

  // UI Functions
  private showImageEditor() {
    const modal = document.createElement('div');
    modal.className = 'media-editor-modal';
    modal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0,0,0,0.8);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10000;
    `;

    const editor = document.createElement('div');
    editor.style.cssText = `
      background: white;
      border-radius: 8px;
      padding: 20px;
      max-width: 90%;
      max-height: 90%;
      overflow: auto;
    `;

    const toolbar = this.createImageToolbar();
    const canvasContainer = document.createElement('div');
    canvasContainer.style.cssText = `
      margin: 20px 0;
      text-align: center;
      max-height: 500px;
      overflow: auto;
    `;

    if (this.canvas) {
      this.canvas.style.maxWidth = '100%';
      this.canvas.style.height = 'auto';
      canvasContainer.appendChild(this.canvas);
    }

    const actions = document.createElement('div');
    actions.style.cssText = 'text-align: center; margin-top: 20px;';
    actions.innerHTML = `
      <button onclick="this.parentElement.parentElement.parentElement.remove()">Cancel</button>
      <button onclick="this.dispatchEvent(new CustomEvent('save-image', {bubbles: true}))">Save</button>
    `;

    editor.appendChild(toolbar);
    editor.appendChild(canvasContainer);
    editor.appendChild(actions);
    modal.appendChild(editor);

    // Handle save
    modal.addEventListener('save-image', () => {
      const dataUrl = this.exportImage();
      this.editor.insertHTML(`<img src="${dataUrl}" alt="Edited image" />`);
      modal.remove();
    });

    document.body.appendChild(modal);
  }

  private createImageToolbar(): HTMLElement {
    const toolbar = document.createElement('div');
    toolbar.style.cssText = `
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
      margin-bottom: 20px;
      padding: 10px;
      background: #f5f5f5;
      border-radius: 4px;
    `;

    const tools = [
      { name: 'Undo', action: () => this.undo() },
      { name: 'Redo', action: () => this.redo() },
      { name: 'Brightness +', action: () => this.applyBrightness(20) },
      { name: 'Brightness -', action: () => this.applyBrightness(-20) },
      { name: 'Contrast +', action: () => this.applyContrast(20) },
      { name: 'Contrast -', action: () => this.applyContrast(-20) },
      { name: 'Blur', action: () => this.applyBlur(2) },
      { name: 'Grayscale', action: () => this.applyGrayscale() },
      { name: 'Sepia', action: () => this.applySepia() },
      { name: 'Rotate 90°', action: () => this.rotateImage(90) }
    ];

    tools.forEach(tool => {
      const button = document.createElement('button');
      button.textContent = tool.name;
      button.style.cssText = `
        padding: 5px 10px;
        border: 1px solid #ccc;
        background: white;
        border-radius: 3px;
        cursor: pointer;
      `;
      button.onclick = tool.action;
      toolbar.appendChild(button);
    });

    return toolbar;
  }

  private showVideoEditor() {
    // Similar to image editor but for video
    console.log('Video editor would be shown here');
  }

  public destroy() {
    this.canvas = null;
    this.ctx = null;
    this.currentImage = null;
    this.currentVideo = null;
    this.editHistory = [];
    this.historyIndex = -1;
  }
}
