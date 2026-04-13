import path from 'node:path'
import { fileURLToPath } from 'node:url'
import react from '@vitejs/plugin-react-swc'
import { defineConfig } from 'vite'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      // No-op hook: use SWC for production JSX (Vite 8 deprecates the plugin’s default
      // top-level `esbuild` JSX settings when this is unset). @vitejs/plugin-react-swc 4.2.0+.
      useAtYourOwnRisk_mutateSwcOptions() {},
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    target: 'es2022',
  },
})
