// Enhanced Mobile Support
export class MobileEnhancements {
  private editor: any;
  private touchStartX = 0;
  private touchStartY = 0;
  private isSelecting = false;

  constructor(editor: any) {
    this.editor = editor;
    this.setupTouchHandlers();
    this.setupVirtualKeyboard();
  }

  private setupTouchHandlers() {
    const editorElement = this.editor.editor;

    // Touch selection
    editorElement.addEventListener('touchstart', (e: TouchEvent) => {
      this.touchStartX = e.touches[0].clientX;
      this.touchStartY = e.touches[0].clientY;
    });

    editorElement.addEventListener('touchmove', (e: TouchEvent) => {
      const touch = e.touches[0];
      const deltaX = Math.abs(touch.clientX - this.touchStartX);
      const deltaY = Math.abs(touch.clientY - this.touchStartY);

      if (deltaX > 10 || deltaY > 10) {
        this.isSelecting = true;
      }
    });

    // Double tap to select word
    let lastTap = 0;
    editorElement.addEventListener('touchend', (e: TouchEvent) => {
      const currentTime = new Date().getTime();
      const tapLength = currentTime - lastTap;
      
      if (tapLength < 500 && tapLength > 0) {
        this.selectWordAtPoint(e.changedTouches[0]);
        e.preventDefault();
      }
      
      lastTap = currentTime;
      this.isSelecting = false;
    });

    // Pinch to zoom (for large documents)
    let initialDistance = 0;
    editorElement.addEventListener('touchstart', (e: TouchEvent) => {
      if (e.touches.length === 2) {
        initialDistance = this.getDistance(e.touches[0], e.touches[1]);
      }
    });

    editorElement.addEventListener('touchmove', (e: TouchEvent) => {
      if (e.touches.length === 2) {
        const currentDistance = this.getDistance(e.touches[0], e.touches[1]);
        const scale = currentDistance / initialDistance;
        
        if (scale > 1.2) {
          this.increaseFontSize();
          initialDistance = currentDistance;
        } else if (scale < 0.8) {
          this.decreaseFontSize();
          initialDistance = currentDistance;
        }
      }
    });
  }

  private setupVirtualKeyboard() {
    // Handle virtual keyboard appearance
    const viewport = document.querySelector('meta[name=viewport]');
    if (viewport) {
      viewport.setAttribute('content', 
        'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no'
      );
    }

    // Adjust editor height when keyboard appears
    window.addEventListener('resize', () => {
      if (this.isVirtualKeyboardOpen()) {
        this.adjustForKeyboard();
      }
    });
  }

  private selectWordAtPoint(touch: Touch) {
    const range = document.caretRangeFromPoint(touch.clientX, touch.clientY);
    if (range) {
      const selection = window.getSelection();
      if (selection) {
        // Expand to word boundaries (fallback for browsers without expand)
        try {
          (range as any).expand('word');
        } catch {
          // Fallback: select current word manually
          const text = range.toString();
          if (text) {
            const startContainer = range.startContainer;
            const textContent = startContainer.textContent || '';
            const offset = range.startOffset;
            
            // Find word boundaries
            let start = offset;
            let end = offset;
            
            while (start > 0 && /\w/.test(textContent[start - 1])) start--;
            while (end < textContent.length && /\w/.test(textContent[end])) end++;
            
            range.setStart(startContainer, start);
            range.setEnd(startContainer, end);
          }
        }
        selection.removeAllRanges();
        selection.addRange(range);
        
        // Show formatting toolbar
        this.showMobileToolbar();
      }
    }
  }

  private showMobileToolbar() {
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed) return;

    const toolbar = document.createElement('div');
    toolbar.className = 'mobile-format-toolbar';
    toolbar.style.cssText = `
      position: absolute;
      background: #333;
      color: white;
      padding: 8px;
      border-radius: 6px;
      display: flex;
      gap: 8px;
      z-index: 1000;
      box-shadow: 0 2px 10px rgba(0,0,0,0.3);
    `;

    const buttons = [
      { text: 'B', action: () => document.execCommand('bold') },
      { text: 'I', action: () => document.execCommand('italic') },
      { text: 'U', action: () => document.execCommand('underline') }
    ];

    buttons.forEach(btn => {
      const button = document.createElement('button');
      button.textContent = btn.text;
      button.style.cssText = `
        background: transparent;
        border: 1px solid #555;
        color: white;
        padding: 6px 10px;
        border-radius: 4px;
        font-weight: bold;
      `;
      button.addEventListener('click', btn.action);
      toolbar.appendChild(button);
    });

    // Position toolbar above selection
    const rect = selection.getRangeAt(0).getBoundingClientRect();
    toolbar.style.left = `${rect.left}px`;
    toolbar.style.top = `${rect.top - 50}px`;

    document.body.appendChild(toolbar);

    // Remove toolbar after 3 seconds or on next touch
    setTimeout(() => toolbar.remove(), 3000);
    document.addEventListener('touchstart', () => toolbar.remove(), { once: true });
  }

  private getDistance(touch1: Touch, touch2: Touch): number {
    const dx = touch1.clientX - touch2.clientX;
    const dy = touch1.clientY - touch2.clientY;
    return Math.sqrt(dx * dx + dy * dy);
  }

  private increaseFontSize() {
    const currentSize = parseInt(getComputedStyle(this.editor.editor).fontSize);
    this.editor.editor.style.fontSize = `${Math.min(currentSize + 2, 24)}px`;
  }

  private decreaseFontSize() {
    const currentSize = parseInt(getComputedStyle(this.editor.editor).fontSize);
    this.editor.editor.style.fontSize = `${Math.max(currentSize - 2, 12)}px`;
  }

  private isVirtualKeyboardOpen(): boolean {
    return window.innerHeight < screen.height * 0.75;
  }

  private adjustForKeyboard() {
    const keyboardHeight = screen.height - window.innerHeight;
    this.editor.container.style.paddingBottom = `${keyboardHeight}px`;
  }
}
