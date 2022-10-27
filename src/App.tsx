import { useState } from "react";
import "./App.scss";
import Editor from "./components/editor";
import Preview from "./components/preview";
import SideBar from "./components/sidebar";

function App() {
  const [editorTxt, setEditorTxt] = useState("");
  const [editorTheme, setEditorTheme] = useState("dark");
  const [username, setUsername] = useState("");
  return (
    <div className="App">
      <div className="mainContent">
        <Preview xhtml={editorTxt} username={username} />
        <Editor
          theme={editorTheme}
          onInput={(code) => {
            setEditorTxt(code);
          }}
        />
      </div>
      <SideBar onThemeChange={setEditorTheme} onUsernameChange={setUsername} />
    </div>
  );
}

export default App;
