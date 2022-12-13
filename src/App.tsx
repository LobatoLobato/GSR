import { useState } from "react";
import "./App.scss";

import { Editor, Preview, SideBar } from "./components";
import { GitHubData } from "./fetchers";
import { LoadCodeFromDBResponse } from "./service/api";

function App() {
  const [editorTxt, setEditorTxt] = useState("");
  const [editorTheme, setEditorTheme] = useState("vs-dark");
  const [username, setUsername] = useState("");
  const [githubData, setGithubData] = useState<GitHubData>();
  const [editorClassName, setEditorClassName] = useState("lg:w-1/2 w-full");
  const [previewClassName, setPreviewClassName] = useState("lg:w-1/2 w-full");
  const [loadedCode, setLoadedCode] = useState<LoadCodeFromDBResponse>();
  return (
    <div className="App">
      <SideBar
        onThemeChange={setEditorTheme}
        onUsernameChange={setUsername}
        repoList={githubData?.repos}
        code={editorTxt}
        onLoadFromDB={setLoadedCode}
      />
      <div
        className={`mainContent ${
          previewClassName === "maximized"
            ? "maximized"
            : editorClassName === "maximized"
            ? "maximized"
            : ""
        }`}
      >
        <Preview
          className={previewClassName}
          navbarClassName={editorClassName === "maximized" ? "hidden" : ""}
          xhtml={editorTxt}
          username={username}
          onMaximized={() => {
            setPreviewClassName("maximized");
            setEditorClassName("minimized");
          }}
          onMinimized={() => {
            setPreviewClassName("restoreMaximized");
            setEditorClassName("restoreMinimized");
          }}
          onFetch={setGithubData}
        />
        <Editor
          className={editorClassName}
          navbarClassName={previewClassName === "maximized" ? "hidden" : ""}
          theme={editorTheme}
          onMaximized={() => {
            setEditorClassName("maximized");
            setPreviewClassName("minimized");
          }}
          onMinimized={() => {
            setEditorClassName("restoreMaximized");
            setPreviewClassName("restoreMinimized");
          }}
          onInput={(code) => {
            setEditorTxt(code);
          }}
          loadedCode={loadedCode}
        />
      </div>
    </div>
  );
}

export default App;
