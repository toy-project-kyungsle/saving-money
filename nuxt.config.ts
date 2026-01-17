// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  app: {
    head: {
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
      ],
    },
  },

  modules: [
    '@pinia/nuxt',
    '@nuxtjs/tailwindcss',
    'nuxt-echarts',
  ],

  runtimeConfig: {
    public: {
      supabaseUrl: process.env.SUPABASE_URL || '',
      supabaseKey: process.env.SUPABASE_ANON_KEY || '',
    },
  },

  echarts: {
    renderer: 'canvas',
    charts: ['PieChart', 'BarChart'],
    components: ['TitleComponent', 'TooltipComponent', 'LegendComponent', 'GridComponent'],
  },
})