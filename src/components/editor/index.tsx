import React, { useEffect, useState } from "react";
import "./editor.css";
import CodeMirror from "@uiw/react-codemirror";
import { html } from "@codemirror/lang-html";
import * as themes from "@uiw/codemirror-themes-all";

interface Props {
  onInput(code: string): void;
  theme?: string;
}

export default function Editor(props: Props) {
  const [created, setCreated] = useState(false);
  const [timeoutId, setTimeoutId] = useState({
    sendCode: 0,
  });

  const sendCode = (code: string) => {
    window.clearTimeout(timeoutId.sendCode);
    const newTimeoutId = window.setTimeout(() => {
      props.onInput(code);
    }, 1000);
    setTimeoutId((timeoutId) => ({
      ...timeoutId,
      sendCode: newTimeoutId,
    }));
  };

  useEffect(() => {
    if (created) return;
    props.onInput(exampleCode);
    setCreated(true);
  }, [props, created, setCreated]);

  return (
    <div className={`editorContainer ${props.theme}`}>
      <h2> Editor </h2>
      <CodeMirror
        extensions={[html()]}
        placeholder="Write your html code"
        value={exampleCode}
        className="editor"
        height="100%"
        theme={
          props.theme
            ? props.theme === ("dark" || "light")
              ? props.theme
              : { ...themes }[props.theme]
            : "dark"
        }
        onChange={sendCode}
      />
    </div>
  );
}

const exampleCode = `<style>
  @import url('https://fonts.googleapis.com/css2?family=Poppins&display=swap');
  .container {
    font-family: 'Poppins', sans-serif;
    width: 100%;
    height: 94vh;
    background: #324;
    text-align: center;
    font-size: 20px;
    color: white;
  }
</style>
<div class="container">
  <p>Hello World</p>
</div>
`;
