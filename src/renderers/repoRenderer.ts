import { Repository, RepositoryList } from "../fetchers/repoFetcher";

function getAttrValue(openingTag: string, attrName: string): string | null {
  const attrValueRegexp = new RegExp(`(?<=${attrName}=").+?(?=")`, "i");
  const attrValue = openingTag.match(attrValueRegexp);
  return attrValue ? attrValue.toString() : null;
}
// function searchClassAttr(tag: string) {
//   const classValueRegexp = /(?<=class=")\w+/i;
//   const classValue = tag.match(classValueRegexp) || "";
//   return classValue.toString();
// }

function getBooleanAttr(openingTag: string, attrName: string): boolean {
  return openingTag.match(attrName) ? true : false;
}

function renderRepo2(tag: string, repoList: RepositoryList) {
  const openingTag = tag.match(/<gitrepo\s?(\s|.)*?>/i)!.toString();
  if (!openingTag) return "Syntax error";

  const repoName = getAttrValue(openingTag, "name");
  if (!repoName) return "Repository tag missing name attribute";

  const className = getAttrValue(openingTag, "class");
  console.log(className);
  const showOwner = getBooleanAttr(openingTag, "showOwner");

  const tagContent = /(?<=<gitrepo(\s|>)(.)*>)(\s|.)*?(?=<\/gitrepo>)/gi
    .exec(tag)
    ?.at(0);
  if (!tagContent) return "Standard Pattern";
  console.log(repoName);
  const repo = repoList[repoName.toLowerCase()];
  if (!repo) return "Repository not found";

  const template = createTemplate(tagContent, repo, {
    showOwner,
  });

  return `<div ${className ? `class="${className}"` : ""}>${template}</div>`;
}

interface TemplateOptions {
  nameClass?: string;
  descriptionClass?: string;
  languageClass?: string;
  starCountClass?: string;
  forkCount?: string;
  showOwner?: boolean;
}

const nameTag = /<reponame(\s|.)*?>(\s|.)*?<\/reponame>/gi;
const descriptionTag = /<repodescription(\s|.)*?>(\s|.)*?<\/repodescription>/gi;
const languageTag = /<repolanguage(\s|.)*?>(\s|.)*?<\/repolanguage>/gi;
const starCountTag = /<repostarcount(\s|.)*?>(\s|.)*?<\/repostarcount>/gi;
const forkCountTag = /<repoforkcount(\s|.)*?>(\s|.)*?<\/repoforkcount>/gi;

const nameTemplate = (tag: string, repo: Repository) => {
  const nameClass = getAttrValue(tag, "class");
  const classAttr = nameClass ? `class="${nameClass}"` : "";
  const showOwner = getBooleanAttr(tag, "showOwner");

  const name = showOwner ? repo.nameWithOwner : repo.name;
  return `<p ${classAttr}>${name}</p>`;
};
const descriptionTemplate = (tag: string, repo: Repository) => {
  const descriptionClass = getAttrValue(tag, "class");
  const classAttr = descriptionClass ? `class="${descriptionClass}"` : "";
  const description = repo.description
    ? repo.description
    : "No description provided";

  return `<p ${classAttr}>${description}</p>`;
};
const languageTemplate = (tag: string, repo: Repository) => {
  const languageClass = getAttrValue(tag, "class");
  const classAttr = languageClass ? `class="${languageClass}"` : "";
  const primaryLanguage = repo.primaryLanguage;
  const color = primaryLanguage
    ? `style="color:${repo.primaryLanguage.color};"`
    : "";
  const languageName = primaryLanguage
    ? primaryLanguage.name
    : "No language detected";
  return `<p ${classAttr} ${color}>${languageName}</p>`;
};
const starCountTemplate = (tag: string, repo: Repository) => {
  const starCountClass = getAttrValue(tag, "class");
  const classAttr = starCountClass ? `class="${starCountClass}"` : "";
  return `<p ${classAttr}>${repo.stargazerCount}</p>`;
};
const forkCountTemplate = (tag: string, repo: Repository) => {
  const forkCountClass = getAttrValue(tag, "class");
  const classAttr = forkCountClass ? `class="${forkCountClass}"` : "";
  return `<p ${classAttr}>${repo.forkCount}</p>`;
};

function createTemplate(
  tagContent: string,
  repo: Repository,
  opts: TemplateOptions,
): string {
  const showOwner = opts.showOwner ? true : false;
  const template = tagContent
    .replace(nameTag, (tag) => nameTemplate(tag, repo))
    .replace(descriptionTag, (tag) => descriptionTemplate(tag, repo))
    .replace(languageTag, (tag) => languageTemplate(tag, repo))
    .replace(starCountTag, (tag) => starCountTemplate(tag, repo))
    .replace(forkCountTag, (tag) => forkCountTemplate(tag, repo));

  return template;
}

export { renderRepo2 };
