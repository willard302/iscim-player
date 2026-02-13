// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,
  compatibilityDate: '2025-07-15',
  css: [
    '~/assets/scss/main.scss',
    '~/assets/scss/_vant.scss'
  ],
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/supabase',
    '@vant/nuxt',
    '@pinia/nuxt',
    'pinia-plugin-persistedstate/nuxt',
    '@nuxtjs/i18n'
  ],
  supabase: {
    redirect: false,
    types: '~/types/database.types.ts'
  },
  vant: {
    defaultLocale: 'zh-TW'
  },
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `
            @use "@/assets/scss/_variables.scss" as *;
            @use "@/assets/scss/_mixins.scss" as *;
          `
        }
      }
    }
  },
  imports: {
    dirs: ['app/stores']
  },
  plugins: [
    {src: '~/plugins/vant.client.ts', mode: 'client' }
  ],
  i18n: {
    defaultLocale: 'tw',
    locales: [
      {code: 'en', name: 'English', file: 'en.ts'},
      {code: 'tw', name: '繁體中文', file: 'tw.ts'}
    ]
  }
})