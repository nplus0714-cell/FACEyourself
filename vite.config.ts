import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react()],
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      },
      build: {
        rollupOptions: {
          output: {
            manualChunks(id) {
              if (!id.includes('node_modules')) return;
              if (id.includes('react-dom') || id.includes('/react/')) return 'react-vendor';
              if (id.includes('@supabase') || id.includes('iceberg-js')) return 'supabase-vendor';
              if (id.includes('recharts')) return 'charts-vendor';
              if (id.includes('react-markdown') || id.includes('remark-') || id.includes('unified')) return 'markdown-vendor';
            },
          },
        },
      },
});
