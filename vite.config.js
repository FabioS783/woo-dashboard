import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  const isProd = mode === 'production';

  return {
    plugins: [react()],
    
    // Configurazione base
    base: './',
    
    // Risoluzione dei path
    resolve: {
      alias: {
        '@': resolve(__dirname, './src'),
      },
    },

    // Configurazione build
    build: {
      // Directory di output
      outDir: 'dist',
      
      // Genera sourcemaps solo in sviluppo
      sourcemap: !isProd,
      
      // Ottimizzazioni per la build di produzione
      minify: isProd ? 'esbuild' : false,
      
      // Ottimizzazioni chunks
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom'],
            charts: ['recharts'],
          },
          // Organizzazione file di output
          chunkFileNames: isProd ? 'js/[hash].js' : 'js/[name].js',
          entryFileNames: isProd ? 'js/[hash].js' : 'js/[name].js',
          assetFileNames: isProd ? 'assets/[hash][extname]' : 'assets/[name][extname]',
        },
      },
      
      // Ottimizzazioni CSS
      cssCodeSplit: true,
      
      // Compressione assets
      assetsInlineLimit: 4096,
    },

    // Server di sviluppo
    server: {
      port: 5173,
      strictPort: true,
      host: true,
      open: true,
    },

    // Configurazione preview
    preview: {
      port: 4173,
      strictPort: true,
      host: true,
      open: true,
    },

    // Ottimizzazioni performance
    optimizeDeps: {
      include: ['react', 'react-dom', 'recharts'],
    },

    // Gestione variabili d'ambiente
    envPrefix: 'VITE_',
  };
});