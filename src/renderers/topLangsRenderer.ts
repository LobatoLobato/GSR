import { LanguageMap } from "../fetchers/topLanguagesFetcher";

function renderTopLanguages(tag: string, langList: LanguageMap) {
  let element = "";
  // langList.map.forEach((lang, index) => {
  //   const langName = lang[0];
  //   const langPercentage = ((100 * lang[1]) / langList.totalValue).toFixed(2);
  //   element += `<div class="topLang${index}">
  //   <p class="langName">${langName}</p>
  //   <p class="langPercentage">${langPercentage}%</p>
  //   </div>`;
  // });

  return `<div class="topLangsContainer">${element}</div>`;
}

export { renderTopLanguages };
