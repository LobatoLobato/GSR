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
  const styleTagRegexp = /<style>(\n|.)+?<\/style>/gim;
  const classFinderRegexp = /(?<=>|;|})\s*\.?[a-zA-Z*](.?)+?(?=({|}))/gim;
  const atRuleFinderRegexp = /(?<=(@.+\s))\w+\s+(?={)/gim;

  let scopedXhtml = xhtml.replace(styleTagRegexp, (tag) => {
    const atRuleNames = tag.match(atRuleFinderRegexp);
    let scopedTag = tag.replace(classFinderRegexp, (cssclass) =>
      ` .${scope} ${cssclass}`.replace(/\s+/, " "),
    );
    atRuleNames?.forEach((name) => {
      scopedTag = scopedTag.replace(new RegExp(name, "g"), `${scope}${name}`);
    });

    return scopedTag;
  });

  return { scopedXhtml, scope };
}
function indent(code: string) {
  const newLineRegexp = /(?<=\n)(?=.)|^/g;
  return code.replace(newLineRegexp, "  ");
}

export { htmlFormatter, styleTagScoper };
