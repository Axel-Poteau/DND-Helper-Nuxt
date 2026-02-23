// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-01-01',
  devtools: { enabled: true },

  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxtjs/google-fonts',
  ],

  googleFonts: {
    families: {
      Cinzel: [400, 700],
      Lora: [400, 700],
    },
    display: 'swap',
  },

  css: ['~/assets/css/main.css'],

  runtimeConfig: {
    trollsApiToken: '', // Set via NUXT_TROLLS_API_TOKEN env var
  },

  app: {
    head: {
      title: 'D&D Spellbook',
      htmlAttrs: { lang: 'fr' },
      meta: [
        { name: 'description', content: 'Gérez vos emplacements de sorts' },
      ],
    },
  },
})
