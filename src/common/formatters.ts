import prettier from "prettier";
import HTMLParser from "prettier/parser-html";
import CSSParser from "prettier/parser-postcss";

export function htmlFormatter(html: string) {
  const options: prettier.Options = {
    parser: "html",
    plugins: [HTMLParser],
  };
  return prettier.format(styleTagFormatter(html), options);
}
export function htmlFormatWithCursor(html: string, cursorOffset: number) {
  const options: prettier.CursorOptions = {
    parser: "html",
    plugins: [HTMLParser],
    cursorOffset,
  };
  return prettier.formatWithCursor(styleTagFormatter(html), options);
}

export function cssFormatter(css: string) {
  const options: prettier.Options = {
    parser: "css",
    plugins: [CSSParser],
  };
  return prettier.format(css, options);
}
export function cssFormatWithCursor(css: string, cursorOffset: number) {
  const options: prettier.CursorOptions = {
    parser: "css",
    plugins: [CSSParser],
    cursorOffset,
  };
  return prettier.formatWithCursor(css, options);
}
export function styleTagFormatter(html: string) {
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

function indent(code: string) {
  const newLineRegexp = /(?<=\n)(?=.)|^/g;
  return code.replace(newLineRegexp, "  ");
}
