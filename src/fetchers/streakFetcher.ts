import { octokit } from "./octokit";

interface ContributionDay {
  contributionCount: number;
  date: string;
}
interface StreakInfo {
  currentStreak: {
    count: number;
    startDate: string;
    endDate: string;
  };
  longestStreak: {
    count: number;
    startDate: string;
    endDate: string;
  };
  contributions: {
    count: number;
    firstDate: string;
  };
}
async function fetchStreak(username: string): Promise<StreakInfo> {
  const years = await getContributionYears(username); //Every year since the user's account creation
  const currentDate = new Date();
  currentDate.setUTCDate(currentDate.getDate() - 1);

  const currentStreak = {
    count: 0,
    ended: false,
    startDate: formatDate(currentDate.toISOString()),
    endDate: formatDate(currentDate.toISOString()),
  };
  const contributions = {
    count: 0,
    firstDate: "Null",
  };
  const longestStreak = {
    count: 0,
    startDate: "Null",
    endDate: "Null",
  };
  const currLongestStreak = {
    count: 0,
    started: true,
    startDate: "Null",
    endDate: "Null",
  };

  for (const year of years) {
    const contributionCalendar = await getContributionCalendar(username, year);
    const weeks = contributionCalendar.weeks;
    const contributionDays = weeks
      .reduce(
        (acc, week) => [...acc, ...week.contributionDays],
        [] as ContributionDay[],
      )
      .reverse();

    contributions.count += contributionCalendar.totalContributions;

    for (const day of contributionDays) {
      const contributionCount = day.contributionCount;
      const contributionDate = day.date;

      //If user had 1 or more contributions in the given day
      if (contributionCount > 0) {
        contributions.firstDate = formatDate(contributionDate);

        currLongestStreak.count++; //Increments current longest streak
        currLongestStreak.startDate = contributionDate; //Sets current longest streak's start date

        //If current longest streak just started
        if (currLongestStreak.started) {
          currLongestStreak.endDate = contributionDate; //Sets current longest streak's end date
          currLongestStreak.started = false; //Resets flag
        }
        if (!currentStreak.ended) {
          currentStreak.count++; //Increments streak counter
          currentStreak.startDate = formatDate(contributionDate); //Sets streak's end date
        } else if (currentStreak.ended && currentStreak.count === 0) {
          currentStreak.endDate = "Null";
        }
        continue; //Jumps to the next iteration of the loop
      }
      // If current longest streak is greater than or equal to the previous longest streak
      if (currLongestStreak.count >= longestStreak.count) {
        longestStreak.count = currLongestStreak.count; //Sets longest streak
        longestStreak.startDate = formatDate(currLongestStreak.startDate);
        longestStreak.endDate = formatDate(currLongestStreak.endDate);
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

function formatDate(date: string | Date): string {
  const formattedDate = new Date(date)
    .toUTCString()
    .replace(/(\w+,\s)|(\d+:\d+:\d+)|GMT/gi, "")
    .trim();

  return formattedDate;
}

interface YearsQueryResponse {
  user: {
    contributionsCollection: {
      contributionYears: number[];
    };
  };
}
async function getContributionYears(username: string): Promise<number[]> {
  const request: YearsQueryResponse = await octokit.graphql({
    query: `query($username:String!) {
      user(login: $username) {
          contributionsCollection {
              contributionYears
          }
      }
  }`,
    username,
  });

  return request.user.contributionsCollection.contributionYears;
}

interface StreakQueryResponse {
  user: {
    contributionsCollection: {
      contributionCalendar: {
        totalContributions: number;
        weeks: [
          {
            contributionDays: ContributionDay[];
          },
        ];
      };
    };
  };
}
interface ContributionCalendar {
  totalContributions: number;
  weeks: [
    {
      contributionDays: ContributionDay[];
    },
  ];
}
async function getContributionCalendar(
  username: string,
  year: number,
): Promise<ContributionCalendar> {
  const isCurrentYear = new Date().getUTCFullYear() === year;
  const currentDate = new Date();
  currentDate.setUTCDate(currentDate.getUTCDate() - 1);
  const currentDateStr = currentDate.toISOString();

  const startDate = `${year}-01-01T00:00:00Z`;
  const endDate = isCurrentYear ? currentDateStr : `${year}-12-31T23:59:59Z`;

  const request: StreakQueryResponse = await octokit.graphql({
    query: `query ($username: String! $startDate:DateTime! $endDate:DateTime!) {
    user(login: $username) {
      contributionsCollection(from: $startDate to: $endDate) {
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
  }`,
    username,
    startDate,
    endDate,
  });
  return request.user.contributionsCollection.contributionCalendar;
}

export { fetchStreak };
export type { StreakInfo };
