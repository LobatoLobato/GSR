// rollup-plugin-prisma.js
import process from "node:process";
import path from "node:path";
import fs from "node:fs/promises";

/**
 * @param {{ hook: string, verbose: boolean, assets: string[] outDir: string }} options
 * @returns {import("rollup").Plugin}
 */
export default function assets(options = {}) {
  const bold = (string) => `\x1b[1m${string}\x1b[0m`;
  const green = (string) => `\x1b[32m${string}\x1b[0m`;
  const cwd = process.cwd();
  const {
    outDir = options.outDir?.replace(/\//g, "\\") ?? "dist",
    hook = "buildStart",
    verbose = false,
    assets,
  } = options;

  if (!assets) throw new Error("No assets were provided");

  const copyFile = async (source, destination) => {
    try {
      await fs.cp(source, destination);

      source = source.replace(`${cwd}\\`, "");
      destination = destination.replace(`${cwd}\\`, "");
      if (verbose) {
        console.log(bold(green(`  ${source} -> ${destination}`)));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const copyDir = async (dirents) => {
    for (const dirent of dirents) {
      if (!dirent.isDirectory()) {
        const file = path.join(dirent.path, dirent.name);
        const relativePath = dirent.path.replace(cwd, "");
        const target = path.join(cwd, outDir, relativePath, dirent.name);

        await copyFile(file, target);
      } else {
        const dir = await fs.readdir(path.join(dirent.path, dirent.name), {
          withFileTypes: true,
        });
        await copyDir(dir);
      }
    }
  };

  return {
    name: "assets",
    [hook]: {
      sequential: true,
      handler: async () => {
        if (verbose) {
          console.log(green(`Copying assets to ${outDir}...`));
        }
        for (const asset of assets) {
          const assetPath = path.join(cwd, asset);
          const dir = await fs.readdir(assetPath, { withFileTypes: true });
          await copyDir(dir);
        }
      },
    },
  };
}
