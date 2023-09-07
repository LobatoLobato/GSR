import type { Request, Response, NextFunction } from "express";
export default function express(path: string, varName: string = "app") {
  return {
    name: "vite3-plugin-express",
    configureServer: async (svr: import("vite").ViteDevServer) => {
      async function handler(req: Request, res: Response, next: NextFunction) {
        process.env["VITE"] = "true";

        try {
          (await svr.ssrLoadModule(path))[varName](req, res, next);
        } catch (err) {
          console.error(err);
        }
      }

      svr.middlewares.use(handler);
    },
  };
}
