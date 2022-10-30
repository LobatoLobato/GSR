import prettier from "prettier";
import HTMLParser from "prettier/parser-html";
import CSSParser from "prettier/parser-postcss";
import { GitHubData } from "../fetchers/gitHubDataFetcher";
import { renderRepo, renderTopLanguages } from "../renderers";

function htmlFormatter(html: string) {
  const options: prettier.Options = {
    parser: "html",
    plugins: [HTMLParser],
  };
  return prettier.format(styleTagFormatter(html), options);
}

function cssFormatter(css: string) {
  const options: prettier.Options = {
    parser: "css",
    plugins: [CSSParser],
  };
  return prettier.format(css, options);
}
function styleTagFormatter(html: string) {
  const styleTagRegexp = /<style>(\n|.)+?<\/style>/gim;

  const formatContent = (tag: string) => {
    const tagContent = tag.replace(/<\/?style>/gim, "");
    return cssFormatter(tagContent);
  };

  return html.replace(
    styleTagRegexp,
    (tag) => "<style>\n" + indent(formatContent(tag)) + "</style>",
  );
}

function styleTagScoper(xhtml: string) {
  const scope = "scopescopescopescope";
  const styleTag = /<style>(\n|.)+?<\/style>/gim; // Matches style tags
  const atRule = /(?<=(@.+\s))\w+\s+(?={)/gim; // Matches css @rules
  const cssclass = /(?<=>|;|})\s*\.?[\w]+((?!%).?)+?(?=({|}))/gim; // Matches css classes
  const selector = /(?<=\.)[a-z]+/gi; // Matches css selectors
  const classDeclaration = /(?<=class=").+?(?=")/gi; // Matches element class declarations
  const className = /[a-z]+/gi; // Matches class names inside class declarations

  const scopedXhtml = xhtml
    .replace(styleTag, (tag) => {
      const atRuleNames = tag.match(atRule);
      let scopedTag = tag.replace(cssclass, (cssclass) =>
        ` .${scope} ${cssclass.replace(
          selector,
          (selector) => `${scope}${selector}`,
        )}`.replace(/\s+/, " "),
      );
      atRuleNames?.forEach((name) => {
        scopedTag = scopedTag.replace(new RegExp(name, "g"), `${scope}${name}`);
      });

      return scopedTag;
    })
    .replace(classDeclaration, (declaration) =>
      declaration.replace(className, (name) => `${scope}${name}`),
    );

  return { scopedXhtml, scope };
}

export let CSSVariables: { [key: string]: string } = {};
export let CSSVariablesStr: string = "";
function githubStatsParser(xhtml: string, githubData: GitHubData) {
  const gitStats = /<gitstats(\s|.)*?>(\s|.)*?<\/gitstats>/gi;
  const gitStreak = /<gitstreak(\s|.)*?>(\s|.)*?<\/gitstreak>/gi;
  const gitTopLangs = /<gittoplangs(\s|.)*?>(\s|.)*?<\/gittoplangs>/gi;
  const gitRepo = /<gitrepo(\s|.)*?>(\s|.)*?<\/gitrepo>/gi;

  CSSVariables = {};

  const parsedXhtml = xhtml
    .replace(gitStats, (tag) => "githubData.stats")
    .replace(gitStreak, (tag) => "githubData.streak")
    .replace(gitTopLangs, (tag) => renderTopLanguages(tag, githubData.topLangs))
    .replace(gitRepo, (tag) => {
      return renderRepo(tag, githubData.repos);
    });


  CSSVariablesStr = Object.entries(CSSVariables).reduce((acc, [key, value]) => {
    return acc + `${key}: ${value};\n`;
  }, "");

  return parsedXhtml;
}

function indent(code: string) {
  const newLineRegexp = /(?<=\n)(?=.)|^/g;
  return code.replace(newLineRegexp, "  ");
}

export { htmlFormatter, cssFormatter, styleTagScoper, githubStatsParser };
export type { GitHubData };
