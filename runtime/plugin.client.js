import { ArmorEditor } from 'armor-editor'

export default defineNuxtPlugin(() => {
  return {
    provide: {
      armorEditor: ArmorEditor
    }
  }
})
