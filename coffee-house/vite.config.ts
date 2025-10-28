import { defineConfig } from 'vite';

export default defineConfig({
  root: '.',
  build: {
    rollupOptions: {
      input: {
        index: 'index.html',
        menu: 'menu.html',
        cart: 'cart.html',
        signin: 'signin.html',
        registration: 'registration.html',
      },
    },
    outDir: 'dist',
  },
  server: {
    open: true,
  },
});
