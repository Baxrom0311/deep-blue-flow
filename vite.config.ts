import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [react(), {
    name: 'optional-site-verification',
    transformIndexHtml() {
      const value = process.env.VITE_GOOGLE_SITE_VERIFICATION || loadEnv(mode, process.cwd()).VITE_GOOGLE_SITE_VERIFICATION;
      return value ? [{ tag: 'meta', attrs: { name: 'google-site-verification', content: value }, injectTo: 'head' as const }] : [];
    },
  }],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
