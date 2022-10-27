import React, { useEffect, useState } from "react";
import "./editor.scss";

import CodeMirror, { BasicSetupOptions } from "@uiw/react-codemirror";
import * as themes from "@uiw/codemirror-themes-all";
import { html } from "@codemirror/lang-html";
import { htmlFormatter } from "../../common/utils";

interface Props {
  onInput(code: string): void;
  theme?: string;
}
const basicSetup: BasicSetupOptions = {
  foldGutter: true,
};
export default function Editor(props: Props) {
  const [created, setCreated] = useState(false);
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
    <div className="editorContainer">
      <h2 className="select-none h-8"> Editor </h2>
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
  .repoContainer .counters{
    display: flex;
    gap: 4px;
    align-items: center;
    height: 20px;
  }
  .repoContainer .counters img{
    width: 20px;
    height: 20px;
  }
 .repoContainer .counters p{
   height: 100%;
   padding-bottom: 5px;
  }
</style>

<div class="container">
  <p>Example Code</p>
  <p>Hello World</p>
  <gitrepo name="github-styledreadme-creator" class="repoContainer">
    <reponame showOwner class="reponame"></reponame>
    <repodescription></repodescription>
    <repolanguage></repolanguage>
    <div class="counters">
      <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/57/FA_star.svg/1024px-FA_star.svg.png"/>
      <repostarcount></repostarcount>
    </div>
    <div class="counters">
      <img src="https://user-images.githubusercontent.com/17777237/54873012-40fa5b00-4dd6-11e9-98e0-cc436426c720.png"/>
      <repoforkCount></repoforkCount>
    </div>
  </gitrepo>
  <p>
    More info on:
    <a href="https://github.com/LobatoLobato/github-styledreadme-creator">
      <img src="https://cdn-icons-png.flaticon.com/512/25/25231.png" />
    </a>
  </p>
</div>
`;

// const exampleCode2 = `
// <style>
//   @import url("https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700;800");
//   @keyframes rotate {
//     0% {
//       transform: rotate(1deg);
//     }
//     100% {
//       transform: rotate(-1deg);
//     }
//   }
//   @keyframes gradientBackground {
//     0% {
//       background-position: 0% 50%;
//     }
//     50% {
//       background-position: 100% 50%;
//     }

//     100% {
//       background-position: 0% 50%;
//     }
//   }
//   @keyframes gradientBackgroundFadeIn {
//     0% {
//       background-size: 10000% 10000%;
//     }
//     100% {
//       background-size: 100% 100%;
//     }
//   }
//   @keyframes fadeIn {
//     0% {
//       opacity: 0;
//     }
//     66% {
//       opacity: 0;
//     }
//     100% {
//       opacity: 1;
//     }
//   }
//   @keyframes gradient {
//     0% {
//     }
//     50% {
//       background-size: 130% 130%;
//     }
//     100% {
//       background-size: 100% 100%;
//     }
//   }
//   @keyframes currstreak {
//     0% {
//       font-size: 3px;
//       opacity: 0.2;
//     }
//     80% {
//       font-size: 34px;
//       opacity: 1;
//     }
//     100% {
//       font-size: 28px;
//       opacity: 1;
//     }
//   }
//   @keyframes fadein {
//     0% {
//       opacity: 0;
//     }
//     100% {
//       opacity: 1;
//     }
//   }
//   a {
//     text-decoration: none;
//   }
//   .containerContainer {
//     background-color: white;
//   }
//   .bg {
//     background-color: #292929;
//   }
//   .container {
//     display: flex;
//     flex-direction: column;
//     font-family: "JetBrains Mono", monospace;
//     gap: 24px;
//     width: 100%;
//     height: 100%;
//     background: linear-gradient(180deg, #490e9d13 20%, #cc2c4d52 50%, #6c2c4d82);
//     background-size: 100% 100%;
//     animation: gradientBackgroundFadeIn 5s ease, gradient 10s ease-in-out infinite !important;
//     background-position: 0% 0%;
//     border-radius: 4px;
//     color: white;
//     text-align: center;
//     box-sizing: border-box;
//   }
//   .skillsContainer {
//     display: flex;
//     flex-direction: column;
//     background-color: transparent;
//     border: 1px solid white;
//     border-radius: 4px;
//     padding-left: 24px;
//     padding-right: 24px;
//     padding: 24px;
//     font-size: 16px;
//     box-sizing: border-box;
//     animation: 1s ease 0s normal forwards 1 fadeIn !important;
//   }
//   .skillsContainer h2 {
//     margin: 12px;
//     color: #ea1f6a;
//     text-shadow: 0 1px 0 #ea3f7a;
//     font-weight: 500;
//     font-size: 30px;
//     line-height: 1;
//     letter-spacing: 2px;
//     text-transform: uppercase;
//     animation: rotate ease-in-out 1s infinite alternate !important;
//   }
//   .skillsContainer h3 {
//     font-weight: 400;
//     margin: 0;
//   }
//   .skillsContainer .category {
//     animation: 2s ease 0s normal forwards 1 fadeIn !important;
//   }
//   .skillsContainer .category svg {
//     width: 50px;
//     height: 50px;
//   }
//   .skillsContainer .category p {
//     display: flex;
//     gap: 12px;
//     animation: 2.5s ease 0s normal forwards 1 fadeIn !important;
//     align-items: center;
//     justify-content: center;
//   }
//   .statsContainer {
//     display: flex;
//     gap: 12px;
//   }
//   .statsContainer svg {
//     width: 100%;
//   }
//   .repoContainer svg {
//     width: fit-content;
//     height: 120px;
//   }
// </style>

// <div class="bg">
//   <div class="container">
//     <div class="skillsContainer">
//       <h2>About</h2>
//     </div>
//     <div class="skillsContainer">
//       <h2>Repos</h2>
//       <p class="repoContainer">${repos}</p>
//     </div>
//     <div class="skillsContainer">
//       <h2>Skills</h2>
//       <div class="category">
//         <h3>Languages</h3>
//         <p>
//           ${await icon("https://www.cprogramming.com/", langIcons.c)} ${await
//           icon("https://www.w3schools.com/cpp/", langIcons.cpp)} ${await
//           icon("https://www.w3schools.com/cs/", langIcons.cSharp)} ${await
//           icon("https://www.python.org", langIcons.python)} ${await
//           icon("https://www.java.com", langIcons.java)} ${await
//           icon("https://www.w3.org/html/", langIcons.html)} ${await
//           icon("https://www.w3schools.com/css/", langIcons.css)} ${await icon(
//           "https://developer.mozilla.org/en-US/docs/Web/JavaScript",
//           langIcons.js, )} ${await icon("https://www.typescriptlang.org/",
//           langIcons.ts)}
//         </p>
//       </div>
//       <div class="category">
//         <h3>Frameworks</h3>
//         <p>
//           ${await icon("https://www.arduino.cc/", langIcons.arduino)} ${await
//           icon("https://vuejs.org/", langIcons.vue)} ${await
//           icon("https://reactjs.org/", langIcons.react)} ${await
//           icon("https://reactnative.dev/", langIcons.reactNative)} ${await
//           icon("https://www.electronjs.org", langIcons.electron)} ${await
//           icon("https://nodejs.org", langIcons.nodeJS)} ${await
//           icon("https://sass-lang.com", langIcons.sass)} ${await
//           icon("https://tailwindcss.com/", langIcons.tailwind)}
//         </p>
//       </div>
//       <div class="category">
//         <h3>Tools</h3>
//         <p>
//           ${await icon("https://www.figma.com/", langIcons.figma)} ${await
//           icon("https://git-scm.com/", langIcons.git)}
//         </p>
//       </div>
//       <p>${topLangs}</p>
//     </div>
//     <div class="skillsContainer">
//       <h2>Stats</h2>
//       <p>${githubStats}</p>
//     </div>
//   </div>
// </div>

// `
