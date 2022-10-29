import React, { useEffect, useState } from "react";
import "./editor.scss";

import CodeMirror, { BasicSetupOptions } from "@uiw/react-codemirror";
import * as themes from "@uiw/codemirror-themes-all";
import { html } from "@codemirror/lang-html";
import { css } from "@codemirror/lang-css";
import {
  cssFormatter,
  CSSVariablesStr,
  htmlFormatter,
} from "../../common/utils";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCss3, faHtml5 } from "@fortawesome/free-brands-svg-icons";
import { faWindowMaximize } from "@fortawesome/free-regular-svg-icons";
import {
  faWindowMinimize,
  faCaretUp,
  faCaretDown,
} from "@fortawesome/free-solid-svg-icons";

interface Props {
  onInput(code: string): void;
  onMaximized: () => void;
  onMinimized: () => void;
  theme?: string;
  className?: string;
}
const basicSetup: BasicSetupOptions = {
  foldGutter: true,
};
export default function Editor(props: Props) {
  const [maximized, setMaximized] = useState(false);
  const [timeoutId, setTimeoutId] = useState(0);
  const [showHTMLEditor, setShowHTMLEditor] = useState(true);
  const [showCSSEditor, setshowCSSEditor] = useState(false);

  const [code, setCode] = useState(exampleCode);
  const [HTMLEditorCode, setHTMLEditorCode] = useState(exampleCode);
  const [CSSEditorCode, setCSSEditorCode] = useState("");
  const [cssVariablesEditorCode, setCSSVariableEditorCode] = useState("");

  const [prevCSSVariables, setPrevCSSVariables] = useState("");
  const [formattingActive, setformattingActive] = useState(false);

  const sendCode = (HTMLCode: string, CSSCode: string) => {
    window.clearTimeout(timeoutId);

    setCode(code);

    if (CSSVariablesStr !== prevCSSVariables) {
      const template = `<style>:root{${CSSVariablesStr}}</style>\n`;
      if (CSSVariablesStr) {
        setCSSVariableEditorCode(htmlFormatter(template));
        setPrevCSSVariables(CSSVariablesStr);
      } else {
        setCSSVariableEditorCode("");
        setPrevCSSVariables("");
      }
    }

    const newTimeoutId = window.setTimeout(() => {
      const cssCode = `<style> ${CSSCode} </style>\n`;
      const cssVariablesCode = `<style>:root{${CSSVariablesStr}}</style>\n`;
      props.onInput(htmlFormatter(cssVariablesCode + cssCode + HTMLCode));
    }, 1000);

    setTimeoutId(newTimeoutId);
  };

  const formatEditorCode = (ev: React.KeyboardEvent) => {
    if (formattingActive || code === HTMLEditorCode) return;
    if (!(ev.shiftKey && ev.altKey && /f/i.test(ev.key))) return;

    setHTMLEditorCode(code);
    setTimeout(() => {
      setHTMLEditorCode(htmlFormatter(code));
    }, 400);
    setformattingActive(true);
    console.log("Formatting code...");
  };
  const releaseShortcuts = (ev: React.KeyboardEvent) => {
    const formatShortcutPressed = ev.shiftKey || ev.altKey || /f/i.test(ev.key);
    let releasedShortcut = false;
    if (formatShortcutPressed && formattingActive) {
      setformattingActive(false);
      console.log("Format shortcut released");
      releasedShortcut = true;
    }
    if (releasedShortcut) console.log("Released shortcuts");
  };

  // useEffect(() => {
  //   props.onInput(exampleCode);
  // }, []);

  return (
    <div className={`editorContainer ${props.className}`}>
      <div className="navbar">
        <FontAwesomeIcon
          className={`icon html-icon ${showHTMLEditor ? "selected" : ""}`}
          icon={faHtml5}
          onClick={() => {
            setShowHTMLEditor(true);
            setshowCSSEditor(false);
          }}
        ></FontAwesomeIcon>
        <FontAwesomeIcon
          className={`icon css-icon ${showCSSEditor ? "selected" : ""}`}
          icon={faCss3}
          onClick={() => {
            setshowCSSEditor(true);
            setShowHTMLEditor(false);
          }}
        ></FontAwesomeIcon>
        <h2 className="title"> Editor </h2>
        <FontAwesomeIcon
          className="window-resize-icon"
          icon={maximized ? faWindowMinimize : faWindowMaximize}
          onClick={() => {
            maximized ? props.onMinimized() : props.onMaximized();
            setMaximized(!maximized);
          }}
        ></FontAwesomeIcon>
      </div>
      <HTMLEditor
        className={showHTMLEditor ? "" : "hidden"}
        theme={props.theme}
        code={HTMLEditorCode}
        onChange={(value) => {
          setHTMLEditorCode(value);
          sendCode(value, CSSEditorCode);
        }}
        onKeyDown={formatEditorCode}
        onKeyUp={releaseShortcuts}
      ></HTMLEditor>
      <CSSEditor
        className={showCSSEditor ? "" : "hidden"}
        theme={props.theme}
        code={CSSEditorCode}
        onChange={(value) => {
          setCSSEditorCode(value);
          sendCode(HTMLEditorCode, value);
        }}
        onKeyDown={formatEditorCode}
        onKeyUp={releaseShortcuts}
      ></CSSEditor>
      <CSSVariablesEditor
        code={cssFormatter(`:root{${CSSVariablesStr}}\n`)}
        theme={props.theme}
      ></CSSVariablesEditor>
    </div>
  );
}
interface HTMLEditorProps {
  onChange: (value: string) => void;
  onKeyDown: (event: React.KeyboardEvent) => void;
  onKeyUp: (event: React.KeyboardEvent) => void;
  className?: string;
  code: string;
  theme?: string;
}
function HTMLEditor(props: HTMLEditorProps) {
  return (
    <CodeMirror
      placeholder="Write your html code"
      value={props.code}
      className={`editor ${props.theme} ${props.className}`}
      height="100%"
      theme={getTheme(props.theme)}
      onChange={props.onChange}
      onKeyDown={props.onKeyDown}
      onKeyUp={props.onKeyUp}
      basicSetup={basicSetup}
      extensions={[
        html({
          extraTags: {
            gitrepo: { attrs: { name: null } },
            reponame: { attrs: { showOwner: null } },
            repodescription: {},
            repolanguage: {},
            repostarcount: {},
            repoForkCount: {},
            gittoplangs: { attrs: { size: null } },
            lang: { attrs: { position: null } },
            langName: {},
            langPercentage: {},
            gitstreak: {},
            gitstats: {},
          },
        }),
      ]}
    />
  );
}
interface CSSEditorProps {
  onChange: (value: string) => void;
  onKeyDown: (event: React.KeyboardEvent) => void;
  onKeyUp: (event: React.KeyboardEvent) => void;
  className?: string;
  code: string;
  theme?: string;
}
function CSSEditor(props: CSSEditorProps) {
  return (
    <CodeMirror
      placeholder="Write your css code"
      value={props.code}
      className={`css-editor ${props.theme} ${props.className}`}
      height="100%"
      theme={getTheme(props.theme)}
      onChange={props.onChange}
      onKeyDown={props.onKeyDown}
      onKeyUp={props.onKeyUp}
      basicSetup={basicSetup}
      extensions={[css()]}
    />
  );
}
function CSSVariablesEditor(props: {
  code: string;
  theme: string | undefined;
}) {
  const [collapsed, setCollapsed] = useState(true);
  return (
    <div className="variables-editor-container">
      <div className="titlebar">
        <h3 className="title">CSS Variables</h3>
        <FontAwesomeIcon
          className="collapse-icon"
          icon={collapsed ? faCaretUp : faCaretDown}
          onClick={() => setCollapsed(!collapsed)}
        ></FontAwesomeIcon>
      </div>
      <CodeMirror
        extensions={[css()]}
        placeholder="Your css variables go here"
        value={props.code}
        className={`variablesEditor ${props.theme} ${
          collapsed ? "minimize" : "maximize"
        }`}
        height="100%"
        theme={getTheme(props.theme)}
        readOnly={true}
        // onChange={sendCode}
        // onKeyDown={formatEditorCode}
        // onKeyUp={releaseShortcuts}
        basicSetup={basicSetup}
      />
    </div>
  );
}

