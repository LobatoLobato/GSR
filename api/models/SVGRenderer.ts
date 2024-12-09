import codeFormatter from "@api/utils/codeFormatter";
import { GithubStats, Repository, StreakInfo } from "@web/types/github";
import { GitHubData } from "@web/types/github";

interface Lang {
  name: string;
  color: string;
  size: number;
  percentage: string;
}

export class GSRSVGRenderer {
  private _cssVariables: Record<string, string> = {};
  private _githubData: GitHubData;
  private _xhtml: string;

  private constructor(xhtml: string, githubData: GitHubData) {
    this._githubData = githubData;
    this._xhtml = xhtml;
  }

  public get xhtml(): string {
    return this._xhtml;
  }

  public static async render(props: {
    xhtml: string;
    githubData: GitHubData;
    imageRecord?: Record<string, string>;
    preview?: boolean;
    scope?: string;
    height?: number;
  }) {
    props.scope = props.scope ?? "scopescopescopescope";
    props.xhtml = await codeFormatter(props.xhtml, "html");

    const { xhtml, cssVariables } = new GSRSVGRenderer(props.xhtml, props.githubData)
      .renderStats()
      .renderStreaks()
      .renderRepos()
      .renderTopLanguages()
      .scopeStyleTags(props.scope)
      .escapeScripts()
      .injectCSSReset()
      .renderImages(props.imageRecord);

    const cssVariablesString = Object.entries(cssVariables).reduce((acc, [key, value]) => {
      return acc + `${key}: ${value};`;
    }, "");
    const renderedXhtml = props.preview
      ? `<div xmlns="http://www.w3.org/1999/xhtml" class="${props.scope}"><style>:root{${cssVariablesString}}</style>${xhtml}</div>`
      : `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="${props.height}">` +
        `<foreignObject width="100%" height="100%">` +
        `<div xmlns="http://www.w3.org/1999/xhtml" class="${props.scope}"><style>:root{${cssVariablesString}}</style>${xhtml}</div>` +
        `</foreignObject>` +
        `</svg>`;

    return { renderedXhtml, cssVariables };
  }

