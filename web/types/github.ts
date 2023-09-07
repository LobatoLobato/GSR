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

export interface User {
  avatar_url: string
  bio: string
  blog: string
  collaborators: number
  company: string | null
  created_at: string
  disk_usage: number
  email: string | null
  events_url: string
  followers: number
  followers_url: string
  following: number
  following_url: string
  gists_url: string
  gravatar_id: string
  hireable: boolean
  html_url: string
  id: number
  location: string
  login: string
  name: string
  node_id: string
  ok: boolean
  organizations_url: string
  owned_private_repos: number
  plan: { name: string, space: number, collaborators: number, private_repos: number }
  private_gists: number
  public_gists: number
  public_repos: number
  received_events_url: string
  repos_url: string
  site_admin: boolean
  starred_url: string
  subscriptions_url: string
  total_private_repos: number
  twitter_username: string | null
  two_factor_authentication: boolean
  type: string
  updated_at: string
  url: string
}