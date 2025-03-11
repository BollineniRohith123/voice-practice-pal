import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    port: 8080,
    cors: {
      origin: '*',
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'Origin', 'Accept', 'X-API-Key'],
    },
    proxy: {
      '/api/ultravox': {
        target: 'https://api.ultravox.ai',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/api\/ultravox/, '/api'),
        configure: (proxy, options) => {
          proxy.on('proxyReq', (proxyReq, req, res) => {
            console.log(`Proxying request to: ${proxyReq.path}`);
            // Add X-API-Key header to proxy request
            const apiKey = process.env.VITE_ULTRAVOX_API_KEY;
            if (apiKey) {
              proxyReq.setHeader('X-API-Key', apiKey);
            }
          });
        }
      }
    }
  },
  plugins: [
    react(),
    mode === 'development' && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  envDir: '.',
  define: {
    'process.env': {},
  },
}));
