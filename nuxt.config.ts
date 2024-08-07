// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: false },
  modules: [
    "@sidebase/nuxt-auth",
    "@nuxtjs/tailwindcss",
    "shadcn-nuxt",
    "@nuxt/image",
  ],
  runtimeConfig: {
    apiKey: process.env.API_KEY,
    bcrypt: {
      saltRounds: Number(process.env.BCRYPT_SALT_ROUNDS),
    },
    github: {
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    },
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    },
    auth: {
      secret: process.env.AUTH_SECRET,
    },
  },
  auth: {
    globalAppMiddleware: true,
    baseURL: process.env.AUTH_ORIGIN,
  },
  shadcn: {
    prefix: "",
    /**
     * Directory that the component lives in.
     * @default "./components/ui"
     */
    componentDir: "./components/ui",
  },
});
