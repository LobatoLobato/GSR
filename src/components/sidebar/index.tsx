import React, { useEffect, useState } from "react";
import "./sidebar.scss";
import DropDown from "react-dropdown";

interface Props {
  onThemeChange: (theme: string) => void;
}
export default function SideBar(props: Props) {
  const [showSidebar, setShowSidebar] = useState(false);
  return (
    <div
      className={`sidebar ${
        showSidebar
          ? "fixed right-0 lg:relative w-2/12 pb-2"
          : "fixed right-0 w-fit h-fit"
      }`}
    >
      <div
        className={`showSidebarBtn ${showSidebar ? "" : "rounded-bl-sm"}`}
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
      {showSidebar ? (
        <div className="w-full h-full">
          <ThemeSelector onInput={props.onThemeChange} />
        </div>
      ) : (
        ""
      )}
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
