import { CSSVariables } from "../common/parsers";
import { Repository, RepositoryList } from "../fetchers";
import {
  genericTemplate,
  getAttrValue,
  getBooleanAttr,
  getTagChildren,
  removeNewLines,
  tagAttrRegExp,
  tagNameRegExp,
  tagRegExp,
} from "./utils";

export function renderRepo(tag: string, repoList: RepositoryList) {
  tag = removeNewLines(tag);
  const openingTag = tag.match(/<gitrepo\s?(\s|.)*?>/i);
  if (!openingTag) return "Syntax error";

  const repoName = getAttrValue(openingTag.toString(), "name");
  if (!repoName) return "Repository tag missing name attribute";

  const tagChildren = getTagChildren(tag, "gitrepo");
  if (!tagChildren) return "Standard Pattern";

  const repo = repoList[repoName.toLowerCase()];
  if (!repo) return "Repository not found";

  repo.description = repo.description
    ? repo.description
    : "No description provided";

  if (!repo.primaryLanguage) {
    repo.primaryLanguage = {
      name: "No language detected",
      color: "#ffffff",
    };
  }

  CSSVariables[`--gsr-${repo.name}-langcolor`] = repo.primaryLanguage.color;

  const template = createTemplate(tagChildren, repo);

  return tag
    .replace(tagAttrRegExp("gitrepo", "name"), "") // Removes name attribute
    .replace(tagNameRegExp("gitrepo"), "div") // Replaces <gitrepo> with <div>
    .replace(tagChildren, template); // Replaces <gittoplangs>'s children with the template
}

const nameTag = tagRegExp("reponame");
const descriptionTag = tagRegExp("repodescription");
const languageTag = tagRegExp("repolanguage");
const starCountTag = tagRegExp("repostarcount");
const forkCountTag = tagRegExp("repoforkcount");

function createTemplate(tagContent: string, repo: Repository): string {
  const template = tagContent
    .replace(nameTag, (tag) => {
      const showOwner = getBooleanAttr(tag, "showOwner");
      const name = showOwner ? repo.nameWithOwner : repo.name;
      return genericTemplate(tag, name);
    }) // Replaces <reponame> tags with the corresponding template
    .replace(languageTag, (tag) =>
      genericTemplate(tag, repo.primaryLanguage!.name),
    ) // Replaces <repolanguage> tags with the corresponding template
    .replace(descriptionTag, (tag) => genericTemplate(tag, repo.description)) // Replaces <repodescription> tags with the corresponding template
    .replace(starCountTag, (tag) => genericTemplate(tag, repo.stargazerCount)) // Replaces <repostarcount> tags with the corresponding template
    .replace(forkCountTag, (tag) => genericTemplate(tag, repo.forkCount)); // Replaces <repoforkcount> tags with the corresponding template

  return template;
}
