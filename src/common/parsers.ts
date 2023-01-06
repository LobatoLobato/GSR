import { GitHubData, fetchImage } from "../fetchers";
import {
  renderRepo,
  renderTopLanguages,
  renderStats,
  renderStreaks,
} from "../renderers";

export let CSSVariables: { [key: string]: string } = {};

export let CSSVariablesStr: string = "";
export function githubStatsParser(xhtml: string, githubData: GitHubData) {
  const gitStats = /<gitstats(\s|.)*?>(\s|.)*?<\/gitstats>/gi;
  const gitStreak = /<gitstreak(\s|.)*?>(\s|.)*?<\/gitstreak>/gi;
  const gitTopLangs = /<gittoplangs(\s|.)*?>(\s|.)*?<\/gittoplangs>/gi;
  const gitRepo = /<gitrepo(\s|.)*?>(\s|.)*?<\/gitrepo>/gi;

  CSSVariables = {};

  const parsedXhtml = xhtml
    .replace(gitStats, (tag) => renderStats(tag, githubData.stats))
    .replace(gitStreak, (tag) => renderStreaks(tag, githubData.streak))
    .replace(gitTopLangs, (tag) => renderTopLanguages(tag, githubData.topLangs))
    .replace(gitRepo, (tag) => {
      return renderRepo(tag, githubData.repos);
    });

  CSSVariablesStr = Object.entries(CSSVariables).reduce((acc, [key, value]) => {
    return acc + `${key}: ${value};\n`;
  }, "");

  return parsedXhtml;
}

export async function imageParser(xhtml: string): Promise<string> {
  const imgTags = xhtml.match(/<img(\s|\n|.)*?\/>/gim);
  const sourceAttrs = xhtml.match(/(?<=(<img(\s|.)*?src=")).+?(?=")/gim);
  const xmlDecl = /(<!--.*?-->)|(<\?xml.*?>)/gim;
  const imgs: Promise<string>[] = [];
  if (!imgTags || !sourceAttrs) return xhtml;

  for (const source of sourceAttrs ?? []) {
    imgs.push(fetchImage(source));
  }
  for (let i = 0; i < imgTags.length; i++) {
    const tag = imgTags[i];
    const tagAttr = tag.replace(/(<img)|(src=".*?")|(\/>)/gim, "");
    const img = (await imgs[i])
      .replace(xmlDecl, "")
      .replace(
        'xmlns="http://www.w3.org/2000/svg"',
        `xmlns="http://www.w3.org/2000/svg" ${tagAttr}`,
      );

    xhtml = xhtml.replace(tag, img);
  }

  return xhtml;
}
