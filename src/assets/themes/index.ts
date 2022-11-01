import Dracula from "./Dracula.json";
import GitHubDark from "./GitHubDark.json";
import GitHubLight from "./GitHubLight.json";
import Monokai from "./Monokai.json";

const themes: { [key: string]: any } = {
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
