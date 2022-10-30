function getTagChildren(tag: string, tagName: string) {
  const regexp = new RegExp(
    `(?<=<${tagName}(?!\\w)(.)*>)(\\s|.)*?(?=</${tagName}>)`,
    "gi",
  );
  const tagChildren = regexp.exec(tag);

  return tagChildren ? tagChildren.at(0) : null;
}

function tagRegExp(tagName: string) {
  return new RegExp(`<${tagName}(\\s|.)*?>(\\s|.)*?</${tagName}\\s*?>`, "gi");
}
function getAttrValue(openingTag: string, attrName: string): string | null {
  const attrValueRegexp = new RegExp(`(?<=${attrName}=").+?(?=")`, "i");
  const attrValue = openingTag.match(attrValueRegexp);
  return attrValue ? attrValue.toString() : null;
}

function getBooleanAttr(openingTag: string, attrName: string): boolean {
  return openingTag.match(attrName) ? true : false;
}

function genericTemplate<T>(tag: string, content: T) {
  const classValue = getAttrValue(tag, "class");
  const styleValue = getAttrValue(tag, "style");
  const classAttr = classValue ? `class="${classValue}"` : "";
  const styleAttr = styleValue ? `style="${styleValue}"` : "";

  return `<p ${classAttr} ${styleAttr}>${content}</p>`;
}

export {
  getTagChildren,
  getAttrValue,
  getBooleanAttr,
  genericTemplate,
  tagRegExp,
};
