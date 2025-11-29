declare module '@nuxt/schema' {
  interface NuxtConfig {
    armorEditor?: {
      /**
       * Enable auto-imports for ArmorEditor
       * @default true
       */
      autoImport?: boolean
      
      /**
       * Enable SSR support
       * @default false
       */
      ssr?: boolean
      
      /**
       * Include default CSS
       * @default true
       */
      css?: boolean
    }
  }
}

declare module '#app' {
  interface NuxtApp {
    $armorEditor: typeof import('armor-editor').ArmorEditor
  }
}

export {}
