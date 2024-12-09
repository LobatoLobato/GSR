import { GraphQL } from "@api/models/GraphQL";
import axios from "axios";
import moment from "moment";

import { asyncWrap } from "@api/utils/asyncWrap";
import {
  RepositoryList,
  GithubStats,
  Contributions,
  Streak,
  StreakInfo,
  ContributionDay,
  ContributionCalendar,
  LanguageMap,
  GitHubData,
} from "@api/types/github";
import {
  ContributionsCalendarResponse,
  RepositoriesQueryResponse,
  StatsQueryResponse,
  TopLangsQueryResponse,
  YearsQueryResponse,
} from "@api/types/query";

async function fetchImages(xhtml: string): Promise<Record<string, string> | undefined> {
  const sourceAttributes = xhtml.match(/(?<=(<img(\s|.)*?src=")).+?(?=")/gim);
  async function fetchImage(source: string): Promise<[string, string]> {
    const image = (await asyncWrap(axios.get(source)))[0]?.data;
    return [source, image ?? ""];
  }

  if (!sourceAttributes) return;

  const sourceSet = new Set(sourceAttributes);
  const imageTuples: [string, string][] = await Promise.all([...sourceSet].map(fetchImage));

  return Object.fromEntries(imageTuples);
}
const query_build = (username: string, after: string) => {
  return `{
      user(login: ${username}) {
        repositories(ownerAffiliations: OWNER, first: 100, after: ${after}) {
          nodes {
            nameWithOwner
            name
            primaryLanguage { color name }
            description
            stargazerCount
            forkCount
            url
          }
          pageInfo {
            startCursor
            endCursor
            hasNextPage
            hasPreviousPage
          }
        }
      }
  }`;
};
async function fetchRepos(username: string): Promise<RepositoryList> {
  const request: RepositoriesQueryResponse = await new GraphQL().query(
    `{
      user(login: "${username}") {
        repositories(ownerAffiliations: OWNER, first: 100) {
          nodes {
            nameWithOwner
            name
            primaryLanguage { color name }
            description
            stargazerCount
            forkCount
            url
          }
        }
      }
    }`,
  );
  const repos = request.user.repositories.nodes;

  return repos.reduce((acc, repo) => ({ ...acc, [repo.name.toLowerCase()]: repo }), {});
}

async function fetchStats(username: string): Promise<GithubStats> {
  const request: StatsQueryResponse = await new GraphQL().query(
    `{
      user(login: "${username}") {
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
  );

  const repos = request.user.repositories.nodes;
  const { pullRequests, issues, contributionsCollection, repositoriesContributedTo } = request.user;

  return {
    starsEarned: repos.reduce((acc, repo) => acc + repo.stargazerCount, 0),
    commits: contributionsCollection.totalCommitContributions,
    issues: issues.totalCount,
    PRs: pullRequests.totalCount,
    contributedTo: repositoriesContributedTo.totalCount,
  };
}

async function fetchStreak(username: string): Promise<StreakInfo> {
  const getContributionYears = async (username: string): Promise<number[]> => {
    const request: YearsQueryResponse = await new GraphQL().query(
      `{
        user(login: "${username}") {
            contributionsCollection {
                contributionYears
            }
        }
      }`,
    );

    return request.user.contributionsCollection.contributionYears;
  };

  const getContributionCalendars = async (
    username: string,
    years: number[],
  ): Promise<ContributionCalendar[]> => {
    const calendarQueries: string[] = [];
    for (const year of years) {
      const isCurrentYear = moment().year() === year;
      const currentDate = moment().date(moment().date() - 1);

      const startDate = moment(`${year}-01-01`);
      const endDate = !isCurrentYear
        ? moment(`${year}-12`).date(moment().daysInMonth())
        : currentDate;

      const query = `{
        user(login: "${username}") {
          contributionsCollection(from: "${startDate.toISOString()}" to: "${endDate.toISOString()}") {
            contributionCalendar {
              totalContributions
              weeks {
                contributionDays {
                  contributionCount
                  date
                }
              }
            }
          }
        }
      }`;

      calendarQueries.push(query);
    }
    const calendars = await new GraphQL().queryMultiple<ContributionsCalendarResponse>(
      calendarQueries,
    );

    return calendars.map(({ user }) => user.contributionsCollection.contributionCalendar);
  };

  const formatDate = (date: string | Date): string => {
    const formattedDate = new Date(date)
      .toUTCString()
      .replace(/(\w+,\s)|(\d+:\d+:\d+)|GMT/gi, "")
      .trim();

    return formattedDate;
  };

  const currentDate = moment().date(moment().date() - 1);

  const years = await getContributionYears(username); //Every year since the user's account creation

  const calendars = await getContributionCalendars(username, years);

  const contributions: Contributions = { count: 0, firstDate: null };
  const currentStreak: Streak & { ended: boolean } = {
    count: 0,
    ended: false,
    startDate: formatDate(currentDate.toISOString()),
    endDate: formatDate(currentDate.toISOString()),
  };
  const longestStreak: Streak = {
    count: 0,
    startDate: null,
    endDate: null,
  };
  const currLongestStreak: Streak & { started: boolean } = {
    count: 0,
    started: true,
    startDate: null,
    endDate: null,
  };

  for (const calendar of calendars) {
    const weeks = calendar.weeks;
    const days = weeks.reduce((acc, week) => {
      return [...acc, ...week.contributionDays];
    }, [] as ContributionDay[]);

    contributions.count += calendar.totalContributions;

    // Goes through each day from the current day to the first day of the calendar
    // Present to past
    for (const day of days.reverse()) {
      const { contributionCount } = day;
      const contributionDate = day.date;

      // If user had 1 or more contributions in the given day
      if (contributionCount > 0) {
        contributions.firstDate = formatDate(contributionDate);

        currLongestStreak.count++; //Increments current longest streak
        currLongestStreak.startDate = contributionDate; //Sets current longest streak's start date

        // If current longest streak just started
        if (currLongestStreak.started) {
          currLongestStreak.endDate = contributionDate; //Sets current longest streak's end date
          currLongestStreak.started = false; //Resets flag
        }
        if (!currentStreak.ended) {
          currentStreak.count++; //Increments streak counter
          currentStreak.startDate = formatDate(contributionDate); //Sets streak's end date
        } else if (currentStreak.ended && currentStreak.count === 0) {
          currentStreak.startDate = "X";
          currentStreak.endDate = "X";
        }
        continue; // Jumps to the next iteration of the loop
      }

      // If current longest streak is greater than or equal to the previous longest streak
      if (currLongestStreak.count >= longestStreak.count) {
        const { count, startDate, endDate } = currLongestStreak;
        longestStreak.count = count; //Sets longest streak
        longestStreak.startDate = startDate ? formatDate(startDate) : null;
        longestStreak.endDate = endDate ? formatDate(endDate) : null;
      }
      currLongestStreak.count = 0; //Resets current longest streak
      currLongestStreak.started = true; //Sets flag
      currentStreak.ended = true; //Ends current streak
    }
  }

  return {
    currentStreak,
    longestStreak,
    contributions,
  };
}

async function fetchTopLanguages(username: string): Promise<LanguageMap> {
  const request: TopLangsQueryResponse = await new GraphQL().query(
    `{
      user(login: "${username}") {
        repositories(ownerAffiliations: OWNER, first: 100) {
          nodes {
            languages(first: 100, orderBy: {field: SIZE, direction: DESC}) {
              edges {
                size
                node { color name }
              }
            }
          }
        }
      }
    }`,
  );
  const repoNodes = request.user.repositories.nodes;

  // Creates the language map with language sizes
  const map = repoNodes.reduce((acc, { languages }) => {
    if (languages.edges.length === 0) return acc;
    const map = languages.edges.reduce((acc2, language) => {
      const { name, color } = language.node;
      const size = language.size + (acc[name]?.size ?? 0);

      return { ...acc2, [name]: { name, color, size } };
    }, {} as LanguageMap);

    return { ...acc, ...map };
  }, {} as LanguageMap);

  // Sorts languages by size
  const sortedMap = Object.keys(map)
    .sort((a, b) => map[b].size - map[a].size)
    .reduce((acc, key) => ({ ...acc, [key]: map[key] }), {} as LanguageMap);

  return sortedMap;
}

async function fetchGithubData(username: string): Promise<GitHubData> {
  const [streak, topLangs, repos, stats] = await Promise.all([
    fetchStreak(username),
    fetchTopLanguages(username),
    fetchRepos(username),
    fetchStats(username),
  ]);

  return {
    stats,
    streak,
    topLangs,
    repos,
  };
}

export default {
  fetchImages,
  fetchRepos,
  fetchStats,
  fetchStreak,
  fetchTopLanguages,
  fetchGithubData,
};
