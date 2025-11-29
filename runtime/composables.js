import { ref, onMounted, onBeforeUnmount, nextTick, readonly } from 'vue'

export const useArmorEditor = (options = {}) => {
  const editorRef = ref()
  const editor = ref(null)
  const content = ref('')
  const isReady = ref(false)

  const initEditor = async () => {
    if (!editorRef.value) return

    await nextTick()

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
