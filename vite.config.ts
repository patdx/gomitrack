import { reactRouter } from '@react-router/dev/vite'
import tailwindcss from '@tailwindcss/vite'
import AutoImport from 'unplugin-auto-import/vite'
import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'
import { cloudflare } from '@cloudflare/vite-plugin'

export default defineConfig({
	plugins: [
		AutoImport({
			imports: ['react'],
		}),
		cloudflare({ viteEnvironment: { name: 'ssr' } }),
		tailwindcss(),
		reactRouter(),
		tsconfigPaths(),
	],
	server: {
		watch: {
			ignored: ['**/.wireit/**'],
		},
	},
})
