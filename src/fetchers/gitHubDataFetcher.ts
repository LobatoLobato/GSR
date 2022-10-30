import { fetchRepos, RepositoryList } from "./repoFetcher";
import { fetchStats, GithubStats } from "./statsFetcher";
import { fetchStreak, StreakInfo } from "./streakFetcher";
import { fetchTopLanguages, LanguageMap } from "./topLanguagesFetcher";

interface GitFetchOptions {
  username: string;
}

export interface GitHubData {
  stats: GithubStats;
  streak: StreakInfo;
  topLangs: LanguageMap;
  repos: RepositoryList;
}

async function fetchGithubData(options: GitFetchOptions): Promise<GitHubData> {
  const streakAsync = fetchStreak(options.username);
  const topLangs = await fetchTopLanguages(options.username);
  const repos = await fetchRepos(options.username);
  const stats = await fetchStats(options.username);
  const streak = await streakAsync;

  return {
    stats,
    streak,
    topLangs,
    repos,
  };
}

class GitHubDataFetcher {
  private _stats: GithubStats = {
    commits: 3,
    contributedTo: 3,
    issues: 0,
    PRs: 0,
    starsEarned: 90,
  };
  private _streak: StreakInfo = {
    contributions: {
      count: 0,
      firstDate: "Date",
    },
    currentStreak: {
      count: 0,
      startDate: "Date",
      endDate: "Date",
    },
    longestStreak: {
      count: 0,
      startDate: "Date",
      endDate: "Date",
    },
  };
  private _topLangs: LanguageMap = {};
  private _repos: RepositoryList = {};
  constructor() {
    for (let i = 0; i < 10; i++) {
      this._topLangs[i.toString()] = {
        name: `Lang${i}`,
        color: `#${Math.trunc(Math.random() * 9)}${Math.trunc(
          Math.random() * 9,
        )}${Math.trunc(Math.random() * 9)}`,
        size: 10 - i,
      };
      this._repos[i.toString()] = {
        description: `description`,
        forkCount: Math.trunc(Math.random() * 100),
        name: `repo${i}`,
        nameWithOwner: `owner/repo${i}`,
        primaryLanguage: {
          name: `LangName`,
          color: `#${Math.trunc(Math.random() * 9)}${Math.trunc(
            Math.random() * 9,
          )}${Math.trunc(Math.random() * 9)}`,
        },
        stargazerCount: Math.trunc(Math.random() * 100),
      };
    }
  }
  get stats(): GithubStats {
    return this._stats;
  }
  get streak(): StreakInfo {
    return this._streak;
  }
  get topLangs(): LanguageMap {
    return this._topLangs;
  }
  get repos(): RepositoryList {
    return this._repos;
  }
  get data(): GitHubData {
    return {
      stats: this._stats,
      streak: this._streak,
      topLangs: this._topLangs,
      repos: this._repos,
    };
  }
  async fetchData(options: GitFetchOptions): Promise<GitHubData> {
    const data = await fetchGithubData(options);
    this._stats = data.stats;
    this._streak = data.streak;
    this._topLangs = data.topLangs;
    this._repos = data.repos;
    return data;
  }
}
export { fetchGithubData, GitHubDataFetcher };
