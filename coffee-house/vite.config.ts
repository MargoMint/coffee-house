import { defineConfig } from 'vitest/config';

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
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/tests/setup.ts',

    coverage: {
      provider: 'v8',
      include: ['src/**/*.ts'],
      exclude: [
        'src/ts/index-home.ts',
        'src/ts/index-menu.ts',
        'src/ts/quiz-data.ts',
        'src/ts/types.ts',
        'src/utils/category-data.ts',
        'src/utils/cities-data.ts',
        'src/utils/products-data.ts',
      ],
      reporter: ['text', 'html'],
      thresholds: {
        statements: 70,
      },
    },
  },
});
