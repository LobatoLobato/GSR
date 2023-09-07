// rollup.config.js
import { defineConfig } from "rollup";
import typescript from "@rollup/plugin-typescript";
import terser from "@rollup/plugin-terser";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import html from "rollup-plugin-html-string";
import alias from "@rollup/plugin-alias";
import assets from "./plugins/rollup/assets.rollup.plugin.js";

import process from "node:process";
import path from "node:path";
import fs from "node:fs";

export default defineConfig(() => {
  const cwd = process.cwd();
  const outDir = path.join(cwd, "dist", "api");

  function buildAliases(aliases) {
    return {
      entries: Object.entries(aliases).reduce((acc, [find, replacement]) => {
        return [...acc, { find, replacement }];
      }, []),
    };
  }

  const aliases = buildAliases({
    "@api": path.join(cwd, "dist/api"),
    "@shared": path.join(cwd, "shared"),
  });

  if (fs.existsSync(outDir)) {
    fs.rmSync(outDir, { force: true, recursive: true });
  }

  return {
    input: "api/index.ts",
    output: {
      format: "cjs",
      file: path.join(outDir, "bundle.cjs"),
      inlineDynamicImports: true,
    },
    plugins: [
      assets({ assets: ["api/assets"], verbose: true }),
      typescript(),
      commonjs(),
      alias(aliases),
      json(),
      html(),
      terser(),
    ],
    logLevel: "silent",
  };
});
