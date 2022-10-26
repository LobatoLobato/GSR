import { octokit } from "./octokit";

interface Edge {
  size: number;
  node: {
    color: string;
    name: string;
  };
}
interface TopLangsQueryResponse {
  user: {
    repositories: {
      nodes: [
        {
          name: string;
          languages: {
            edges: Edge[];
          };
        },
      ];
    };
  };
}

interface LanguageMap {
  [key: string]: {
    name: string;
    color: string;
    size: number;
  };
}

async function fetchTopLanguages(username: string): Promise<LanguageMap> {
  const request: TopLangsQueryResponse = await octokit.graphql({
    query: `query($username:String!) {
      user(login:$username) {
        # fetch only owner repos & not forks
        repositories(ownerAffiliations: OWNER, isFork: false, first: 100) {
          nodes {
            name
            languages(first: 10, orderBy: {field: SIZE, direction: DESC}) {
              edges {
                size
                node {
                  color
                  name
                }
              }
            }
          }
        }
      }
    }`,
    username,
  });
  const repoNodes = request.user.repositories.nodes;

  const map = repoNodes
    .filter((node) => node.languages.edges.length > 0)
    .reduce((acc, curr) => curr.languages.edges.concat(acc), [] as Edge[])
    .reduce((acc, curr: Edge) => {
      return {
        ...acc,
        [curr.node.name]: {
          name: curr.node.name,
          color: curr.node.color,
          size: curr.size + (acc[curr.node.name]?.size || 0),
        },
      };
    }, {} as LanguageMap);

  const sortedMap = Object.keys(map)
    .sort((a, b) => map[b].size - map[a].size)
    .reduce((result, key) => {
      result[key] = map[key];
      return result;
    }, {} as LanguageMap);

  console.log("\nUser Top Languages Map:  ");
  console.log(sortedMap);

  return sortedMap;
}

export { fetchTopLanguages };
export type { LanguageMap };
