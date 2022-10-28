function getAttrValue(openingTag: string, attrName: string): string | null {
  const attrValueRegexp = new RegExp(`(?<=${attrName}=").+?(?=")`, "i");
  const attrValue = openingTag.match(attrValueRegexp);
  return attrValue ? attrValue.toString() : null;
}

function getBooleanAttr(openingTag: string, attrName: string): boolean {
  return openingTag.match(attrName) ? true : false;
}

export { getAttrValue, getBooleanAttr };
