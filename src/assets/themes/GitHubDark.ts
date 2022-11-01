import { editor } from "monaco-editor/esm/vs/editor/editor.api";
const GitHubDark: editor.IStandaloneThemeData = {
  base: "vs-dark",
  inherit: true,
  rules: [
    { token: "", background: "#161B22" },
    { token: "comment", foreground: "#999988" },
    { token: "tag", foreground: "#7EE787" },
    { token: "delimiter.html", foreground: "#EFF5FB" },
    { token: "attribute.name.html", foreground: "#77BDFB" },
    { token: "attribute.value.html", foreground: "#9CCBF2" },
    { token: "attribute.name.css", foreground: "#9CCBF2" },
    { token: "attribute.value.css", foreground: "#CCA4F9" },
    { token: "attribute.value.number.css", foreground: "#9CCBF2" },
    { token: "attribute.value.unit.css", foreground: "#CCC1C7" },
    { token: "keyword", foreground: "#ED746C" },
    { token: "string", foreground: "#9CCBF2" },
    { token: "number", foreground: "#9CCBF2" },
  ],
  colors: {
    "editor.foreground": "#EFF5FB",
    "editor.background": "#161B22",
    "editor.selectionBackground": "#B4D5FE",
    "editor.lineHighlightBackground": "#404040",
    "editorCursor.foreground": "#666666",
    "editorWhitespace.foreground": "#BBBBBB",
  },
};

export default GitHubDark;
