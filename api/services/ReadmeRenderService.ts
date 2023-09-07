import { prisma } from "@api/models/prisma";
import { Benchmark } from "@api/models/Benchmarker";
import FetchService from "./FetchService";
import { GitHubData } from "@api/types/github";
import { GSRSVGRenderer } from "@api/models/SVGRenderer";

async function renderWithBenchmark(options: {
  username: string;
  code?: string;
  githubData?: GitHubData;
  preview?: boolean;
  height?: number;
}) {
  const benchmarker = new Benchmark("README_Render");
  benchmarker.start("Total");
  const { preview, username, height } = options;
  let { code } = options;

  if (!code) {
    benchmarker.start("DB_Access");
    const user = await prisma.user.findFirst({
      where: { github_username: options.username },
    });
    benchmarker.end("DB_Access", 2);

    if (!user) throw new Error("User not found");
    code = user.code;
  }

  benchmarker.write("Fetching:", 2);
  benchmarker.start("Fetching_Total");
  const [imageRecord, githubData] = await Promise.all([
    (async () => {
      benchmarker.start("Fetch_Images");
      const imageRecord = await FetchService.fetchImages(code);
      benchmarker.end("Fetch_Images", 4);
      return imageRecord;
    })(),
    (async () => {
      benchmarker.start("Fetch_GithubData");
      const githubData = options.githubData ?? (await FetchService.fetchGithubData(username));
      benchmarker.end("Fetch_GithubData", 4);
      return githubData;
    })(),
  ]);
  benchmarker.end("Fetching_Total", 4);

  benchmarker.start("Rendering");
  const { renderedXhtml: renderedReadme, cssVariables } = await GSRSVGRenderer.render({
    xhtml: code,
    githubData,
    imageRecord,
    preview,
    height
  });
  benchmarker.end("Rendering", 2);
  benchmarker.end("Total");
  return { renderedReadme, cssVariables };
}

async function render(options: {
  username: string;
  height?: number;
  code?: string;
  githubData?: GitHubData;
  preview?: boolean;
}) {
  const { preview, username, height } = options;
  let { code } = options;

  if (!code) {
    const user = await prisma.user.findFirst({
      where: { github_username: options.username },
    });
    if (!user) throw new Error("User not found");
    code = user.code;
  }

  const [imageRecord, githubData] = await Promise.all([
    FetchService.fetchImages(code),
    options.githubData ?? FetchService.fetchGithubData(username),
  ]);

  const { renderedXhtml: renderedReadme, cssVariables } = await GSRSVGRenderer.render({
    xhtml: code,
    githubData,
    imageRecord,
    preview,
    height
  });

  return { renderedReadme, cssVariables };
}

export default { render, renderWithBenchmark };
