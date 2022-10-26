import { fetchRepos, RepositoryList } from "./repoFetcher";
import { fetchStats, GithubStats } from "./statsFetcher";
import { fetchStreak, StreakInfo } from "./streakFetcher";
import { fetchTopLanguages, LanguageMap } from "./topLanguagesFetcher";

interface GitFetchOptions {
  username: string;
}

export type GitHubData = {
  stats: GithubStats;
  streak: StreakInfo;
  topLangs: LanguageMap;
  repos: RepositoryList;
};

async function fetchGithubData(options: GitFetchOptions): Promise<GitHubData> {
  const streakAsync = fetchStreak("marten-seemann");
  const topLangs = await fetchTopLanguages(options.username);
  const repos = await fetchRepos(options.username);
  const stats = await fetchStats("lobatolobato");
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
    commits: 0,
    contributedTo: 0,
    issues: 0,
    PRs: 0,
    starsEarned: 0,
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
        name: `lang${i}Name`,
        color: `#FFFFFF`,
        size: i + 1,
      };
      this._repos[i.toString()] = {
        description: `repo${i}description`,
        forkCount: Math.random() * 100,
        name: `repo${i}Name`,
        nameWithOwner: `owner/repo${i}Name`,
        primaryLanguage: { name: `repo${i}LangName`, color: "#FFFFFF" },
        stargazerCount: Math.random() * 100,
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
