const fetchTopLanguages = async (username: string, size: number) => {
  const repos = await (
    await fetch(`https://api.github.com/users/${username}/repos`)
  ).json();

  let languageMap: { [key: string]: number } = {};
  for (const repo of repos) {
    const usedLanguages = Object.entries(await fetchLangs(repo.languages_url));
    languageMap = usedLanguages.reduce(
      (acc, [key, value]) => ({ ...acc, [key]: (acc[key] || 0) + value }),
      { ...languageMap },
    );
  }
  const initialValue: { [key: string]: number } = {};
  const sortedMap = Object.entries(languageMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, size)
    .reduce(
      (acc, [key, value]) => ({
        ...acc,
        ...{ [key]: value },
      }),
      initialValue,
    );

  return sortedMap;
};
async function fetchLangs(langUrl: string): Promise<{ [key: string]: number }> {
  const response = await fetch(langUrl);
  return await response.json();
}

export default fetchTopLanguages;
