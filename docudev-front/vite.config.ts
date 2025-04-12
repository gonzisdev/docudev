import path, { dirname } from 'path'
import { defineConfig } from 'vite'
import { fileURLToPath } from 'url'
import react from '@vitejs/plugin-react-swc'
import svgr from 'vite-plugin-svgr'

// https://vite.dev/config/
export default defineConfig({
	plugins: [
		react(),
		svgr({
			svgrOptions: {
				exportType: 'named',
				ref: true,
				svgo: true,
				titleProp: true
			},
			include: '**/*.svg'
		})
	],
	resolve: {
		alias: {
			assets: path.resolve(dirname(fileURLToPath(import.meta.url)), './src/assets'),
			components: path.resolve(dirname(fileURLToPath(import.meta.url)), './src/components'),
			constants: path.resolve(dirname(fileURLToPath(import.meta.url)), './src/constants'),
			hooks: path.resolve(dirname(fileURLToPath(import.meta.url)), './src/hooks'),
			models: path.resolve(dirname(fileURLToPath(import.meta.url)), './src/models'),
			services: path.resolve(dirname(fileURLToPath(import.meta.url)), './src/services'),
			utils: path.resolve(dirname(fileURLToPath(import.meta.url)), './src/utils'),
			stores: path.resolve(dirname(fileURLToPath(import.meta.url)), './src/stores'),
			layouts: path.resolve(dirname(fileURLToPath(import.meta.url)), './src/layouts'),
			styles: path.resolve(dirname(fileURLToPath(import.meta.url)), './src/styles'),
			mock: path.resolve(dirname(fileURLToPath(import.meta.url)), './src/mock')
		}
	}
})
