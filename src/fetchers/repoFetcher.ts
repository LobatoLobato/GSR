import { octokit } from "./octokit";

export type RepositoryList = {
  [key: string]: Repository;
};
export type Repository = {
  name: string;
  nameWithOwner: string;
  primaryLanguage: {
    color: string;
    name: string;
  };
  description: string;
  stargazerCount: number;
  forkCount: number;
};
interface RepositoriesQueryResponse {
  user: {
    repositories: {
      nodes: [
        {
          nameWithOwner: string;
          name: string;
          primaryLanguage: {
            color: string;
            name: string;
          };
          description: string;
          stargazerCount: number;
          forkCount: number;
        },
      ];
    };
  };
}

async function fetchRepos(username: string): Promise<RepositoryList> {
  const request: RepositoriesQueryResponse = await octokit.graphql({
    query: `query($username:String!) {
      user(login:$username) {
        repositories(ownerAffiliations: OWNER, isFork: false, first: 100) {
          nodes {
            nameWithOwner
            name
            primaryLanguage {
              color
              name
            }
            description
            stargazerCount
            forkCount
          }
        }
      }
    }`,
    username,
  });
  const repos = request.user.repositories.nodes;

  return repos.reduce(
    (acc, repo) => ({
      ...acc,
      [repo.name.toLowerCase()]: repo,
    }),
    {},
  );
}

export { fetchRepos };
