import { LanguageMap } from "../fetchers/topLanguagesFetcher";
import { getAttrValue } from "./utils";

interface Lang {
  name: string;
  color: string;
  size: number;
  percentage: string;
}

function renderTopLanguages(tag: string, langList: LanguageMap) {
  if (!langList) return "No languages on the list";

  const openingTag = tag.match(/<gittoplangs\s?(\s|.)*?>/i)!.toString();
  if (!openingTag) return "Syntax error";

  const listSize = getAttrValue(openingTag, "size");
  if (!listSize) return "Top language tag missing size attribute";

  const tagChildren =
    /(?<=<gittoplangs(\s|>)(.)*>)(\s|.)*?(?=<\/gittoplangs>)/gi
      .exec(tag)
      ?.at(0);
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
    .replace(/gittoplangs(?!\w)/gi, "div") // Replaces <gittoplangs> with <div>
    .replace(/size="\w+"/gi, "") // Removes size attribute
    .replace(tagChildren, template); // Replaces <gittoplangs>'s children with the template
}
const langTag = /<lang(\s|.)*?>(\s|.)*?<\/lang\s*?>/gi;
const nameTag = /<langname(\s|.)*?>(\s|.)*?<\/langname\s*?>/gi;
const percentageTag =
  /<langpercentage(\s|.)*?>(\s|.)*?<\/langpercentage\s*?>/gi;
const barTag = /<langbar(?!\w)(\s|.)*?>(\s|.)*?<\/langbar\s*?>/gi;
const barAllTag = /<langbarall(\s|.)*?>(\s|.)*?<\/langbarall\s*?>/gim;

const nameTemplate = (tag: string, lang: Lang) => {
  const nameClass = getAttrValue(tag, "class");
  const classAttr = nameClass ? `class="${nameClass}"` : "";

  const styleAttr = `style="color:${lang.color}"`;

  const name = lang.name;
  return `<p ${classAttr} ${styleAttr}>${name}</p>`;
};
const percentageTemplate = (tag: string, lang: Lang) => {
  const percentageClass = getAttrValue(tag, "class");
  const classAttr = percentageClass ? `class="${percentageClass}"` : "";

  return `<p ${classAttr}>${lang.percentage}%</p>`;
};
const barTemplate = (tag: string, lang: Lang) => {
  const barClass = getAttrValue(tag, "class");
  const classAttr = barClass ? `class="${barClass}"` : "";

  return `<p ${classAttr} style="height: 100%; width: ${lang.percentage}%; background:${lang.color};"></p>`;
};
const barAllTemplate = (tag: string, langList: Lang[]) => {
  const barClass = getAttrValue(tag, "class");
  const classAttr = barClass ? `class="${barClass}"` : "";

  const bars = langList.reduce((acc, curr) => {
    const barPortion = `<p ${classAttr} style="height: 100%; width: ${curr.percentage}%; background:${curr.color};"></p>`;
    return acc + barPortion;
  }, "");
  return bars;
};
function createTemplate(tagContent: string, langList: Lang[]): string {
  const template = tagContent
    .replace(langTag, (tag) => {
      const langPosition = getAttrValue(tag, "position");
      if (!langPosition) return "Language position not defined";
      const lang = langList[parseInt(langPosition)];
      if (!lang) return "Language position exceeds language list's size";

      return tag
        .replace(/lang(?!\w)/gi, "div") // Replaces <lang> with <div>
        .replace(/position="\w+"/gi, "") // Removes position attribute
        .replace(nameTag, (tag) => nameTemplate(tag, lang)) // Replaces <langname> tags with the corresponding template
        .replace(percentageTag, (tag) => percentageTemplate(tag, lang)) // Replaces <langpercentage> tags with the corresponding template
        .replace(barTag, (tag) => barTemplate(tag, lang)); // Replaces <langbar> tags with the corresponding template
    })
    .replace(barAllTag, (tag) => barAllTemplate(tag, langList)); // Replaces <langbarall> tags with the corresponding template

  return template;
}

export { renderTopLanguages };
