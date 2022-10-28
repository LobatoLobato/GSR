import { useState } from "react";
import "./App.scss";
import Editor from "./components/editor";
import Preview from "./components/preview";
import SideBar from "./components/sidebar";
import { GitHubData } from "./fetchers/gitHubDataFetcher";

function App() {
  const [editorTxt, setEditorTxt] = useState("");
  const [editorTheme, setEditorTheme] = useState("dark");
  const [username, setUsername] = useState("");
  const [githubData, setGithubData] = useState<GitHubData>();
  const [editorClassName, setEditorClassName] = useState("lg:w-1/2 w-full");
  const [previewClassName, setPreviewClassName] = useState("lg:w-1/2 w-full");

  return (
    <div className="App">
      <SideBar
        onThemeChange={setEditorTheme}
        onUsernameChange={setUsername}
        repoList={githubData?.repos}
      />
      <div className="mainContent">
        <Preview
          className={previewClassName}
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
        />
      </div>
    </div>
  );
}

export default App;
