import { useEffect, useState } from "react";
import "./preview.scss";
import {
  githubStatsParser,
  htmlFormatter,
  styleTagScoper,
} from "../../common/utils";
import {
  fetchGithubData,
  GitHubData,
  GitHubDataFetcher,
} from "../../fetchers/gitHubDataFetcher";

interface Props {
  xhtml: string;
  username: string;
}

export default function Preview(props: Props) {
  const [githubData, setGithubData] = useState<GitHubData>(
    new GitHubDataFetcher().data,
  );
  useEffect(() => {
    if (props.username) {
      fetchGithubData({ username: props.username }).then((data) =>
        setGithubData(data),
      );
    }
  }, [props.username]);

  return (
    <div className="preview">
      <h2 className="select-none h-8"> Preview </h2>
      <svg xmlns="http://www.w3.org/2000/svg" className="viewBox">
        <foreignObject
          className="xhtmlContainer"
          width="100%"
          height="100%"
          dangerouslySetInnerHTML={{
            __html: createNSDiv(props.xhtml, githubData),
          }}
        ></foreignObject>
      </svg>
    </div>
  );
}

function createNSDiv(xhtml: string, githubData: GitHubData): string {
  const parsedXhtml = githubStatsParser(xhtml, githubData);
  const { scope, scopedXhtml } = styleTagScoper(parsedXhtml);

  return `
  <div xmlns="http://www.w3.org/1999/xhtml" class="${scope}">
    ${htmlFormatter(scopedXhtml)}
  </div>`;
}
