import { useEffect, useRef, useState } from "react";
import "./sidebar.scss";

import DropDown from "react-dropdown";

import { RepositoryList } from "../../fetchers";

import { list as MonacoThemeList } from "../../assets/themes";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark } from "@fortawesome/free-regular-svg-icons";
import { faBars, faCheck } from "@fortawesome/free-solid-svg-icons";
import {
  loadCodeFromDB,
  LoadCodeFromDBResponse,
  uploadCodeToDB,
} from "../../service/api";
import { LoginButton } from "./LoginButton";

interface Props {
  onThemeChange: (theme: string) => void;
  onUsernameChange: (username: string) => void;
  onLoadFromDB: (data: LoadCodeFromDBResponse) => void;
  code?: string;
  repoList?: RepositoryList;
}

export function SideBar(props: Props) {
  const usernameInput = useRef<HTMLInputElement>(null);
  const [showSidebar, setShowSidebar] = useState(false);
  const [sidebarClassName, setSidebarClassName] = useState(
    "fixed left-0 z-10 w-full lg:w-fit h-fit hover:bg-green-500",
  );
  const [showSidebarBtnClassName, setShowSidebarBtnClassName] = useState(
    "relative rounded-br-sm px-2",
  );
  const [showApiFunctions, setShowApiFunctions] = useState(false);
  const [contentClassName, setContentClassName] = useState("hidden");
  const [showHelp, setShowHelp] = useState(false);
  const [username, setUsername] = useState("");
  const [dbToken, setDbToken] = useState("");
  const [token, setToken] = useState("");
  const [requestBody, setRequestBody] = useState({
    code: "",
    githubUsername: "",
    dbToken: "",
  });

  const handleLoad = async () => {
    setToken("Loading...");
    loadCodeFromDB({ dbToken }).then((response) => {
      props.onLoadFromDB(response);
      const { githubUsername, cssVariables, cssUserCode, htmlCode } = response;

      const code =
        `<style>${cssVariables}</style> <style>${cssUserCode}</style> ${htmlCode}`.replace(
          /\n/gim,
          "",
        );
      setRequestBody({
        code,
        githubUsername,
        dbToken,
      });
      setToken(dbToken);
      setUsername(githubUsername);
      props.onUsernameChange(githubUsername);
    });
  };
  const handleUpload = () => {
    if (!props.code) return;
    const newRequestBody = {
      ...requestBody,
      code: props.code.replace(/\n/gm, ""),
    };

    setToken("Uploading...");
    uploadCodeToDB(newRequestBody).then((response) => {
      window.setTimeout(() => {
        setToken(response.data.registeredId);
      }, 200);
    });
    setRequestBody(newRequestBody);
  };

  const handleUsernameSubmit = (ev: React.MouseEvent | React.FormEvent) => {
    ev.preventDefault();
    const input = usernameInput.current;
    if (!input) return;

    setRequestBody({
      ...requestBody,
      githubUsername: input.value,
      dbToken,
    });
    setUsername(input.value);
    props.onUsernameChange(input.value);
    if (usernameInput.current) usernameInput.current.value = "";
  };

  return (
    <div className={`sidebar ${sidebarClassName}`}>
      <HelpPopup
        show={showHelp}
        onClosed={() => setShowHelp(false)}
      ></HelpPopup>
      <div
        className={`showSidebarBtn ${showSidebarBtnClassName}`}
        onClick={() => {
          const className = !showSidebar ? "show" : "hide";
          setShowSidebarBtnClassName(className);
          setSidebarClassName(className);
          setContentClassName(className);
          setShowSidebar(!showSidebar);
        }}
      >
        <FontAwesomeIcon className="icon" icon={faBars}></FontAwesomeIcon>
      </div>
      <div className={`content ${contentClassName}`}>
        <LoginButton
          onLogin={(token) => {
            setDbToken(token);
            setShowApiFunctions(true);
          }}
          onLogout={() => {
            setDbToken("");
            setToken("");
            setShowApiFunctions(false);
          }}
        ></LoginButton>
        {showApiFunctions && (
          <div className="githubStats w-full gap-1">
            <h3> API </h3>
            <div className="flex justify-between w-full">
              <button className="login-github w-full" onClick={handleLoad}>
                Load
              </button>
              <button className="login-github w-full" onClick={handleUpload}>
                Upload
              </button>
            </div>
            <div className="w-full mx-2 pb-1 bg-white bg-opacity-5 overflow-x-auto scrollbar-thin scrollbar-thumb-[#ffffff30] scrollbar-track-transparent">
              <h4 className="text-sm bg-zinc-600">Token</h4>
              <p className="text-xs">{token ? token : dbToken}</p>
            </div>
          </div>
        )}
        <div className="githubStats">
          <h3>Github Stats</h3>
          <div className="usernameInput">
            <label className="text-sm" htmlFor="username">
              Username
            </label>
            <p className="text-xs">{username}</p>
            <form className="flex" onSubmit={handleUsernameSubmit}>
              <input
                ref={usernameInput}
                id="username"
                type="text"
                className="w-11/12 text-black text-sm text-center h-5"
              />
              <FontAwesomeIcon
                className="bg-zinc-500 cursor-pointer hover:bg-zinc-400 text-black h-5 px-0.5 w-4"
                icon={faCheck}
                onClick={handleUsernameSubmit}
              />
            </form>
          </div>
          <RepoList list={props.repoList}></RepoList>
          <button className="helpBtn" onClick={() => setShowHelp(true)}>
            HELP
          </button>
        </div>
      </div>
    </div>
  );
}

