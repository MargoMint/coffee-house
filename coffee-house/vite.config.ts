import { defineConfig } from 'vite';

export default defineConfig({
  root: '.',
  build: {
    rollupOptions: {
      input: {
        index: 'index.html',
        menu: 'menu.html',
      },
    },
    outDir: 'dist',
  },
  server: {
    open: true,
  },
});
