import { StreakInfo } from "../fetchers";
import { genericTemplate, getTagChildren, tagRegExp } from "./utils";

export function renderStreaks(tag: string, streaks: StreakInfo) {
  const openingTag = tag.match(/<gitstreak\s?(\s|.)*?>/i)!.toString();
  if (!openingTag) return "Syntax error";

  const tagChildren = getTagChildren(tag, "gitstreak");
  if (!tagChildren) return "Standard Pattern";

  const template = createTemplate(tagChildren, streaks);

  return tag
    .replace(/gitstreak(?!\w)/gi, "div") // Replaces <gitstreak> with <div>
    .replace(tagChildren, template); // Replaces <gitstreak>'s children with the template
}

const contributionsTag = {
  count: tagRegExp("streakcontributionscount"),
  firstDate: tagRegExp("streakcontributionsfirstdate"),
};
const currentTag = {
  count: tagRegExp("streakcurrentcount"),
  startDate: tagRegExp("streakcurrentstartdate"),
  endDate: tagRegExp("streakcurrentenddate"),
};
const longestTag = {
  count: tagRegExp("streaklongestcount"),
  startDate: tagRegExp("streaklongeststartdate"),
  endDate: tagRegExp("streaklongestenddate"),
};

function createTemplate(tagChildren: string, streaks: StreakInfo) {
  const template = tagChildren
    .replace(contributionsTag.count, (tag) =>
      genericTemplate(tag, streaks.contributions.count),
    ) // Replaces <streakcontributionscount> tags with the corresponding template
    .replace(contributionsTag.firstDate, (tag) =>
      genericTemplate(tag, streaks.contributions.firstDate),
    ) // Replaces <streakcontributionsfirstdate> tags with the corresponding template
    .replace(currentTag.count, (tag) =>
      genericTemplate(tag, streaks.currentStreak.count),
    ) // Replaces <streakcurrentcount> tags with the corresponding template
    .replace(currentTag.startDate, (tag) =>
      genericTemplate(tag, streaks.currentStreak.startDate),
    ) // Replaces <streakcurrentstartdate> tags with the corresponding template
    .replace(currentTag.endDate, (tag) =>
      genericTemplate(tag, streaks.currentStreak.endDate),
    ) // Replaces <streakcurrentenddate> tags with the corresponding template
    .replace(longestTag.count, (tag) =>
      genericTemplate(tag, streaks.longestStreak.count),
    ) // Replaces <streaklongestcount> tags with the corresponding template
    .replace(longestTag.startDate, (tag) =>
      genericTemplate(tag, streaks.longestStreak.startDate),
    ) // Replaces <streaklongeststartdate> tags with the corresponding template
    .replace(longestTag.endDate, (tag) =>
      genericTemplate(tag, streaks.longestStreak.endDate),
    ); // Replaces <streaklongestenddate> tags with the corresponding template

  return template;
}
