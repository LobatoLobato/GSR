import React, { useEffect, useState } from "react";
import "./editor.scss";

import CodeMirror, { BasicSetupOptions } from "@uiw/react-codemirror";
import * as themes from "@uiw/codemirror-themes-all";
import { html } from "@codemirror/lang-html";
import { htmlFormatter } from "../../common/utils";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWindowMaximize } from "@fortawesome/free-regular-svg-icons";
import { faWindowMinimize } from "@fortawesome/free-solid-svg-icons";

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
  const [created, setCreated] = useState(false);
  const [maximized, setMaximized] = useState(false);
  const [timeoutId, setTimeoutId] = useState({
    sendCode: 0,
    keyboardEvent: 0,
  });
  const [code, setCode] = useState(exampleCode);
  const [editorCode, setEditorCode] = useState(exampleCode);
  const [formattingActive, setformattingActive] = useState(false);
  const sendCode = (code: string) => {
    window.clearTimeout(timeoutId.sendCode);

    setCode(code);

    const newTimeoutId = window.setTimeout(() => {
      props.onInput(htmlFormatter(code));
    }, 1000);

    setTimeoutId((timeoutId) => ({
      ...timeoutId,
      sendCode: newTimeoutId,
    }));
  };
  const formatEditorCode = (ev: React.KeyboardEvent) => {
    if (formattingActive || code === editorCode) return;
    if (!(ev.shiftKey && ev.altKey && /f/i.test(ev.key))) return;

    setEditorCode(code);
    setTimeout(() => {
      setEditorCode(htmlFormatter(code));
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
  const getTheme = (theme: string | undefined) => {
    if (!theme) return "dark";
    return theme === "dark" || theme === "light" ? theme : { ...themes }[theme];
  };
  useEffect(() => {
    if (created) return;
    props.onInput(exampleCode);
    setCreated(true);
  }, [props, created, setCreated]);

  return (
    <div className={`editorContainer ${props.className}`}>
      <div className=" relative flex h-8 w-full px-1 items-center justify-between">
        <h2 className="absolute left-1/2 -translate-x-1/2 select-none ">
          {" "}
          Editor{" "}
        </h2>
        <div
          className="absolute left-[97%] -translate-x-full clickable"
          onClick={() => {
            if (maximized) {
              props.onMinimized();
            } else {
              props.onMaximized();
            }
            setMaximized(!maximized);
          }}
        >
          <FontAwesomeIcon
            className="text-white"
            icon={maximized ? faWindowMinimize : faWindowMaximize}
          ></FontAwesomeIcon>
        </div>
      </div>
      <CodeMirror
        extensions={[
          html({
            extraTags: {
              gitrepo: { attrs: { name: null } },
              reponame: { attrs: { showOwner: null } },
              repodescription: {},
              repolanguage: {},
              repostarcount: {},
              repoForkCount: {},
            },
          }),
        ]}
        placeholder="Write your html code"
        value={editorCode}
        className={`editor ${props.theme}`}
        height="100%"
        theme={getTheme(props.theme)}
        onChange={sendCode}
        onKeyDown={formatEditorCode}
        onKeyUp={releaseShortcuts}
        basicSetup={basicSetup}
      />
    </div>
  );
}

const exampleCode = `
<style>
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
    height: 94vh;
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
</style>

<div class="container">
  <p>Example Code</p>
  <p>Hello World</p>
  <div>
    <h2>Repositories:</h2>
    <br>
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

// const exampleCode2 = `
/* <style>
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
    height: 94vh;
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
</style>

<div class="container">
  <p>Example Code</p>
  <p>Hello World</p>
  <div class="repositories">
    <gitrepo name="avrio" class="repoContainer">
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
    <gitrepo name="github-styledreadme-creator" class="repoContainer">
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
    <gitrepo name="c-cpp-compilerrunner" class="repoContainer">
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
  <p>
    More info on:
    <a href="https://github.com/LobatoLobato/github-styledreadme-creator">
      <img src="https://cdn-icons-png.flaticon.com/512/25/25231.png" />
    </a>
  </p>
</div> */

// `
