<template>
  <div>
    <div v-if="!isReady && showLoading" class="armor-editor-loading">
      <slot name="loading">Loading editor...</slot>
    </div>
    <div 
      ref="editorRef" 
      :style="{ 
        opacity: isReady ? 1 : 0,
        transition: 'opacity 0.3s ease',
        minHeight: height
      }"
    ></div>
  </div>
</template>

<script setup>
import { watch } from 'vue'
import { useArmorEditor } from '../composables'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  height: {
    type: String,
    default: '300px'
  },
  theme: {
    type: String,
    default: 'light',
    validator: (value) => ['light', 'dark'].includes(value)
  },
  placeholder: {
    type: String,
    default: ''
  },
  toolbar: {
    type: [Boolean, Array],
    default: true
  },
  spellCheck: {
    type: Boolean,
    default: false
  },
  collaboration: {
    type: Object,
    default: null
  },
  trackChanges: {
    type: Boolean,
    default: false
  },
  comments: {
    type: Boolean,
    default: false
  },
  wordCount: {
    type: Boolean,
    default: false
  },
  autoSave: {
    type: Object,
    default: null
  },
  mentions: {
    type: Object,
    default: null
  },
  showLoading: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['update:modelValue', 'ready', 'change'])

const {
  editorRef,
  editor,
  content,
  isReady,
  setContent,
  getContent,
  focus
} = useArmorEditor({
  height: props.height,
  theme: props.theme,
  placeholder: props.placeholder,
  toolbar: props.toolbar,
  spellCheck: props.spellCheck,
  collaboration: props.collaboration,
  trackChanges: props.trackChanges,
  comments: props.comments,
  wordCount: props.wordCount,
  autoSave: props.autoSave,
  mentions: props.mentions,
  onChange: (newContent) => {
    emit('update:modelValue', newContent)
    emit('change', newContent)
  },
  onReady: () => {
    if (props.modelValue) {
      setContent(props.modelValue)
    }
    emit('ready', editor.value)
  }
})

// Watch for external content changes
watch(() => props.modelValue, (newValue) => {
  if (newValue !== content.value) {
    setContent(newValue)
  }
})

// Expose methods for template refs
defineExpose({
  editor,
  setContent,
  getContent,
  focus,
  isReady
})
</script>

<style scoped>
.armor-editor-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100px;
  color: #666;
  font-style: italic;
}
</style>
