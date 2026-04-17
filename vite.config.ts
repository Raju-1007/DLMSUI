// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'
// export default defineConfig({ plugins:[react()], server:{ port:5173, host:true } })


import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill'

export default defineConfig({
  plugins: [react()],

  server: {
    port: 5173,
    host: true,
    allowedHosts: true
  },

  preview: {
    port: 5173,
    host: true,
    allowedHosts: true
  },

  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: "globalThis"
      },
      plugins: [
        NodeGlobalsPolyfillPlugin({
          buffer: true
        })
      ]
    }
  }

})
