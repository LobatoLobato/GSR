/**
 * Pre-start is where we want to place things that must run BEFORE the express
 * server is started. This is useful for environment variables, command-line
 * arguments, and cron-jobs.
 */

// NOTE: DO NOT IMPORT ANY SOURCE CODE HERE
import path from "path";
import { parse } from "ts-command-line-args";
import dotenv from "dotenv";
import fs from "node:fs";

// **** Setup **** //

// Command line arguments
const { env } = parse<{
  env: string;
  host?: string;
  logLevel?: string;
  debug?: boolean;
}>({
  env: {
    type: String,
    defaultValue: "development",
    alias: "e",
  },
  host: { optional: true, type: String },
  logLevel: { optional: true, type: String, alias: "l" },
  debug: { optional: true, type: Boolean, alias: "d" },
});

// Set the env file
if (fs.existsSync(path.join(process.cwd(), "env"))) {
  const { error } = dotenv.config({
    path: path.join(process.cwd(), "env", `${env}.env`),
  });
  if (error) throw error;
} else {
  dotenv.config();
}
