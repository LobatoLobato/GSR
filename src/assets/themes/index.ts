import Dracula from "./Dracula";
import GitHubDark from "./GitHubDark";
import GitHubLight from "./GitHubLight";
import Monokai from "./Monokai";
import { editor } from "monaco-editor/esm/vs/editor/editor.api";

interface ThemeMap extends editor.IStandaloneThemeData {
  base: editor.BuiltinTheme;
  type: string;
}
const themes: { [key: string]: ThemeMap } = {
  Dracula: { ...Dracula, type: "dark" },
  GitHubDark: { ...GitHubDark, type: "dark" },
  GitHubLight: { ...GitHubLight, type: "light" },
  Monokai: { ...Monokai, type: "dark" },
};
const list = Object.entries(themes).map(([key, value]) => ({
  key,
  type: value.type,
}));
export { themes, list };
