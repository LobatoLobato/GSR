import { octokit } from "./octokit";
interface StatsQueryResponse {
  user: {
    contributionsCollection: {
      totalCommitContributions: number;
    };
    pullRequests: {
      totalCount: number;
    };
    issues: {
      totalCount: number;
    };
    repositoriesContributedTo: {
      totalCount: number;
    };
    repositories: {
      nodes: [
        {
          stargazerCount: number;
        },
      ];
    };
  };
}
interface GithubStats {
  starsEarned: number;
  commits: number;
  issues: number;
  PRs: number;
  contributedTo: number;
}
async function fetchStats(username: string): Promise<GithubStats> {
  const request: StatsQueryResponse = await octokit.graphql({
    query: `query ($username: String!) {
      user(login: $username) {
        contributionsCollection {
          totalCommitContributions
        }
        pullRequests {
          totalCount
        }
        issues {
          totalCount
        }
        repositoriesContributedTo(includeUserRepositories: false) {
          totalCount
        }
        repositories(first: 100) {
          nodes {
            stargazerCount
          }
        }
      }
      }`,
    username,
  });
  const repos = request.user.repositories.nodes;
  const contributionsCollection = request.user.contributionsCollection;
  const issues = request.user.issues;
  const pullRequests = request.user.pullRequests;
  const contributedTo = request.user.repositoriesContributedTo;
  return {
    starsEarned: repos.reduce((acc, repo) => acc + repo.stargazerCount, 0),
    commits: contributionsCollection.totalCommitContributions,
    issues: issues.totalCount,
    PRs: pullRequests.totalCount,
    contributedTo: contributedTo.totalCount,
  };
}

export { fetchStats };
export type { GithubStats };
