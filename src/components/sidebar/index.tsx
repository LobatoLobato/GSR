import { useEffect, useState } from "react";
import "./sidebar.scss";
import DropDown from "react-dropdown";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleXmark,
  faSquareCaretDown,
  faSquareCaretUp,
} from "@fortawesome/free-regular-svg-icons";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { RepositoryList } from "../../fetchers/repoFetcher";

interface Props {
  onThemeChange: (theme: string) => void;
  onUsernameChange: (username: string) => void;
  repoList?: RepositoryList;
}
export default function SideBar(props: Props) {
  const [showSidebar, setShowSidebar] = useState(false);
  const [sidebarClassName, setSidebarClassName] = useState(
    "fixed left-0 z-10 w-fit h-fit hover:bg-green-500",
  );
  const [showSidebarBtnClassName, setShowSidebarBtnClassName] = useState(
    "relative rounded-br-sm px-2",
  );
  const [contentClassName, setContentClassName] = useState("hidden");
  const [timeoutId, setTimeoutId] = useState(0);
  const [showHelp, setShowHelp] = useState(false);
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
        <ThemeSelector onInput={props.onThemeChange} />
        <div className="githubStats">
          <h3>Github Stats</h3>
          <div className="usernameInput">
            <label className="text-sm" htmlFor="username">
              Username
            </label>
            <input
              id="username"
              type="text"
              className="w-11/12 text-black text-sm text-center"
              onInput={(ev) => {
                const username = ev.currentTarget.value;
                window.clearInterval(timeoutId);
                const id = window.setTimeout(
                  () => props.onUsernameChange(username),
                  1000,
                );
                setTimeoutId(id);
              }}
            />
          </div>
          <RepoList list={props.repoList}></RepoList>
          <button className="helpBtn" onClick={() => setShowHelp(true)}>
            {" "}
            HELP{" "}
          </button>
        </div>
      </div>
    </div>
  );
}

const themes: { [key: string]: string } = {
  dark: "dark",
  light: "light",
  abcdef: "dark",
  androidstudio: "dark",
  atomone: "dark",
  bbedit: "light",
  bespin: "dark",
  darcula: "dark",
  dracula: "dark",
  duotoneDark: "dark",
  duotoneLight: "light",
  eclipse: "light",
  githubDark: "dark",
  githubLight: "light",
  okaidia: "dark",
  sublime: "dark",
  xcodeDark: "dark",
  xcodeLight: "light",
};
function ThemeSelector(props: { onInput: (selectedOption: string) => void }) {
  const [themeOpts, setThemeOpts] = useState([
    { value: "value", label: "label", className: "className" },
  ]);
  const [selectedTheme, setSelectedTheme] = useState("dark");

  useEffect(() => {
    const themeArray = Object.entries(themes);
    setThemeOpts(
      themeArray.map((theme) => {
        const name = theme[0];
        const style = theme[1];
        return {
          value: name,
          label: name,
          className: style,
        };
      }),
    );
  }, [setThemeOpts]);

  return (
    <div className="themeSelector">
      <h3>Theme</h3>
      <DropDown
        options={themeOpts}
        placeholder={selectedTheme}
        menuClassName="menu"
        placeholderClassName={selectedTheme}
        className="h-full w-[90%] "
        onChange={(ev) => {
          setSelectedTheme(themes[ev.value]);
          props.onInput(ev.value);
        }}
      />
    </div>
  );
}
function RepoList(props: { list: RepositoryList | undefined }) {
  const [showList, setShowList] = useState(false);
  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="flex justify-between px-1 items-center text-center">
        <p className="text-sm">Repository List</p>
        <FontAwesomeIcon
          onClick={() => setShowList(!showList)}
          className="text-red-600 clickable select-none"
          icon={showList ? faSquareCaretUp : faSquareCaretDown}
        ></FontAwesomeIcon>
      </div>
      {showList ? (
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
      ) : (
        ""
      )}
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

function ToolTip(props: { text: string }) {
  return (
    <p className="absolute top-0 z-20 select-none hidden bg-gray-800 px-2 box-border -left-2 w-[300%] group-hover:flex">
      {props.text}
    </p>
  );
}
