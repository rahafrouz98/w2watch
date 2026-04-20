import { defineConfig } from "vite";

export default defineConfig({
  server: {
    proxy: {
      "/vector": "http://localhost:3000",
      "/llm":"http://localhost:3000",
      "/image": "http://localhost:3000"
    }
  }
});