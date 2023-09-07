import * as prettier from "prettier";
import HTMLParser from "prettier/plugins/html";
import CSSParser from "prettier/plugins/postcss";

type FormatOptions = { language: "css" | "html"; cursorOffset: number };
type Language = "css" | "html";

async function format(code: string, options: FormatOptions): Promise<prettier.CursorResult>;
async function format(code: string, language: Language): Promise<string>;
async function format(code: string, langOrOptions: Language | FormatOptions) {
  const language = typeof langOrOptions === "string" ? langOrOptions : langOrOptions.language;
  const cursorOffset = typeof langOrOptions === "string" ? undefined : langOrOptions.cursorOffset;

  const options: prettier.Options | prettier.CursorOptions = {
    plugins: [HTMLParser, CSSParser],
    parser: language,
    cursorOffset,
  };

  if (language === "html") {
    const formatStyleContent = (styleTag: string) => {
      const tagContent = styleTag.replace(/<\/?style>/gim, "");
      return format(tagContent, "css");
    };
    const indent = (code: string) => code.replace(/^./gm, (s) => `  ${s}`);

    const styleTagRegexp = /<style>(\n|.)+?<\/style>/gim;
    const styleTags = code.match(styleTagRegexp);

    for (const styleTag of styleTags ?? []) {
      const formattedContent = await formatStyleContent(styleTag);
      const indentedContent = indent(formattedContent);
      const newStyleTag = `<style>\n${indentedContent}</style>`;
      code = code.replace(styleTag, newStyleTag);
    }
  }

  if (cursorOffset) {
    return prettier.formatWithCursor(code, options as prettier.CursorOptions);
  }

  return prettier.format(code, options);
}

export default format;
