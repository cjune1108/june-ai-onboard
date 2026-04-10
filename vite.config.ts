import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    /** 固定端口，避免多开 Vite 时静默换端口（例如 5173→5178）误以为还是同一进程 */
    port: 5178,
    strictPort: true,
    /** Dev：减少浏览器强缓存旧 chunk 导致文案不更新的情况 */
    headers: {
      "Cache-Control": "no-store",
    },
  },
});
