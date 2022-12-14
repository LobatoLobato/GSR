import { useEffect, useRef, useState } from "react";
import "./preview.scss";
import { githubStatsParser } from "../../common/parsers";
import { htmlFormatter } from "../../common/formatters";
import {
  cssResetInjector,
  scriptEscaper,
  styleTagScoper,
} from "../../common/utils";
import { fetchGithubData, GitHubData, GitHubDataFetcher } from "../../fetchers";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWindowMaximize } from "@fortawesome/free-regular-svg-icons";
import {
  faWindowMinimize,
  faSun,
  faMoon,
} from "@fortawesome/free-solid-svg-icons";

interface Props {
  xhtml: string;
  username: string;
  onMaximized: () => void;
  onMinimized: () => void;
  navbarClassName: string;
  className?: string;
  onFetch?: (GitHubData: GitHubData) => void;
}

export function Preview(props: Props) {
  const svg = useRef<SVGSVGElement>(null);
  const [githubData, setGithubData] = useState<GitHubData>(
    new GitHubDataFetcher().data,
  );
  const [maximized, setMaximized] = useState(false);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);
  const username = props.username;
  const onFetch = props.onFetch;
  const handleModeChange = () => {
    setDarkModeEnabled((e) => !e);
  };
  useEffect(() => {
    if (username) {
      fetchGithubData({ username: username }).then((data) => {
        setGithubData(data);
        if (onFetch) {
          onFetch(data);
        }
      });
    }
  }, [username, onFetch]);

  return (
    <div className={`preview ${props.className}`}>
      <div className="navbar">
        <h2 className={`title ${props.navbarClassName}`}> Preview </h2>
        <div className="absolute flex left-[87%] gap-4">
          {darkModeEnabled ? (
            <FontAwesomeIcon
              className="text-yellow-100 clickable w-4"
              icon={faMoon}
              onClick={handleModeChange}
            ></FontAwesomeIcon>
          ) : (
            <FontAwesomeIcon
              className="text-yellow-200 clickable w-4"
              icon={faSun}
              onClick={handleModeChange}
            ></FontAwesomeIcon>
          )}
          <FontAwesomeIcon
            className={`window-resize-icon ${props.navbarClassName}`}
            icon={maximized ? faWindowMinimize : faWindowMaximize}
            onClick={() => {
              maximized ? props.onMinimized() : props.onMaximized();
              setMaximized(!maximized);
            }}
          ></FontAwesomeIcon>
        </div>
      </div>
      <svg xmlns="http://www.w3.org/2000/svg" className="viewBox" ref={svg}>
        <foreignObject
          className={`xhtmlContainer ${
            darkModeEnabled ? "bg-[#292929]" : "bg-white"
          }`}
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
  let preFormattedCode = "";
  try {
    preFormattedCode = htmlFormatter(xhtml);
  } catch (e) {
    const error = e as Error;
    return `
    <div xmlns="http://www.w3.org/1999/xhtml">
      <style>
        .error-view {
          width: 100%;
          height: 94vh;
          overflow: hidden;
          background: transparent;
          resize: none;
          outline: none;
          caret-color: transparent;
          padding: 4px;
        }
      </style>
      <textarea class="error-view" readonly>${error.message}</textarea>
    </div>`;
  }
  const parsedXhtml = githubStatsParser(preFormattedCode, githubData);
  const { scope, scopedXhtml } = styleTagScoper(parsedXhtml);
  return `
    <div xmlns="http://www.w3.org/1999/xhtml" class="${scope}">
      ${scriptEscaper(htmlFormatter(cssResetInjector(scopedXhtml)))}
    </div>`;
}
