import { ref, onMounted, onBeforeUnmount, nextTick, readonly } from 'vue'

export const useArmorEditor = (options = {}) => {
  const editorRef = ref()
  const editor = ref(null)
  const content = ref('')
  const isReady = ref(false)

  const initEditor = async () => {
    if (!editorRef.value) return

    await nextTick()

    try {
      // Dynamic import for SSR safety
      const { ArmorEditor } = await import('armor-editor')

      editor.value = new ArmorEditor({
        container: editorRef.value,
        onChange: (newContent) => {
          content.value = newContent
          options.onChange?.(newContent)
        },
        onReady: () => {
          isReady.value = true
          options.onReady?.()
        },
        // Enterprise Security
        encryption: options.encryption,
        sso: options.sso,
        compliance: options.compliance,
        permissions: options.permissions,
        
        // Advanced Media
        voiceComments: options.voiceComments,
        videoIntegration: options.videoIntegration,
        mediaEditor: options.mediaEditor,
        
        // Next-Gen Architecture
        webComponents: options.webComponents,
        localAI: options.localAI,
        wasm: options.wasm,
        
        // Workflow Management
        workflow: options.workflow,
        versioning: options.versioning,
        
        // All other options
        ...options
      })

      // Fallback: Set ready after a short delay if onReady wasn't called
      setTimeout(() => {
        if (!isReady.value) {
          isReady.value = true
          options.onReady?.()
        }
      }, 1000)
    } catch (error) {
      console.error('Failed to initialize ArmorEditor:', error)
      // Set ready even on error to hide loading
      isReady.value = true
    }
  }

  const setContent = (html) => {
    if (editor.value && typeof html === 'string') {
      // Save cursor position
      const selection = window.getSelection()
      let range = null
      if (selection && selection.rangeCount > 0) {
        range = selection.getRangeAt(0).cloneRange()
      }
      
      editor.value.setContent(html)
      
      // Restore cursor position if possible
      if (range && selection) {
        try {
          selection.removeAllRanges()
          selection.addRange(range)
        } catch (e) {
          // Ignore errors - cursor will just be at end
        }
      }
    }
    content.value = html || ''
  }

  const getContent = () => {
    try {
      return editor.value ? editor.value.getContent() : content.value
    } catch (error) {
      console.warn('Failed to get content:', error)
      return content.value || ''
    }
  }

  const focus = () => {
    try {
      editor.value?.focus()
    } catch (error) {
      console.warn('Failed to focus editor:', error)
    }
  }

  // Enterprise methods
  const encryptContent = async (content) => {
    try {
      return await editor.value?.encryptContent(content)
    } catch (error) {
      console.warn('Failed to encrypt content:', error)
      return content
    }
  }

  const startVoiceRecording = () => {
    try {
      editor.value?.startVoiceRecording()
    } catch (error) {
      console.warn('Failed to start voice recording:', error)
    }
  }

  const startVideoCall = (participants) => {
    try {
      return editor.value?.startVideoCall(participants)
    } catch (error) {
      console.warn('Failed to start video call:', error)
    }
  }

  const submitForApproval = (stage) => {
    try {
      return editor.value?.submitForApproval(stage)
    } catch (error) {
      console.warn('Failed to submit for approval:', error)
    }
  }

  const createBranch = (name) => {
    try {
      return editor.value?.createBranch(name)
    } catch (error) {
      console.warn('Failed to create branch:', error)
    }
  }

  onMounted(() => {
    initEditor()
    
    // Force ready state after 2 seconds if still not ready
    setTimeout(() => {
      if (!isReady.value) {
        console.warn('ArmorEditor: Forcing ready state after timeout')
        isReady.value = true
      }
    }, 2000)
  })

  onBeforeUnmount(() => {
    editor.value?.destroy()
  })

  return {
    editorRef,
    editor,
    content: readonly(content),
    isReady: readonly(isReady),
    setContent,
    getContent,
    focus,
    initEditor,
    // Enterprise methods
    encryptContent,
    startVoiceRecording,
    startVideoCall,
    submitForApproval,
    createBranch
  }
}
