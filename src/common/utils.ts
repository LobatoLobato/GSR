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

export { htmlFormatter };

/*
extensions={[html()]}
        placeholder="Write your html code"
        value={exampleCode}
        className="editor"
        height="100%"
        theme={
          props.theme
            ? props.theme === ("dark" || "light")
              ? props.theme
              : { ...themes }[props.theme]
            : "dark"
        }
        onChange={sendCode}

*/
