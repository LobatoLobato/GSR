// rollup-plugin-prisma.js
import process from "node:process";
import path from "node:path";
import fs from "node:fs/promises";

/**
 * @param options {{ hook: string, verbose: boolean, outDir: string }}
 * @returns {import("rollup").Plugin}
 */
export default function prisma(options = {}) {
  const bold = (string) => `\x1b[1m${string}\x1b[0m`;
  const green = (string) => `\x1b[32m${string}\x1b[0m`;
  const cwd = process.cwd();
  const {
    hook = "buildStart",
    outDir = options.outDir?.replace(/\//g, "\\") ?? "dist",
    verbose = false,
  } = options;

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

  return {
    name: "prisma",
    [hook]: {
      sequential: true,
      handler: async () => {
        /** Copying prisma files to target folder **/
        const schemaPath = path.join(cwd, "prisma", "schema.prisma");
        const enginesDir = path.join(cwd, "node_modules", "@prisma", "engines");

        const queryEngine = (await fs.readdir(enginesDir)).reduce(
          (acc, file) => (file.match(/.+?\.(dll)|(so)\.node/) ? file : acc),
          "",
        );
        const queryEnginePath = path.join(enginesDir, queryEngine);

        const schemaOutPath = path.join(cwd, outDir, "schema.prisma");
        const queryEngineOutPath = path.join(cwd, outDir, queryEngine);

        if (verbose) {
          console.log(green(`Copying necessary prisma files to ${outDir}...`));
        }

        await copyFile(schemaPath, schemaOutPath);
        await copyFile(queryEnginePath, queryEngineOutPath);
      },
    },
  };
}
