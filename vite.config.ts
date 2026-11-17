import { defineConfig, pluginIsland, pluginSsg } from 'minista'

export default defineConfig({
  base: process.env.PAGES_BASE_PATH || '/',
  plugins: [pluginSsg(), pluginIsland()],
})
