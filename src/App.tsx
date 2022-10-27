import { useState } from "react";
import "./App.scss";
import Editor from "./components/editor";
import Preview from "./components/preview";
import SideBar from "./components/sidebar";

function App() {
  const [editorTxt, setEditorTxt] = useState("");
  const [editorTheme, setEditorTheme] = useState("dark");
  const [username, setUsername] = useState("");
  const [editorClassName, setEditorClassName] = useState("lg:w-1/2");
  const [previewClassName, setPreviewClassName] = useState("lg:w-1/2");
  return (
    <div className="App">
      <SideBar onThemeChange={setEditorTheme} onUsernameChange={setUsername} />
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
