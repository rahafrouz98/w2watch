import { defineConfig } from "vite";

export default defineConfig({
  server: {
    proxy: {
      "/start": "http://localhost:3000"
    }
  }
});