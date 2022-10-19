import prettier from "prettier";
import HTMLParser from "prettier/parser-html";

function htmlFormatter(html: string) {
  const options: prettier.Options = {
    parser: "html",
    plugins: [HTMLParser],
  };

  return prettier.format(styleTagFormatter(html), options);
}
function styleTagFormatter(html: string) {
  const styleTagRegexp = /<style>(\n|.)+?<\/style>/gim;
  const allSpacesRegexp = /\s+/gim;
  const bracketSpacesRegexp = /(?<={|;|}|>)\s/gim;
  const classAttributeRegexp = /(?<=({|;)\n)\w/gim;
  return html.replace(styleTagRegexp, (tag) =>
    tag
      .replace(allSpacesRegexp, " ")
      .replace(bracketSpacesRegexp, "\n")
      .replace(classAttributeRegexp, (attribute) => `  ${attribute}`),
  );
}
function styleTagScoper(xhtml: string) {
  const scope = "scopescopescopescope";
  const classFinderRegexp = /(?<=>|;|})\s*\.?[a-zA-Z*](.?)+?(?=({|}))/gim;
  const classes = xhtml.replace(/\n/gim, "").match(classFinderRegexp);
  let scopedXhtml = xhtml;
  if (classes) {
    for (const parsedClass of classes) {
      const newClass = `.${scope} ${parsedClass}`.replace(/\s+/, " ");
      scopedXhtml = scopedXhtml.replace(parsedClass, newClass);
    }
  }

  return { scopedXhtml, scope };
}
export { htmlFormatter, styleTagScoper };
