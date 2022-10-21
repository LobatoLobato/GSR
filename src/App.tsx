import { useEffect, useState } from "react";
import "./App.scss";
import Editor from "./components/editor";
import Preview from "./components/preview";
import SideBar from "./components/sidebar";
import fetchTopLanguages from "./fetchers/topLanguagesFetcher";

function App() {
  const [editorTxt, setEditorTxt] = useState("");
  const [editorTheme, setEditorTheme] = useState("dark");

  useEffect(() => {
    fetchTopLanguages("lobatolobato", 5).then((topLangs) =>
      console.log(topLangs),
    );
  });

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
