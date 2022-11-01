import Dracula from "./Dracula.json";
import GitHubDark from "./GitHubDark.json";
import GitHubLight from "./GitHubLight.json";
import Monokai from "./Monokai.json";

const themes: { [key: string]: any } = {
  Dracula,
  GitHubDark,
  GitHubLight,
  Monokai,
};
const list = [...Object.keys(themes), "vs-dark", "vs-light"];
export { themes, list };
