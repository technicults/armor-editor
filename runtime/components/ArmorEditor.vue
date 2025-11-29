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
  width: {
    type: String,
    default: '100%'
  },
  theme: {
    type: String,
    default: 'light'
  },
  placeholder: {
    type: String,
    default: ''
  },
  toolbar: {
    type: [Boolean, Array],
    default: true
  },
  readOnly: {
    type: Boolean,
    default: false
  },
  spellCheck: {
    type: Boolean,
    default: false
  },
  collaboration: {
    type: Object,
    default: null
  },
  ai: {
    type: Object,
    default: null
  },
  autoSave: {
    type: Object,
    default: null
  },
  mobile: {
    type: Object,
    default: null
  },
  analytics: {
    type: Object,
    default: null
  },
  // Enterprise Security
  encryption: {
    type: Object,
    default: null
  },
  sso: {
    type: Object,
    default: null
  },
  compliance: {
    type: Object,
    default: null
  },
  permissions: {
    type: Object,
    default: null
  },
  // Advanced Media
  voiceComments: {
    type: Object,
    default: null
  },
  videoIntegration: {
    type: Object,
    default: null
  },
  mediaEditor: {
    type: Object,
    default: null
  },
  // Next-Gen Architecture
  webComponents: {
    type: Object,
    default: null
  },
  localAI: {
    type: Object,
    default: null
  },
  wasm: {
    type: Object,
    default: null
  },
  // Workflow Management
  workflow: {
    type: Object,
    default: null
  },
  versioning: {
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
  encryptContent,
  startVoiceRecording,
  startVideoCall,
  submitForApproval,
  createBranch
} = useArmorEditor({
  height: props.height,
  width: props.width,
  theme: props.theme,
  placeholder: props.placeholder,
  toolbar: props.toolbar,
  readOnly: props.readOnly,
  spellCheck: props.spellCheck,
  collaboration: props.collaboration,
  ai: props.ai,
  autoSave: props.autoSave,
  mobile: props.mobile,
  analytics: props.analytics,
  encryption: props.encryption,
  sso: props.sso,
  compliance: props.compliance,
  permissions: props.permissions,
  voiceComments: props.voiceComments,
  videoIntegration: props.videoIntegration,
  mediaEditor: props.mediaEditor,
  webComponents: props.webComponents,
  localAI: props.localAI,
  wasm: props.wasm,
  workflow: props.workflow,
  versioning: props.versioning,
  onChange: (newContent) => {
    emit('update:modelValue', newContent)
    emit('change', newContent)
  },
  onReady: () => {
    emit('ready', editor.value)
  }
})

// Watch for external content changes
watch(() => props.modelValue, (newValue) => {
  if (newValue !== content.value) {
    setContent(newValue)
  }
})

// Set initial content
watch(isReady, (ready) => {
  if (ready && props.modelValue) {
    setContent(props.modelValue)
  }
})

// Expose enterprise methods
defineExpose({
  editor,
  setContent,
  getContent,
  encryptContent,
  startVoiceRecording,
  startVideoCall,
  submitForApproval,
  createBranch
})
</script>

<style scoped>
.armor-editor-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  color: #666;
  font-size: 14px;
}
</style>
