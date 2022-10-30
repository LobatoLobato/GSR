import { GithubStats } from "../fetchers";
import {
  genericTemplate,
  getTagChildren,
  tagNameRegExp,
  tagRegExp,
} from "./utils";

export function renderStats(tag: string, stats: GithubStats) {
  const openingTag = tag.match(/<gitstats\s?(\s|.)*?>/i)!.toString();
  if (!openingTag) return "Syntax error";

  const tagChildren = getTagChildren(tag, "gitstats");
  if (!tagChildren) return "Standard Pattern";

  const template = createTemplate(tagChildren, stats);

  return tag
    .replace(tagNameRegExp("gitstats"), "div") // Replaces <gitstats> with <div>
    .replace(tagChildren, template); // Replaces <gitstats>'s children with the template
}
const prsTag = tagRegExp("statpullrequests");
const commitsTag = tagRegExp("statcommits");
const contributedToTag = tagRegExp("statcontributedto");
const issuesTag = tagRegExp("statissues");
const starsTag = tagRegExp("statstarsearned");

function createTemplate(tagChildren: string, stats: GithubStats) {
  const template = tagChildren
    .replace(prsTag, (tag) => genericTemplate(tag, stats.PRs))
    .replace(commitsTag, (tag) => genericTemplate(tag, stats.commits))
    .replace(issuesTag, (tag) => genericTemplate(tag, stats.issues))
    .replace(starsTag, (tag) => genericTemplate(tag, stats.starsEarned))
    .replace(contributedToTag, (tag) =>
      genericTemplate(tag, stats.contributedTo),
    );

  return template;
}
