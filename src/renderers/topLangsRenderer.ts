import { CSSVariables } from "../common/utils";
import { LanguageMap } from "../fetchers";
import {
  genericTemplate,
  getAttrValue,
  getTagChildren,
  tagAttrRegExp,
  tagNameRegExp,
  tagRegExp,
} from "./utils";

interface Lang {
  name: string;
  color: string;
  size: number;
  percentage: string;
}

export function renderTopLanguages(tag: string, langList: LanguageMap) {
  if (!langList) return "No languages on the list";

  const openingTag = tag.match(/<gittoplangs\s?(\s|.)*?>/i)!.toString();
  if (!openingTag) return "Syntax error";

  const listSize = getAttrValue(openingTag, "size");
  if (!listSize) return "Top language tag missing size attribute";

  const tagChildren = getTagChildren(tag, "gittoplangs");

  if (!tagChildren) return "Standard Pattern";

  let list = Object.entries(langList)
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

  const template = createTemplate(tagChildren, list);

  return tag
    .replace(tagAttrRegExp("gittoplangs", "size"), "") // Removes size attribute
    .replace(tagNameRegExp("gittoplangs"), "div") // Replaces <gittoplangs> with <div>
    .replace(tagChildren, template); // Replaces <gittoplangs>'s children with the template
}

const langTag = tagRegExp("lang");
const nameTag = tagRegExp("langname");
const percentageTag = tagRegExp("langpercentage");

function createTemplate(tagContent: string, langList: Lang[]): string {
  const template = tagContent.replace(langTag, (tag) => {
    const langPosition = getAttrValue(tag, "position");
    if (!langPosition) return "Language position not defined";

    const lang = langList[parseInt(langPosition)];
    if (!lang) return "Language position exceeds language list's size";

    const varName = `--gsr-toplang${langPosition}`;
    CSSVariables[`${varName}-color`] = lang.color;
    CSSVariables[`${varName}-percentage`] = `${lang.percentage}%`;

    return tag
      .replace(tagAttrRegExp("lang", "position"), "") // Removes position attribute
      .replace(tagNameRegExp("lang"), "div") // Replaces <lang> with <div>
      .replace(nameTag, (tag) => genericTemplate(tag, lang.name)) // Replaces <langname> tags with the corresponding template
      .replace(percentageTag, (tag) => genericTemplate(tag, lang.percentage)); // Replaces <langpercentage> tags with the corresponding template
  });

  return template;
}
