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
export function Editor(props: Props) {
  const [maximized, setMaximized] = useState(false);
  const [timeoutId, setTimeoutId] = useState(0);
  const [showHTMLEditor, setShowHTMLEditor] = useState(true);
  const [showCSSEditor, setshowCSSEditor] = useState(false);

  const [HTMLCode, setHTMLCode] = useState(htmlExampleCode);
  const [CSSCode, setCSSCode] = useState(cssExampleCode);
  const [HTMLEditorCode, setHTMLEditorCode] = useState(htmlExampleCode);
  const [CSSEditorCode, setCSSEditorCode] = useState(cssExampleCode);

  const [formattingActive, setformattingActive] = useState(false);

  const sendCode = (HTMLCode: string, CSSCode: string) => {
    window.clearTimeout(timeoutId);
    const newTimeoutId = window.setTimeout(() => {
      const concatenatedCode = `<style>:root{${CSSVariablesStr}}</style>\n
      <style>${CSSCode}</style>\n${HTMLCode}`;
      props.onInput(htmlFormatter(concatenatedCode));
    }, 1000);
    setTimeoutId(newTimeoutId);
  };

  const formatHTMLEditorCode = (ev: React.KeyboardEvent) => {
    if (formattingActive || HTMLCode === HTMLEditorCode) return;
    if (!(ev.shiftKey && ev.altKey && /f/i.test(ev.key))) return;

    setHTMLEditorCode(HTMLCode);
    setTimeout(() => {
      setHTMLEditorCode(htmlFormatter(HTMLCode));
    }, 400);
    setformattingActive(true);
    console.log("Formatting code...");
  };
  const formatCSSEditorCode = (ev: React.KeyboardEvent) => {
    if (formattingActive || CSSCode === CSSEditorCode) return;
    if (!(ev.shiftKey && ev.altKey && /f/i.test(ev.key))) return;

    setCSSEditorCode(CSSCode);
    setTimeout(() => {
      setCSSEditorCode(cssFormatter(CSSCode));
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

  useEffect(() => {
    sendCode(htmlExampleCode, cssExampleCode);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
          setHTMLCode(value);
          sendCode(value, CSSCode);
        }}
        onKeyDown={formatHTMLEditorCode}
        onKeyUp={releaseShortcuts}
      ></HTMLEditor>
      <CSSEditor
        className={showCSSEditor ? "" : "hidden"}
        theme={props.theme}
        code={CSSEditorCode}
        onChange={(value) => {
          setCSSCode(value);
          sendCode(HTMLCode, value);
        }}
        onKeyDown={formatCSSEditorCode}
        onKeyUp={releaseShortcuts}
      ></CSSEditor>
      <CSSVariablesEditor
        code={cssFormatter(`:root{${CSSVariablesStr}}`)}
        theme={props.theme}
        onChange={() => {
          sendCode(HTMLCode, CSSCode);
        }}
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
            gitstats: {},
            statpullrequests: {},
            statcommits: {},
            statcontributedto: {},
            statstarsearned: {},
            statissues: {},

            gitstreak: {},
            streakcontributionscount: {},
            streakcontributionsfirstdate: {},
            streakcurrentcount: {},
            streakcurrentenddate: {},
            streakcurrentstartdate: {},
            streaklongestcount: {},
            streaklongestenddate: {},
            streaklongeststartdate: {},

            gittoplangs: { attrs: { size: null } },
            lang: { attrs: { position: null } },
            langName: {},
            langPercentage: {},

            gitrepo: { attrs: { name: null } },
            reponame: { attrs: { showOwner: null } },
            repodescription: {},
            repolanguage: {},
            repostarcount: {},
            repoForkCount: {},
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
  onChange: (value: string) => void;
  code: string;
  theme: string | undefined;
}) {
  const [collapsed, setCollapsed] = useState(true);
  return (
    <div className="variables-editor-container">
      <div className="titlebar">
        <h3 className="title">Generated CSS Variables</h3>
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
        basicSetup={basicSetup}
        onChange={props.onChange}
      />
    </div>
  );
}

function getTheme(theme: string | undefined) {
  if (!theme) return "dark";
  return theme === "dark" || theme === "light" ? theme : { ...themes }[theme];
}
const cssExampleCode = `@import url("https://fonts.googleapis.com/css2?family=Poppins&display=swap");
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
  height: 100%;
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
.stats {
  width: fit-content;
  margin: auto;
  padding: 10px;
  background: #00000040;
  border: 3px solid black;
  border-radius: 8px;
  gap: 4px;
}
.stats p {
  all: unset;
}
.stats div {
  display: flex;
  gap: 4px;
}
.streaks {
  display: grid;
  grid-template-columns: 2fr 2fr 2fr;
  width: fit-content;
  margin: auto;
  justify-content: space-between;
  padding: 16px;
  background: #00000040;
  border: 3px solid black;
  border-radius: 8px;
  gap: 4px;
}
.streaks p {
  all:unset;
}
.streaks div {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.streaks span {
  display: flex;
  gap: 4px;
}
.streaks .subtitle {
  font-size: 18px;
  color: orange;
}
.streaks .count {
  color: yellow;
}
.streaks .date {
  font-size: 16px;
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
.langbarportion0 {
background: var(--gsr-toplang0-color);
height: 100%;
width: var(--gsr-toplang0-percentage);
}
.langbarportion1 {
background: var(--gsr-toplang1-color);
height: 100%;
width: var(--gsr-toplang1-percentage);
}
.langbarportion2 {
background: var(--gsr-toplang2-color);
height: 100%;
width: var(--gsr-toplang2-percentage);
}
.langbarportion3 {
background: var(--gsr-toplang3-color);
height: 100%;
width: var(--gsr-toplang3-percentage);
}
.langbarportion4 {
background: var(--gsr-toplang4-color);
height: 100%;
width: var(--gsr-toplang4-percentage);
}
.langbarportion5 {
background: var(--gsr-toplang5-color);
height: 100%;
width: var(--gsr-toplang5-percentage);
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

`;
const htmlExampleCode = `<div class="container">
  <p>Example Code</p>
  <p>Hello World</p>
  <gitstreak class="streaks">
    <div>
      <p class="subtitle">Total Contributions:</p>
      <streakcontributionscount class="count"></streakcontributionscount>
      <span>
        <streakcontributionsfirstdate
          class="date"
        ></streakcontributionsfirstdate>
        <p class="date">-</p>
        <p class="date">Present</p>
      </span>
    </div>
    <div>
      <p class="subtitle">Longest Streak:</p>
      <streaklongestcount class="count"></streaklongestcount>
      <span>
        <streaklongeststartdate class="date"></streaklongeststartdate>
        <p class="date">-</p>
        <streaklongestenddate class="date"></streaklongestenddate>
      </span>
    </div>
    <div>
      <p class="subtitle">Current Streak:</p>
      <streakcurrentcount class="count"></streakcurrentcount>
      <span>
        <streakcurrentstartdate class="date"></streakcurrentstartdate>
        <p class="date">-</p>
        <streakcurrentenddate class="date"></streakcurrentenddate>
      </span>
    </div>
  </gitstreak>
  <div>
    <gitstats class="stats">
      Stats:
      <div>
        <p>Stars:</p>
        <statstarsearned></statstarsearned>
      </div>
      <div>
        <p>Commits:</p>
        <statcommits></statcommits>
      </div>
      <div>
        <p>Issues:</p>
        <statissues></statissues>
      </div>
      <div>
        <p>PRs:</p>
        <statpullrequests></statpullrequests>
      </div>
      <div>
        <p>Contributed to:</p>
        <statcontributedto></statcontributedto>
      </div>
    </gitstats>
  </div>
  <div>
    <gittoplangs size="6" class="topLangs">
      <h2>Most Used Languages:</h2>
      <div class="langbarall">
        <div class="langbarportion0"></div>
        <div class="langbarportion1"></div>
        <div class="langbarportion2"></div>
        <div class="langbarportion3"></div>
        <div class="langbarportion4"></div>
        <div class="langbarportion5"></div>
      </div>
      <div class="langsContainer">
        <lang class="langContainer" position="0">
          <langName class="name"></langName>
          <langPercentage class="percentage"></langPercentage>
          <div class="langbar">
            <div class="langbarportion0"></div>
          </div>
        </lang>
        <lang class="langContainer" position="1">
          <langName class="name"></langName>
          <langPercentage class="percentage"></langPercentage>
          <div class="langbar">
            <div class="langbarportion1"></div>
          </div>
        </lang>
        <lang class="langContainer" position="2">
          <langName class="name"></langName>
          <langPercentage class="percentage"></langPercentage>
          <div class="langbar">
            <div class="langbarportion2"></div>
          </div>
        </lang>
        <lang class="langContainer" position="3">
          <langName class="name"></langName>
          <langPercentage class="percentage"></langPercentage>
          <div class="langbar">
            <div class="langbarportion3"></div>
          </div>
        </lang>
        <lang class="langContainer" position="4">
          <langName class="name"></langName>
          <langPercentage class="percentage"></langPercentage>
          <div class="langbar">
            <div class="langbarportion4"></div>
          </div>
        </lang>
        <lang class="langContainer" position="5">
          <langName class="name"></langName>
          <langPercentage class="percentage"></langPercentage>
          <div class="langbar">
            <div class="langbarportion5"></div>
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