  get cssVariables(): Record<string, string> {
    return this._cssVariables;
  }
  private renderRepos(): GSRSVGRenderer {
    const gitRepo = /<gitrepo(\s|.)*?>(\s|.)*?<\/gitrepo>/gi;

    const repo = (tag: string): string => {
      const nameTag = this.tagRegExp("reponame");
      const descriptionTag = this.tagRegExp("repodescription");
      const languageTag = this.tagRegExp("repolanguage");
      const starCountTag = this.tagRegExp("repostarcount");
      const forkCountTag = this.tagRegExp("repoforkcount");

      const transform = (tagContent: string, repo: Repository): string => {
        const transformResult = tagContent
          .replace(nameTag, (tag) => {
            const showOwner = this.getBooleanAttr(tag, "showOwner");
            const name = showOwner ? repo.nameWithOwner : repo.name;
            return this.toDiv(tag, name);
          }) // Replaces <reponame> tags with div tags
          .replace(languageTag, (tag) => this.toDiv(tag, repo.primaryLanguage!.name)) // Replaces <repolanguage> tags with div tags
          .replace(descriptionTag, (tag) => this.toDiv(tag, repo.description)) // Replaces <repodescription> tags with div tags
          .replace(starCountTag, (tag) => this.toDiv(tag, repo.stargazerCount)) // Replaces <repostarcount> tags with div tags
          .replace(forkCountTag, (tag) => this.toDiv(tag, repo.forkCount)); // Replaces <repoforkcount> tags with div tags

        return transformResult;
      };

      tag = this.removeNewLines(tag);
      const openingTag = this.getOpeningTag(tag, "gitrepo");
      if (!openingTag) return "Syntax error";

      const repoName = this.getAttrValue(openingTag, "name");
      if (!repoName) return "Repository tag missing name attribute";

      const tagContent = this.getTagContent(tag, "gitrepo");
      if (!tagContent) return "Standard Pattern";

      const { repos } = this._githubData;
      const repo = repos[repoName.toLowerCase()];
      if (!repo) return "Repository not found";

      repo.description = repo.description || "No description provided";

      if (!repo.primaryLanguage) {
        repo.primaryLanguage = {
          name: "No language detected",
          color: "#ffffff",
        };
      }

      const transformedContent = transform(tagContent, repo);
      this._cssVariables[`--gsr-${repo.name}-langcolor`] = repo.primaryLanguage.color;
      return tag
        .replace(this.tagAttrRegExp("gitrepo", "name"), "") // Removes name attribute
        .replace(this.tagNameRegExp("gitrepo"), "div") // Replaces <gitrepo> with <div>
        .replace(tagContent, transformedContent); // Replaces <gitrepo>'s children with the transformed content
    };

    this._xhtml = this._xhtml.replace(gitRepo, repo);
    return this;
  }
  private renderStats(): GSRSVGRenderer {
    const gitStats = /<gitstats(\s|.)*?>(\s|.)*?<\/gitstats>/gi;

    const stats = (tag: string): string => {
      const prsTag = this.tagRegExp("statpullrequests");
      const commitsTag = this.tagRegExp("statcommits");
      const contributedToTag = this.tagRegExp("statcontributedto");
      const issuesTag = this.tagRegExp("statissues");
      const starsTag = this.tagRegExp("statstarsearned");

      const transform = (tagContent: string, stats: GithubStats) => {
        const transformResult = tagContent
          .replace(prsTag, (tag) => this.toDiv(tag, stats.PRs))
          .replace(commitsTag, (tag) => this.toDiv(tag, stats.commits))
          .replace(issuesTag, (tag) => this.toDiv(tag, stats.issues))
          .replace(starsTag, (tag) => this.toDiv(tag, stats.starsEarned))
          .replace(contributedToTag, (tag) => this.toDiv(tag, stats.contributedTo));

        return transformResult;
      };

      const openingTag = this.getOpeningTag(tag, "gitstats");
      if (!openingTag) return "Syntax error";

      const tagContent = this.getTagContent(tag, "gitstats");
      if (!tagContent) return "Standard Pattern";

      const transformedContent = transform(tagContent, this._githubData.stats);

      return tag
        .replace(this.tagNameRegExp("gitstats"), "div")
        .replace(tagContent, transformedContent);
    };

    this._xhtml = this._xhtml.replace(gitStats, stats);

    return this;
  }
  private renderStreaks(): GSRSVGRenderer {
    const gitStreak = /<gitstreak(\s|.)*?>(\s|.)*?<\/gitstreak>/gi;

    const streaks = (tag: string): string => {
      const contributionsTag = {
        count: this.tagRegExp("streakcontributionscount"),
        firstDate: this.tagRegExp("streakcontributionsfirstdate"),
      };
      const currentTag = {
        count: this.tagRegExp("streakcurrentcount"),
        startDate: this.tagRegExp("streakcurrentstartdate"),
        endDate: this.tagRegExp("streakcurrentenddate"),
      };
      const longestTag = {
        count: this.tagRegExp("streaklongestcount"),
        startDate: this.tagRegExp("streaklongeststartdate"),
        endDate: this.tagRegExp("streaklongestenddate"),
      };

      const transform = (tagContent: string, streaks: StreakInfo) => {
        const transformResult = tagContent
          .replace(contributionsTag.count, (tag) => this.toDiv(tag, streaks.contributions.count)) // Replaces <streakcontributionscount> tags with the corresponding template
          .replace(contributionsTag.firstDate, (tag) =>
            this.toDiv(tag, streaks.contributions.firstDate ?? "-"),
          ) // Replaces <streakcontributionsfirstdate> tags with the corresponding template
          .replace(currentTag.count, (tag) => this.toDiv(tag, streaks.currentStreak.count)) // Replaces <streakcurrentcount> tags with the corresponding template
          .replace(currentTag.startDate, (tag) =>
            this.toDiv(tag, streaks.currentStreak.startDate ?? "-"),
          ) // Replaces <streakcurrentstartdate> tags with the corresponding template
          .replace(currentTag.endDate, (tag) =>
            this.toDiv(tag, streaks.currentStreak.endDate ?? "-"),
          ) // Replaces <streakcurrentenddate> tags with the corresponding template
          .replace(longestTag.count, (tag) => this.toDiv(tag, streaks.longestStreak.count)) // Replaces <streaklongestcount> tags with the corresponding template
          .replace(longestTag.startDate, (tag) =>
            this.toDiv(tag, streaks.longestStreak.startDate ?? "-"),
          ) // Replaces <streaklongeststartdate> tags with the corresponding template
          .replace(longestTag.endDate, (tag) =>
            this.toDiv(tag, streaks.longestStreak.endDate ?? "-"),
          ); // Replaces <streaklongestenddate> tags with the corresponding template

        return transformResult;
      };

      const openingTag = this.getOpeningTag(tag, "gitstreak");
      if (!openingTag) return "Syntax error";

      const tagContent = this.getTagContent(tag, "gitstreak");
      if (!tagContent) return "Standard Pattern";

      const transformedContent = transform(tagContent, this._githubData.streak);

      return tag
        .replace(this.tagNameRegExp("gitstreak"), "div")
        .replace(tagContent, transformedContent);
    };

    this._xhtml = this._xhtml.replace(gitStreak, streaks);

    return this;
  }
  private renderTopLanguages(): GSRSVGRenderer {
    const gitTopLangs = /<gittoplangs(\s|.)*?>(\s|.)*?<\/gittoplangs>/gi;

    const topLanguages = (tag: string): string => {
      const langTag = this.tagRegExp("lang");
      const nameTag = this.tagRegExp("langname");
      const percentageTag = this.tagRegExp("langpercentage");

      const transform = (tagContent: string, langList: Lang[]): string => {
        const transformResult = tagContent.replace(langTag, (tag) => {
          const langPosition = this.getAttrValue(tag, "position");
          if (!langPosition) return "Language position not defined";

          const lang = langList[parseInt(langPosition)];
          if (!lang) return "Language position exceeds language list's size";

          const varName = `--gsr-toplang${langPosition}`;
          this._cssVariables[`${varName}-color`] = lang.color;
          this._cssVariables[`${varName}-percentage`] = `${lang.percentage}%`;

          return tag
            .replace(this.tagAttrRegExp("lang", "position"), "") // Removes position attribute
            .replace(this.tagNameRegExp("lang"), "div") // Replaces <lang> with <div>
            .replace(nameTag, (tag) => this.toDiv(tag, lang.name)) // Replaces <langname> tags with the corresponding template
            .replace(percentageTag, (tag) => {
              const showPercent = this.getBooleanAttr(tag, "showPercent");
              const percentage = showPercent ? `${lang.percentage}%` : lang.percentage;
              return this.toDiv(tag, percentage);
            }); // Replaces <langpercentage> tags with the corresponding template
        });

        return transformResult;
      };

      const langMap = this._githubData.topLangs;

      if (!langMap) return "No languages on the list";

      const openingTag = this.getOpeningTag(tag, "gittoplangs");
      if (!openingTag) return "Syntax error";

      const listSize = this.getAttrValue(openingTag, "size");
      if (!listSize) return "Top language tag missing size attribute";

      const tagContent = this.getTagContent(tag, "gittoplangs");
      if (!tagContent) return "Standard Pattern";

      const list = Object.entries(langMap)
        .slice(0, parseInt(listSize))
        .map((curr) => {
          return {
            name: curr[1].name,
            color: curr[1].color,
            size: curr[1].size,
            percentage: "",
          };
        });

      const totalSize = list.reduce((acc, curr) => acc + curr.size, 0);

      for (const lang of list) {
        lang.percentage = ((lang.size * 100) / totalSize).toFixed(2);
      }

      const transformedContent = transform(tagContent, list);

      return tag
        .replace(this.tagAttrRegExp("gittoplangs", "size"), "") // Removes size attribute
        .replace(this.tagNameRegExp("gittoplangs"), "div") // Replaces <gittoplangs> with <div>
        .replace(tagContent, transformedContent); // Replaces <gittoplangs>'s children with the template}
    };

    this._xhtml = this._xhtml.replace(gitTopLangs, topLanguages);

    return this;
  }
  private renderImages(imageRecord?: Record<string, string>): GSRSVGRenderer {
    const imgTags = this._xhtml.match(/<img(\s|\n|.)*?\/>/gim);
    const sourceAttrs = this._xhtml.match(/(?<=(<img(\s|.)*?src=")).+?(?=")/gim);
    const xmlDecl = /(<!--.*?-->)|(<\?xml.*?>)/gim;

    if (!imgTags || !sourceAttrs || !imageRecord) return this;

    const imgs: string[] = sourceAttrs.map((source) => imageRecord[source]);

    for (let i = 0; i < imgTags.length; i++) {
      const tag = imgTags[i];
      const tagAttr = tag.replace(/(<img)|(src=".*?")|(\/>)/gim, "");
      let img = imgs[i];

      const openingTag = this.getOpeningTag(img, "svg");
      if (!openingTag) continue;

      if (!this.getAttrValue(openingTag, "viewBox")) {
        const width = this.getAttrValue(openingTag, "width");
        const height = this.getAttrValue(openingTag, "height");
        const viewBox = `viewBox="0 0 ${width} ${height}"`;
        img = img.replace(openingTag, (tag) => tag.replace(">", ` ${viewBox}>`));
      }
      img = img
        .replace(xmlDecl, "")
        .replace(openingTag, (tag) => tag.replace(">", ` ${tagAttr ?? ""}>`));

      this._xhtml = this._xhtml.replace(tag, img);
    }

    return this;
  }
  private escapeScripts(): GSRSVGRenderer {
    const scriptTags = /<\/?script>/gim;

    this._xhtml = this._xhtml.replace(scriptTags, "");

    return this;
  }
  private injectCSSReset(): GSRSVGRenderer {
    const reset = `<style>
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
  }
  </style>
  `;
    this._xhtml = reset + this._xhtml;

    return this;
  }
  private scopeStyleTags(scope: string = "scopescopescopescope"): GSRSVGRenderer {
    const styleTag = /<style>(\n|.)+?<\/style>/gim; // Matches style tags
    const atRule = /(?<=(@.+\s))\w+\s+(?={)/gim; // Matches css @rules
    const cssclass = /(?<=>|}\s+)\.?[\w]+((?!%)(.|\n)?)+?(?=({|}))/gim; // Matches css classes
    const imgSelector = /.+?img(.|\n)+?}/gim;

    this._xhtml = this._xhtml.replace(styleTag, (tag) => {
      const atRuleNames = tag.match(atRule);
      // Adds scopes to the css selectors
      let scopedTag = tag.replace(cssclass, (cssclass) =>
        ` .${scope} ${cssclass}`.replace(/\s+/, " "),
      );
      // Replaces img selectors with svg selectors
      scopedTag = scopedTag.replace(imgSelector, (selector) => {
        const img = /(?<=^|\s)img(?=[\s{\n])/gim;
        return selector + "\n" + selector.replace(img, "svg");
      });
      // Adds scopes to the @rules
      atRuleNames?.forEach((name) => {
        scopedTag = scopedTag.replace(new RegExp(name, "g"), `${name}`);
      });

      return scopedTag;
    });

    return this;
  }

  private tagRegExp(tagName: string) {
    return new RegExp(`<${tagName}(\\s|.)*?>(\\s|.)*?</${tagName}\\s*?>`, "gi");
  }
  private tagNameRegExp(tagName: string) {
    return new RegExp(`(?<=<|/)${tagName}(?!\\w)`, "gi");
  }
  private tagAttrRegExp(tagName: string, attrName: string) {
    return new RegExp(`(?<=<${tagName}[\\s\\w="-]*?)${attrName}="\\w+"`, "gim");
  }

  private getOpeningTag(tag: string, tagName: string): string | null {
    const openingTagRgxp = new RegExp(`<${tagName}\\s?(\\s|.)*?>`, "i");
    return tag.match(openingTagRgxp)?.[0] ?? null;
  }
  private getTagContent(tag: string, tagName: string) {
    const regexp = new RegExp(`(?<=<${tagName}(?!\\w)(.)*>)(\\s|.)*?(?=</${tagName}>)`, "gi");
    const tagChildren = regexp.exec(tag);

    return tagChildren ? tagChildren.at(0) : null;
  }
  private getAttrValue(openingTag: string, attrName: string): string | null {
    const attrValueRegexp = new RegExp(`(?<=${attrName}=").+?(?=")`, "i");
    const attrValue = openingTag.match(attrValueRegexp);
    return attrValue ? attrValue.toString() : null;
  }
  private getBooleanAttr(openingTag: string, attrName: string): boolean {
    return openingTag.match(attrName) ? true : false;
  }

  private removeNewLines(html: string): string {
    const newLines = /\n+/gm;
    const whiteSpaces = /\s+/gm;
    return html.replace(newLines, "\n").replace(whiteSpaces, " ");
  }

  private toDiv(tag: string, content: string | number) {
    const classValue = this.getAttrValue(tag, "class");
    const styleValue = this.getAttrValue(tag, "style");
    const classAttr = classValue ? `class="${classValue}"` : "";
    const styleAttr = styleValue ? `style="${styleValue}"` : "";

    return `<div ${classAttr} ${styleAttr}>${content}</div>`;
  }
}
