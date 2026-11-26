import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

const srcDir = decodeURIComponent(
  new URL('./src', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1'),
);

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': srcDir,
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
  },
});
