import prettier from "prettier";
import HTMLParser from "prettier/parser-html";
import CSSParser from "prettier/parser-postcss";
import { GitHubData } from "../fetchers";
import {
  renderRepo,
  renderTopLanguages,
  renderStats,
  renderStreaks,
} from "../renderers";

function htmlFormatter(html: string) {
  const options: prettier.Options = {
    parser: "html",
    plugins: [HTMLParser],
  };
  return prettier.format(styleTagFormatter(html), options);
}
function htmlFormatWithCursor(html: string, cursorOffset: number) {
  const options: prettier.CursorOptions = {
    parser: "html",
    plugins: [HTMLParser],
    cursorOffset,
  };
  return prettier.formatWithCursor(styleTagFormatter(html), options);
}

function cssFormatter(css: string) {
  const options: prettier.Options = {
    parser: "css",
    plugins: [CSSParser],
  };
  return prettier.format(css, options);
}
function cssFormatWithCursor(css: string, cursorOffset: number) {
  const options: prettier.CursorOptions = {
    parser: "css",
    plugins: [CSSParser],
    cursorOffset,
  };
  return prettier.formatWithCursor(css, options);
}
function styleTagFormatter(html: string) {
  const styleTagRegexp = /<style>(\n|.)+?<\/style>/gim;

  const formatContent = (tag: string) => {
    const tagContent = tag.replace(/<\/?style>/gim, "");
    return cssFormatter(tagContent);
  };
  const reset = `
html, body, div, span, applet, object, iframe,
h1, h2, h3, h4, h5, h6, p, blockquote, pre,
a, abbr, acronym, address, big, cite, code,
del, dfn, em, img, ins, kbd, q, s, samp,
small, strike, strong, sub, sup, tt, var,
b, u, i, center,
dl, dt, dd, ol, ul, li,
fieldset, form, label, legend,
table, caption, tbody, tfoot, thead, tr, th, td,
article, aside, canvas, details, embed, 
figure, figcaption, footer, header, hgroup, 
menu, nav, output, ruby, section, summary,
time, mark, audio, video {
	margin: 0;
	padding: 0;
	border: 0;
	font-size: 100%;
	font: inherit;
	vertical-align: baseline;
}
/* HTML5 display-role reset for older browsers */
article, aside, details, figcaption, figure, 
footer, header, hgroup, menu, nav, section {
	display: block;
}
body {
	line-height: 1;
}
ol, ul {
	list-style: none;
}
blockquote, q {
	quotes: none;
}
blockquote:before, blockquote:after,
q:before, q:after {
	content: '';
	content: none;
}
table {
	border-collapse: collapse;
	border-spacing: 0;
}`;
  return `
    <style>
    ${reset}
    </style>
    ${html.replace(
      styleTagRegexp,
      (tag) => "<style>\n" + indent(formatContent(tag)) + "</style>",
    )}
  `;
}

function styleTagScoper(xhtml: string) {
  const scope = "scopescopescopescope";
  const styleTag = /<style>(\n|.)+?<\/style>/gim; // Matches style tags
  const atRule = /(?<=(@.+\s))\w+\s+(?={)/gim; // Matches css @rules
  const cssclass = /(?<=>|})\s*\.?[\w]+((?!%)(.|\n)?)+?(?=({|}))/gim; // Matches css classes
  const selector = /(?<=\.)[a-z]+/gi; // Matches css selectors
  const classDeclaration = /(?<=class=").+?(?=")/gi; // Matches element class declarations
  const className = /[\w-]+/gi; // Matches class names inside class declarations

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
async function imageParser(xhtml: string) {
  const imgTags = xhtml.match(/<img(\s|\n|.)*?\/>/gim);

  for (const tag of imgTags ?? []) {
    const source = tag.match(/(?<=(src=")).+(?=")/gim)?.at(0);
    if (source) {
      const response = await fetch(
        "https://cors-anywhere.herokuapp.com/" + source,
      );
      const text = await response.text();
      xhtml = xhtml.replace(tag, text);
      console.log(tag);
      // console.log(text);
    }
  }

  // imgTags?.forEach(async (tag) => {});
  console.log(xhtml);
  return xhtml;
}
function indent(code: string) {
  const newLineRegexp = /(?<=\n)(?=.)|^/g;
  return code.replace(newLineRegexp, "  ");
}

function stringToHex(str: string) {
  const array = str.match(/./gi);
  if (!array) return null;
  const hexStr = array.reduce(
    (acc, curr) => acc + curr.charCodeAt(0).toString(16),
    "",
  );
  return hexStr;
}

// async function fetchImage(url) {
//   try {
//     const response = await axios.get(url, {
//       responseType: "arraybuffer",
//     });
//     const data = String.fromCharCode(...new Uint8Array(response.data));

//     const width = data.match(/((?<=width=")\d+)/gim);
//     const height = data.match(/((?<=height=")\d+)/gim);

//     let treatedSVG = data;
//     if (width && height && !/viewBox="[\d\s\.]+"/gi.test(data)) {
//       const svgNS = 'xmlns="http://www.w3.org/2000/svg"';
//       treatedSVG = treatedSVG.replace(
//         svgNS,
//         `${svgNS} viewBox="0 0 ${width.toString()} ${height.toString()}"`,
//       );
//     }
//     return treatedSVG;
//   } catch (err) {
//     console.log(err);
//     return err;
//   }
// }

const CONSTANTS = {
  THIRTY_MINUTES: 1800,
  TWO_HOURS: 7200,
  FOUR_HOURS: 14400,
  ONE_DAY: 86400,
};

export {
  htmlFormatter,
  htmlFormatWithCursor,
  cssFormatter,
  cssFormatWithCursor,
  styleTagScoper,
  githubStatsParser,
  stringToHex,
  CONSTANTS,
  imageParser,
};
export type { GitHubData };
