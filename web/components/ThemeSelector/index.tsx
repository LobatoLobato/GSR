import React from "react";
import DropDown from "react-dropdown";
import { list as MonacoThemeList } from "../../assets/themes";
import "./themeSelector.scss";

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

export function ThemeSelector(props: { onInput: (selectedOption: string) => void }) {
  const [themeOpts, setThemeOpts] = React.useState([
    { value: "value", label: "label", className: "className" },
  ]);
  const [selectedTheme, setSelectedTheme] = React.useState("vs-dark");

  React.useEffect(() => {
    setThemeOpts(themeList);
  }, [setThemeOpts]);

  return (
    <div className="themeSelector">
      <h3>Editor Theme</h3>
      <DropDown
        options={themeOpts}
        placeholder={selectedTheme}
        menuClassName={`menu `}
        placeholderClassName={themeList.find((a) => a.label === selectedTheme)?.className}
        className="dropdown-container"
        onChange={(ev) => {
          setSelectedTheme(ev.value);
          props.onInput(ev.value);
        }}
      />
    </div>
  );
}
