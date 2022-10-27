import { useState } from "react";
import "./App.scss";
import Editor from "./components/editor";
import Preview from "./components/preview";
import SideBar from "./components/sidebar";

function App() {
  const [editorTxt, setEditorTxt] = useState("");
  const [editorTheme, setEditorTheme] = useState("dark");

  return (
    <div className="App">
      <div className="mainContent">
        <Preview xhtml={editorTxt} />
        <Editor
          theme={editorTheme}
          onInput={(code) => {
            setEditorTxt(code);
          }}
        />
      </div>
      <SideBar onThemeChange={setEditorTheme} />
    </div>
  );
}

export default App;
