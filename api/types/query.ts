import { ContributionCalendar, LanguageEdge } from "./github";

export interface RepositoriesQueryResponse {
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

export interface StatsQueryResponse {
  user: {
    contributionsCollection: { totalCommitContributions: number };
    pullRequests: { totalCount: number };
    issues: { totalCount: number };
    repositoriesContributedTo: { totalCount: number };
    repositories: { nodes: [{ stargazerCount: number }] };
  };
}

export interface YearsQueryResponse {
  user: {
    contributionsCollection: {
      contributionYears: number[];
    };
  };
}

export interface ContributionsCalendarResponse {
  user: {
    contributionsCollection: {
      contributionCalendar: ContributionCalendar;
    };
  };
}

export interface TopLangsQueryResponse {
  user: {
    repositories: {
      nodes: [
        {
          name: string;
          languages: { edges: LanguageEdge[] };
        },
      ];
    };
  };
}
