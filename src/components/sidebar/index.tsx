import React, { useEffect, useState } from "react";
import "./sidebar.scss";
import DropDown from "react-dropdown";

interface Props {
  onThemeChange: (theme: string) => void;
  onUsernameChange?: (username: string) => void;
}
export default function SideBar(props: Props) {
  const [showSidebar, setShowSidebar] = useState(false);
  const [timeoutId, setTimeoutId] = useState(0);
  return (
    <div
      className={`sidebar ${
        showSidebar
          ? "fixed right-0 lg:relative w-2/12 pb-2 animate-grow"
          : "fixed right-0  w-fit h-fit animate-shrinkSideBar hover:bg-green-500"
      }`}
    >
      <div
        className={`showSidebarBtn ${
          showSidebar ? "absolute z-50" : "rounded-bl-sm"
        }`}
        onClick={() => {
          setShowSidebar(!showSidebar);
        }}
      >
        <img
          className="w-6 h-6"
          src="https://freesvg.org/img/menu-icon.png"
          alt="showSidebar"
        />
      </div>
      <div
        className={`content ${
          showSidebar ? "animate-fadeIn flex flex-col" : "hidden"
        }`}
      >
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
              const id = window.setTimeout(() => console.log(username), 1000);
              setTimeoutId(id);
            }}
          />

          <p className="text-sm">Live Preview</p>
          <div className="flex flex-col items-start">
            <div>
              <input id="stats" type="checkbox" />
              <label htmlFor="stats">Stats</label>
            </div>
            <div>
              <input id="streak" type="checkbox" />
              <label htmlFor="streak">Streak</label>
            </div>
            <div>
              <input id="toplangs" type="checkbox" />
              <label htmlFor="toplangs">Top Languages</label>
            </div>
            <div>
              <input id="repos" type="checkbox" />
              <label htmlFor="repos">Repositories</label>
            </div>
          </div>
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