function getTheme(theme: string | undefined) {
  if (!theme) return "dark";
  return theme === "dark" || theme === "light" ? theme : { ...themes }[theme];
}
const exampleCode = `<style>
  @import url("https://fonts.googleapis.com/css2?family=Poppins&display=swap");
  @keyframes AnimationName {
    0% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0% 50%;
    }
  }
  .container {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    font-family: "Poppins", sans-serif;
    width: 100%;
    height: 93.6vh;
    text-align: center;
    font-size: 20px;
    color: white;
    background: linear-gradient(270deg, #27a081, #a07527, #a02727);
    background-size: 600% 600%;
    animation: AnimationName 2s ease infinite;
  }
  .container p {
    background: #00000020;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
  }
  a {
    height: 20px;
  }
  a img {
    height: 100%;
  }
  .repositories {
    display: flex;
  }
  .repoContainer {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: start;
    width: fit-content;
    margin: auto;
    padding: 16px;
    background: #00000040;
    border: 3px solid black;
    border-radius: 8px;
    gap: 4px;
  }
  .repoContainer p {
    all: unset;
  }
  .repoContainer .reponame {
    color: yellow;
  }
  .repoContainer .counters {
    display: flex;
    gap: 4px;
    align-items: center;
    height: 20px;
  }
  .repoContainer .counters img {
    width: 20px;
    height: 20px;
  }
  .repoContainer .counters p {
    height: 100%;
    padding-bottom: 5px;
  }
  .topLangs {
    display: flex;
    flex-direction: column;
    padding: 16px;
    background: #00000040;
    border: 3px solid black;
    border-radius: 8px;
    width: fit-content;
    margin: auto;
    gap: 8px;
  }
  .topLangs .langbarall {
    display: flex;
    overflow: hidden;
    height: 8px;
    background: white;
    width: 100%;
    border-radius: 4px;
  }
  .langsContainer {
    display: grid;
    grid-template-columns: 6fr 6fr 6fr;
    justify-content: space-between;
    align-items: start;
    gap: 4px;
  }
  .langContainer p {
    background: transparent;
  }
  .langContainer .name {
    background: #ffffff80;
    border-radius: 4px;
    padding-left: 4px;
    padding-right: 4px;
  }
  .langContainer .percentage {
    font-size: 16px;
  }
  .langContainer .langbar {
    overflow: hidden;
    height: 8px;
    background: white;
    border-radius: 4px;
  }
</style>

<div class="container">
  <p>Example Code</p>
  <p>Hello World</p>
  <div>
    <gittoplangs size="6" class="topLangs">
      <h2>Most Used Languages:</h2>
      <div class="langbarall">
        <langbarall></langbarall>
      </div>
      <div class="langsContainer">
        <lang class="langContainer" position="0">
          <langName class="name"></langName>
          <langPercentage class="percentage"></langPercentage>
          <div class="langbar">
            <langbar></langbar>
          </div>
        </lang>
        <lang class="langContainer" position="1">
          <langName class="name"></langName>
          <langPercentage class="percentage"></langPercentage>
          <div class="langbar">
            <langbar></langbar>
          </div>
        </lang>
        <lang class="langContainer" position="2">
          <langName class="name"></langName>
          <langPercentage class="percentage"></langPercentage>
          <div class="langbar">
            <langbar></langbar>
          </div>
        </lang>
        <lang class="langContainer" position="3">
          <langName class="name"></langName>
          <langPercentage class="percentage"></langPercentage>
          <div class="langbar">
            <langbar></langbar>
          </div>
        </lang>
        <lang class="langContainer" position="4">
          <langName class="name"></langName>
          <langPercentage class="percentage"></langPercentage>
          <div class="langbar">
            <langbar></langbar>
          </div>
        </lang>
        <lang class="langContainer" position="5">
          <langName class="name"></langName>
          <langPercentage class="percentage"></langPercentage>
          <div class="langbar">
            <langbar></langbar>
          </div>
        </lang>
      </div>
    </gittoplangs>
  </div>
  <div>
    <h2>Repositories:</h2>
    <br />
    <div class="repositories">
      <gitrepo name="0" class="repoContainer">
        <reponame showOwner class="reponame"></reponame>
        <repodescription></repodescription>
        <repolanguage></repolanguage>
        <div class="counters">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/57/FA_star.svg/1024px-FA_star.svg.png"
          />
          <repostarcount></repostarcount>
        </div>
        <div class="counters">
          <img
            src="https://user-images.githubusercontent.com/17777237/54873012-40fa5b00-4dd6-11e9-98e0-cc436426c720.png"
          />
          <repoforkCount></repoforkCount>
        </div>
      </gitrepo>
      <gitrepo name="1" class="repoContainer">
        <reponame class="reponame"></reponame>
        <repodescription></repodescription>
        <repolanguage></repolanguage>
        <div class="counters">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/57/FA_star.svg/1024px-FA_star.svg.png"
          />
          <repostarcount></repostarcount>
        </div>
        <div class="counters">
          <img
            src="https://user-images.githubusercontent.com/17777237/54873012-40fa5b00-4dd6-11e9-98e0-cc436426c720.png"
          />
          <repoforkCount></repoforkCount>
        </div>
      </gitrepo>
      <gitrepo name="2" class="repoContainer">
        <reponame showOwner class="reponame"></reponame>
        <repodescription></repodescription>
        <repolanguage></repolanguage>
        <div class="counters">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/57/FA_star.svg/1024px-FA_star.svg.png"
          />
          <repostarcount></repostarcount>
        </div>
        <div class="counters">
          <img
            src="https://user-images.githubusercontent.com/17777237/54873012-40fa5b00-4dd6-11e9-98e0-cc436426c720.png"
          />
          <repoforkCount></repoforkCount>
        </div>
      </gitrepo>
    </div>
  </div>
  <p>
    More info on:
    <a href="https://github.com/LobatoLobato/github-styledreadme-creator">
      <img src="https://cdn-icons-png.flaticon.com/512/25/25231.png" />
    </a>
  </p>
</div>

`;
