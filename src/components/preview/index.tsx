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
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWindowMaximize } from "@fortawesome/free-regular-svg-icons";
import { faWindowMinimize } from "@fortawesome/free-solid-svg-icons";

interface Props {
  xhtml: string;
  username: string;
  onMaximized: () => void;
  onMinimized: () => void;
  className?: string;
  onFetch?: (GitHubData: GitHubData) => void;
}

export default function Preview(props: Props) {
  const [githubData, setGithubData] = useState<GitHubData>(
    new GitHubDataFetcher().data,
  );
  const [maximized, setMaximized] = useState(false);
  useEffect(() => {
    if (props.username) {
      fetchGithubData({ username: props.username }).then((data) => {
        setGithubData(data);
        if (props.onFetch) {
          props.onFetch(data);
        }
      });
    }
  }, [props.username]);

  return (
    <div className={`preview ${props.className}`}>
      <div className=" relative flex h-8 w-full px-1 items-center justify-between">
        <h2 className="absolute left-1/2 -translate-x-1/2 select-none ">
          {" "}
          Preview{" "}
        </h2>
        <div
          className="absolute left-[97%] -translate-x-full clickable"
          onClick={() => {
            if (maximized) {
              props.onMinimized();
            } else {
              props.onMaximized();
            }
            setMaximized(!maximized);
          }}
        >
          <FontAwesomeIcon
            className="text-white"
            icon={maximized ? faWindowMinimize : faWindowMaximize}
          ></FontAwesomeIcon>
        </div>
      </div>
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
