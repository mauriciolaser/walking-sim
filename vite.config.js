import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  base: '/',
    server: {
    headers: {
      // Permite postMessage desde ventanas emergentes
      'Cross-Origin-Opener-Policy': 'same-origin-allow-popups',
      // Desactiva temporalmente el requirement de corporate resources
      'Cross-Origin-Embedder-Policy': 'unsafe-none'
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: (content, filename) => {
          // filename puede venir undefined en algunos pasos, protejemos
          const file = filename ? filename.replace(/\\/g, '/') : '';
          // Si es justo nuestro index.scss, no inyectamos para evitar bucle
          if (file.endsWith('/src/styles/index.scss')) {
            return content;
          }
          // Calculamos ruta POSIX absoluta a index.scss
          const root = __dirname.replace(/\\/g, '/');
          const injectPath = `${root}/src/styles/index.scss`;
          return `@import "${injectPath}";\n${content}`;
        },
      },
    },
  },
});
