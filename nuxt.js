import { defineNuxtModule, addPlugin, addComponent, createResolver } from '@nuxt/kit'

export default defineNuxtModule({
  meta: {
    name: 'armor-editor',
    configKey: 'armorEditor'
  },
  defaults: {},
  setup(options, nuxt) {
    const resolver = createResolver(import.meta.url)

    // Add the client plugin
    addPlugin({
      src: resolver.resolve('./runtime/plugin.client.js'),
      mode: 'client'
    })

    // Register the ArmorEditor component
    addComponent({
      name: 'ArmorEditor',
      filePath: resolver.resolve('./runtime/components/ArmorEditor.vue')
    })

    // Auto-import composables
    nuxt.hook('imports:dirs', (dirs) => {
      dirs.push(resolver.resolve('./runtime'))
    })
  }
})
