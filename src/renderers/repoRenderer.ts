import { CSSVariables } from "../common/utils";
import { Repository, RepositoryList } from "../fetchers/repoFetcher";
import { getAttrValue, getBooleanAttr } from "./utils";

function renderRepo(tag: string, repoList: RepositoryList) {
  const openingTag = tag.match(/<gitrepo\s?(\s|.)*?>/i)!.toString();
  if (!openingTag) return "Syntax error";

  const repoName = getAttrValue(openingTag, "name");
  if (!repoName) return "Repository tag missing name attribute";

  const tagChildren = /(?<=<gitrepo(\s|>)(.)*>)(\s|.)*?(?=<\/gitrepo>)/gi
    .exec(tag)
    ?.at(0);
  if (!tagChildren) return "Standard Pattern";

  const repo = repoList[repoName.toLowerCase()];
  if (!repo) return "Repository not found";

  const template = createTemplate(tagChildren, repo);

  return tag
    .replace(/gitrepo(?!\w)/gi, "div") // Replaces <gitrepo> with <div>
    .replace(/name="\w+"/gi, "") // Removes name attribute
    .replace(tagChildren, template); // Replaces <gittoplangs>'s children with the template
}

const nameTag = /<reponame(\s|.)*?>(\s|.)*?<\/reponame\s*?>/gi;
const descriptionTag =
  /<repodescription(\s|.)*?>(\s|.)*?<\/repodescription\s*?>/gi;
const languageTag = /<repolanguage(\s|.)*?>(\s|.)*?<\/repolanguage\s*?>/gi;
const starCountTag = /<repostarcount(\s|.)*?>(\s|.)*?<\/repostarcount\s*?>/gi;
const forkCountTag = /<repoforkcount(\s|.)*?>(\s|.)*?<\/repoforkcount\s*?>/gi;

const nameTemplate = (tag: string, repo: Repository) => {
  const nameClass = getAttrValue(tag, "class");
  const nameStyle = getAttrValue(tag, "style");
  const classAttr = nameClass ? `class="${nameClass}"` : "";
  const styleAttr = nameStyle ? `style="${nameStyle}"` : "";
  const showOwner = getBooleanAttr(tag, "showOwner");

  const name = showOwner ? repo.nameWithOwner : repo.name;
  return `<p ${classAttr} ${styleAttr}>${name}</p>`;
};
const descriptionTemplate = (tag: string, repo: Repository) => {
  const descriptionClass = getAttrValue(tag, "class");
  const descriptionStyle = getAttrValue(tag, "style");
  const classAttr = descriptionClass ? `class="${descriptionClass}"` : "";
  const styleAttr = descriptionStyle ? `style="${descriptionStyle}"` : "";
  const description = repo.description
    ? repo.description
    : "No description provided";

  return `<p ${classAttr} ${styleAttr}>${description}</p>`;
};
const languageTemplate = (tag: string, repo: Repository) => {
  const languageClass = getAttrValue(tag, "class");
  const languageStyle = getAttrValue(tag, "style");
  const classAttr = languageClass ? `class="${languageClass}"` : "";
  const styleAttr = languageStyle ? `style="${languageStyle}"` : "";
  const primaryLanguage = repo.primaryLanguage;

  CSSVariables[`--gsr-${repo.name}-langcolor`] = repo.primaryLanguage
    ? repo.primaryLanguage.color
    : "#ffffff";

  const languageName = primaryLanguage
    ? primaryLanguage.name
    : "No language detected";
  return `<p ${classAttr} ${styleAttr}>${languageName}</p>`;
};
const starCountTemplate = (tag: string, repo: Repository) => {
  const starCountClass = getAttrValue(tag, "class");
  const starCountStyle = getAttrValue(tag, "style");
  const classAttr = starCountClass ? `class="${starCountClass}"` : "";
  const styleAttr = starCountStyle ? `style="${starCountStyle}"` : "";
  return `<p ${classAttr} ${styleAttr}>${repo.stargazerCount}</p>`;
};
const forkCountTemplate = (tag: string, repo: Repository) => {
  const forkCountClass = getAttrValue(tag, "class");
  const forkCountStyle = getAttrValue(tag, "style");
  const classAttr = forkCountClass ? `class="${forkCountClass}"` : "";
  const styleAttr = forkCountStyle ? `style="${forkCountStyle}"` : "";
  return `<p ${classAttr} ${styleAttr}>${repo.forkCount}</p>`;
};

function createTemplate(tagContent: string, repo: Repository): string {
  const template = tagContent
    .replace(nameTag, (tag) => nameTemplate(tag, repo)) // Replaces <reponame> tags with the corresponding template
    .replace(descriptionTag, (tag) => descriptionTemplate(tag, repo)) // Replaces <repodescription> tags with the corresponding template
    .replace(languageTag, (tag) => languageTemplate(tag, repo)) // Replaces <repolanguage> tags with the corresponding template
    .replace(starCountTag, (tag) => starCountTemplate(tag, repo)) // Replaces <repostarcount> tags with the corresponding template
    .replace(forkCountTag, (tag) => forkCountTemplate(tag, repo)); // Replaces <repoforkcount> tags with the corresponding template

  return template;
}

export { renderRepo };
