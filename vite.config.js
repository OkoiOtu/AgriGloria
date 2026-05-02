import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteStaticCopy } from 'vite-plugin-static-copy'

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'root-redirect',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (req.url === '/' || req.url === '') {
            res.writeHead(302, { Location: '/AgriGloria/' })
            res.end()
          } else {
            next()
          }
        })
      },
    },
    viteStaticCopy({
      targets: [
        { src: 'assets/images/*', dest: 'assets/images' },
        { src: 'assets/gallery/*', dest: 'assets/gallery' },
        { src: 'assets/videos/*', dest: 'assets/videos' },
      ],
    }),
  ],
  base: '/AgriGloria/',
  server: {
    fs: { allow: ['.'] },
    hmr: { path: '/hmr' },
  },
})
