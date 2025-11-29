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
    if (editor.value) {
      editor.value.setContent(html)
    }
    content.value = html
  }

  const getContent = () => {
    return editor.value ? editor.value.getContent() : content.value
  }

  const focus = () => {
    editor.value?.focus()
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
    initEditor
  }
}
