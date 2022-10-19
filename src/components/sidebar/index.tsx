import React, { useEffect, useState } from "react";
import "./sidebar.css";
import DropDown from "react-dropdown";

interface Props {
  onThemeChange: (theme: string) => void;
}
export default function SideBar(props: Props) {
  return (
    <div className="sidebar">
      <ThemeSelector onInput={props.onThemeChange} />
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
