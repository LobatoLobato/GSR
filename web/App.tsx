import React from "react";
import "./App.scss";

import { Editor, Preview, SideBar } from "./components";

function App() {
  const [editorClassName, setEditorClassName] = React.useState("lg:w-1/2 w-full");
  const [previewClassName, setPreviewClassName] = React.useState("lg:w-1/2 w-full");

  return (
    <div className="App">
      <SideBar />
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
          navbarClassName={previewClassName === "maximized" ? "hidden" : ""}
          theme={"vs-dark"}
          onMaximized={() => {
            setEditorClassName("maximized");
            setPreviewClassName("minimized");
          }}
          onMinimized={() => {
            setEditorClassName("restoreMaximized");
            setPreviewClassName("restoreMinimized");
          }}
        />
      </div>
    </div>
  );
}

export default App;