const themeList = [
  {
    value: "vs-dark",
    label: "vs-dark",
    className: "dark",
  },
  {
    value: "vs-light",
    label: "vs-light",
    className: "light",
  },
  ...MonacoThemeList.map((theme) => ({
    value: theme.key,
    label: theme.key,
    className: theme.type,
  })),
];
export function ThemeSelector(props: {
  onInput: (selectedOption: string) => void;
}) {
  const [themeOpts, setThemeOpts] = useState([
    { value: "value", label: "label", className: "className" },
  ]);
  const [selectedTheme, setSelectedTheme] = useState("vs-dark");

  useEffect(() => {
    setThemeOpts(themeList);
  }, [setThemeOpts]);

  return (
    <div className="themeSelector">
      <h3>Editor Theme</h3>
      <DropDown
        options={themeOpts}
        placeholder={selectedTheme}
        menuClassName={`menu `}
        placeholderClassName={
          themeList.find((a) => a.label === selectedTheme)?.className
        }
        className="h-full w-[90%]"
        onChange={(ev) => {
          setSelectedTheme(ev.value);
          props.onInput(ev.value);
        }}
      />
    </div>
  );
}
function RepoList(props: { list: RepositoryList | undefined }) {
  return (
    <div className="flex flex-col gap-2 w-full">
      <p className="text-sm text-center w-full">Repository List</p>
      <ul className="repoList">
        {props.list
          ? Object.entries(props.list).map((curr, index) => {
              const repo = curr[1];
              const color = repo.primaryLanguage
                ? repo.primaryLanguage.color
                : "#FFFFFF";
              const background =
                index % 2 === 0 ? "bg-[#383838]" : "bg-[transparent]";
              const languageName = repo.primaryLanguage
                ? repo.primaryLanguage.name
                : "undefined";
              return (
                <Repo
                  className={`py-[0.125rem] hover:bg-[#444] ${background}`}
                  key={repo.name}
                  background={background}
                  color={color}
                  name={repo.name}
                  languageName={languageName}
                ></Repo>
              );
            })
          : ""}
      </ul>
    </div>
  );
}
function Repo(props: {
  color: string;
  background: string;
  name: string;
  languageName: string;
  key: string;
  className: string;
}) {
  const [showLanguage, setShowLanguage] = useState(false);
  return (
    <li
      className={`${props.className} ${showLanguage ? "bg-[#555444]" : ""}`}
      style={{ color: props.color }}
      key={props.name}
      onClick={() => setShowLanguage(!showLanguage)}
    >
      {props.name}
      {/* {showLanguage ? props.languageName : props.name} */}
    </li>
  );
}
function HelpPopup(props: { onClosed: () => void; show: boolean }) {
  const [showStats, setShowStats] = useState(false);
  const [showStreak, setShowStreak] = useState(false);
  const [showTopLanguages, setShowTopLanguages] = useState(false);
  const [showRepositories, setShowRepositories] = useState(false);
  const hideAll = () => {
    setShowStats(false);
    setShowStreak(false);
    setShowRepositories(false);
    setShowTopLanguages(false);
  };
  return props.show ? (
    <div className="helpPopup animate-fadeIn">
      <div className="navbar">
        <div className="topics">
          <h2
            onClick={() => {
              hideAll();
              setShowStats(!showStats);
            }}
          >
            Stats
          </h2>
          <h2
            onClick={() => {
              hideAll();
              setShowStreak(!showStreak);
            }}
          >
            Streak
          </h2>
          <h2
            onClick={() => {
              hideAll();
              setShowTopLanguages(!showTopLanguages);
            }}
          >
            Top Languages
          </h2>
          <h2
            onClick={() => {
              hideAll();
              setShowRepositories(!showRepositories);
            }}
          >
            Repositories
          </h2>
        </div>
        <button onClick={() => props.onClosed()}>
          <FontAwesomeIcon
            className="icon"
            icon={faCircleXmark}
          ></FontAwesomeIcon>
        </button>
      </div>
      <div className={showStats ? "topic" : "hidden"}>
        <h2 className="text-xl">STATS</h2>
      </div>
      <div className={showStreak ? "topic" : "hidden"}>
        <h2 className="text-xl">STREAK</h2>
      </div>
      <div className={showTopLanguages ? "topic" : "hidden"}>
        <h2 className="text-xl">TOP LANGUAGES</h2>
      </div>
      <div className={showRepositories ? "topic" : "hidden"}>
        <h2 className="text-xl">REPOSITORIES</h2>
      </div>
    </div>
  ) : (
    <></>
  );
}

// function ToolTip(props: { text: string }) {
//   return (
//     <p className="absolute top-0 z-20 select-none hidden bg-gray-800 px-2 box-border -left-2 w-[300%] group-hover:flex">
//       {props.text}
//     </p>
//   );
// }
