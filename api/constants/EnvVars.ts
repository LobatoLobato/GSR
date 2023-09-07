/**
 * Environments variables declared here.
 */

export default {
  NodeEnv: process.env.NODE_ENV ?? "",
  Port: process.env.PORT ?? 3000,
  Benchmark: process.env.BENCHMARK,
  Vite: process.env.VITE,
  GitHubPat: process.env.GITHUB_PERSONAL_ACCESS_TOKEN,
} as const;
