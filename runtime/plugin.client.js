import { ArmorEditor } from 'armor-editor'
import { defineNuxtPlugin } from '#app'

export default defineNuxtPlugin(() => {
  return {
    provide: {
      armorEditor: ArmorEditor
    }
  }
})
