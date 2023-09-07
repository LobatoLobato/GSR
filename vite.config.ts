import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import express from "./plugins/vite/express.vite.plugin";
import html from "./plugins/vite/html.vite.plugin";
import path from "path";

const cwd = process.cwd();

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [html(), react(), express(path.join(cwd, "api"))],
  resolve: {
    alias: {
      "@api": path.join(cwd, "api"),
      "@web": path.join(cwd, "web"),
      "@shared": path.join(cwd, "shared"),
    },
  },
  // define: {
  //   'process.env': process.env
  // },
  root: cwd,
  build: { outDir: path.join(cwd, "dist", "web"), emptyOutDir: true },
});
