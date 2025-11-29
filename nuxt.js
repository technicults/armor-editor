import { defineNuxtModule, addPlugin, createResolver, addImports, addComponent } from '@nuxt/kit'

export default defineNuxtModule({
  meta: {
    name: 'armor-editor',
    configKey: 'armorEditor',
    compatibility: {
      nuxt: '^3.0.0'
    }
  },
  defaults: {
    // Default configuration
    autoImport: true,
    ssr: false,
    css: true
  },
  setup(options, nuxt) {
    const resolver = createResolver(import.meta.url)

    // Add auto-imports
    if (options.autoImport) {
      // Import the main class
      addImports([
        {
          name: 'ArmorEditor',
          from: 'armor-editor'
        },
        {
          name: 'VERSION',
          from: 'armor-editor'
        }
      ])

      // Import composables
      addImports([
        {
          name: 'useArmorEditor',
          from: resolver.resolve('./runtime/composables.js')
        }
      ])

      // Register components
      addComponent({
        name: 'ArmorEditor',
        filePath: resolver.resolve('./runtime/components/ArmorEditor.vue')
      })
    }

    // Add plugin for global registration
    addPlugin({
      src: resolver.resolve('./runtime/plugin.client.js'),
      mode: 'client'
    })

    // Configure SSR
    if (!options.ssr) {
      nuxt.options.ssr = nuxt.options.ssr && false
    }

    // Add type declarations
    nuxt.hook('prepare:types', (opts) => {
      opts.references.push({
        path: resolver.resolve('./module.d.ts')
      })
    })
  }
})
