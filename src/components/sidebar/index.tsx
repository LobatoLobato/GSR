import { useEffect, useState } from "react";
import "./sidebar.scss";
import DropDown from "react-dropdown";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark } from "@fortawesome/free-regular-svg-icons";
import { faBars } from "@fortawesome/free-solid-svg-icons";
interface Props {
  onThemeChange: (theme: string) => void;
  onUsernameChange: (username: string) => void;
}
export default function SideBar(props: Props) {
  const [showSidebar, setShowSidebar] = useState(false);
  const [timeoutId, setTimeoutId] = useState(0);
  const [showHelp, setShowHelp] = useState(false);

  return (
    <div className={`sidebar ${showSidebar ? "show" : "hide"}`}>
      <HelpPopup
        show={showHelp}
        onClosed={() => setShowHelp(false)}
      ></HelpPopup>

      <div
        className={`showSidebarBtn ${showSidebar ? "show" : "hide"}`}
        onClick={() => {
          setShowSidebar(!showSidebar);
        }}
      >
        <FontAwesomeIcon className="icon" icon={faBars}></FontAwesomeIcon>
      </div>
      <div className={`content ${showSidebar ? "show" : "hide"}`}>
        <ThemeSelector onInput={props.onThemeChange} />
        <div className="githubStats">
          <h3>Github Stats</h3>
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
