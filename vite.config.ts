import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import tailwindcss from "@tailwindcss/vite";
// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [["babel-plugin-react-compiler"]],
      },
    }),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: true, // 或者使用 '0.0.0.0'
    port: 5173,
    proxy: {
      "/desktop": {
        target: "http://47.98.234.82:8000", // 后端服务地址
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/desktop/, "/desktop"),
        ws: true,
      },
    },
  },
});
