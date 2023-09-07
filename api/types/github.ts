export type RepositoryList = {
  [key: string]: Repository;
};
export type Repository = {
  name: string;
  nameWithOwner: string;
  primaryLanguage?: {
    color: string;
    name: string;
  };
  description: string;
  stargazerCount: number;
  forkCount: number;
};

export interface GithubStats {
  starsEarned: number;
  commits: number;
  issues: number;
  PRs: number;
  contributedTo: number;
}

export interface ContributionDay {
  contributionCount: number;
  date: string;
}
export interface Streak {
  count: number;
  startDate: string | null;
  endDate: string | null;
}
export interface Contributions {
  count: number;
  firstDate: string | null;
}
export interface StreakInfo {
  currentStreak: Streak;
  longestStreak: Streak;
  contributions: Contributions;
}

export type StoredStreakInfo = { date: moment.Moment; streakInfo: StreakInfo };

export interface ContributionCalendar {
  totalContributions: number;
  weeks: { contributionDays: ContributionDay[] }[];
}
export interface LanguageEdge {
  size: number;
  node: { color: string; name: string };
}

export interface LanguageMap {
  [key: string]: {
    name: string;
    color: string;
    size: number;
  };
}

export interface GitHubData {
  stats: GithubStats;
  streak: StreakInfo;
  topLangs: LanguageMap;
  repos: RepositoryList;
}
