import prettier from "prettier";
import HTMLParser from "prettier/parser-html";
import CSSParser from "prettier/parser-postcss";

function htmlFormatter(html: string) {
  const options: prettier.Options = {
    parser: "html",
    plugins: [HTMLParser],
  };
  return prettier.format(styleTagFormatter(html), options);
}

function styleTagFormatter(html: string) {
  const styleTagRegexp = /<style>(\n|.)+?<\/style>/gim;

  const options: prettier.Options = {
    parser: "css",
    plugins: [CSSParser],
  };
  const formatContent = (tag: string) => {
    const tagContent = tag.replace(/<\/?style>/gim, "");
    return prettier.format(tagContent, options);
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
  const cssclass = /(?<=>|;|})\s*\.?[a-zA-Z*](.?)+?(?=({|}))/gim; // Matches css classes
  const selector = /(?<=\.)[a-z]+/gi; // Matches css selectors
  const classDeclaration = /(?<=class=").+(?=")/gi; // Matches element class declarations
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
function indent(code: string) {
  const newLineRegexp = /(?<=\n)(?=.)|^/g;
  return code.replace(newLineRegexp, "  ");
}

export { htmlFormatter, styleTagScoper };
