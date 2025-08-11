import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
export default defineConfig({
    plugins: [react()],
    build: {
        target: 'es2015',
        minify: 'esbuild',
        sourcemap: false,
        rollupOptions: {
            output: {
                manualChunks: {
                    vendor: ['react', 'react-dom'],
                }
            }
        }
    },
    server: {
        port: 5555,
        host: '0.0.0.0',
        strictPort: true
    },
    preview: {
        port: 3000,
        host: true
    }
});
