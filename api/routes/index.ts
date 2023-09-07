import express from "express";
import ReadmeRenderService from "@api/services/ReadmeRenderService";
import userRouter from "./user";
import { TIMES } from "@api/constants/times";

const apiRouter = express.Router();

apiRouter.get("/render", async (req, res) => {
  const username = req.query.username as string | undefined;
  const height = req.query.height as number | undefined;
  if (!username) return res.status(404).send("Burrao");

  res.setHeader("Content-Type", "image/svg+xml");
  res.setHeader("Cache-Control", `public, max-age=${TIMES.FOUR_HOURS}`);
  try {
    if (process.env.BENCHMARK) {
      const { renderedReadme } = await ReadmeRenderService.renderWithBenchmark({ username, height });
      return res.send(renderedReadme);
    }

    const { renderedReadme } = await ReadmeRenderService.render({ username, height });
    return res.send(renderedReadme);
  } catch (err) {
    return res.send(JSON.stringify(err));
  }
});

apiRouter.use("/user", userRouter);

export default apiRouter;
