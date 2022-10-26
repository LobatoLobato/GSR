import { Octokit } from "@octokit/core";

const octokit = new Octokit({
  auth: process.env.REACT_APP_GITHUB_PAT,
});

export { octokit };
