import React from "react";
import "./editor.scss";

import Icon from "@web/components/Icon";

import MonacoEditor from "@monaco-editor/react";
import "@web/config/MonacoConfig";

import HTMLExample from "@web/assets/example.html";
import CSSExample from "@web/assets/example.css?inline";
import { useAppContext } from "@web/hooks/useAppContext";

// import { CSSVariablesStr } from "@web/utils/parsers";
import codeFormatter from "@web/utils/codeFormatter";
import { useAuthContext } from "@web/hooks/useAuthContext";
import { Loader } from "../Loader";

interface Props {
  onMaximized: () => void;
  onMinimized: () => void;
  navbarClassName: string;
  theme?: string;
  className?: string;
}

export function Editor(props: Props) {
  const appContext = useAppContext();
  const authContext = useAuthContext();
  const [maximized, setMaximized] = React.useState(false);
  const [showHTMLEditor, setShowHTMLEditor] = React.useState(true);
  const [showCSSEditor, setshowCSSEditor] = React.useState(false);

  const [HTMLCode, setHTMLCode] = React.useState(HTMLExample);
  const [CSSCode, setCSSCode] = React.useState(CSSExample);

  React.useEffect(() => {
    setHTMLCode(appContext.userData.code.htmlCode);
    setCSSCode(appContext.userData.code.cssCode);
  }, [appContext.userData.code]);

  const [updatePreviewTimeoutId, setUpdatePreviewTimeoutId] = React.useState(0);
  const updatePreview = (HTMLCode: string, CSSCode: string) => {
    window.clearTimeout(updatePreviewTimeoutId);

    const newTimeoutId = window.setTimeout(() => {
      appContext.updatePreview(HTMLCode, CSSCode);
    }, 500);

    setUpdatePreviewTimeoutId(newTimeoutId);
    setHTMLCode(HTMLCode);
    setCSSCode(CSSCode);
  };

  const switchEditor = (editor: "css" | "html") => {
    setShowHTMLEditor(editor === "html");
    setshowCSSEditor(editor === "css");
  };

  const onMaximizeOrMinimize = () => {
    maximized ? props.onMinimized() : props.onMaximized();
    setMaximized(!maximized);
  };

  return (
    <div className={`editorContainer ${props.className}`}>
      <div className="navbar">
        <h2 className={`title ${props.navbarClassName}`}> Editor </h2>
        <Icon
          className={`window-resize-icon ${props.navbarClassName}`}
          icon={maximized ? Icon.Solid.faWindowMinimize : Icon.Solid.faWindowMaximize}
          onClick={onMaximizeOrMinimize}
        />
      </div>
      {!authContext.state.isLoggedIn && (
        <div className=" bg-pink-800">
          <span className="flex justify-center">
            <p>Editor is in readonly mode,</p>
            <p
              className="text-blue-400 clickable hover:text-blue-300"
              onClick={() => appContext.setForceShowSidebar(true)}
            >
              &nbsp;login&nbsp;
            </p>
            <p>to enable editing</p>
          </span>
        </div>
      )}
      <div className="main-editor-navbar">
        <Icon
          className={`icon html-icon ${showHTMLEditor ? "selected" : ""}`}
          icon={Icon.Brands.faHtml5}
          onClick={() => switchEditor("html")}
        />
        <Icon
          className={`icon css-icon ${showCSSEditor ? "selected" : ""}`}
          icon={Icon.Brands.faCss3}
          onClick={() => switchEditor("css")}
        />
      </div>
      {appContext.isLoadingCode ? (
        <div className="editor flex justify-center items-center" style={{ height: "100%" }}>
          <Loader />
        </div>
      ) : (
        <React.Fragment>
          <HTMLEditor
            theme={appContext.editorTheme}
            code={HTMLCode}
            onChange={(HTMLCode) => updatePreview(HTMLCode, CSSCode)}
            visible={showHTMLEditor}
            disabled={!authContext.state.isLoggedIn}
          ></HTMLEditor>
          <CSSEditor
            theme={appContext.editorTheme}
            code={CSSCode}
            onChange={(CSSCode) => updatePreview(HTMLCode, CSSCode)}
            visible={showCSSEditor}
            disabled={!authContext.state.isLoggedIn}
          ></CSSEditor>
          <CSSVariablesEditor code={appContext.cssVariables} theme={appContext.editorTheme} />
        </React.Fragment>
      )}
    </div>
  );
}

interface EditorProps {
  onChange?: (value: string) => void;
  className?: string;
  code: string;
  theme?: string;
  visible?: boolean;
  disabled?: boolean;
}
function HTMLEditor(props: EditorProps) {
  if (!props.visible) return <></>;
  return (
    <div className={`editor ${props.theme} ${props.className}`}>
      <MonacoEditor
        height="100%"
        defaultLanguage="html"
        value={props.code}
        options={{
          lineNumbersMinChars: 3,
          readOnly: props.disabled,
        }}
        theme={props.theme}
        onChange={(value) => props.onChange?.(value || "")}
        onMount={(editor, monaco) => {
          editor.addAction({
            id: "html-format",
            label: "Formatting...",
            keybindings: [monaco.KeyMod.Shift | monaco.KeyMod.Alt | monaco.KeyCode.KeyF],
            run: async () => {
              try {
                editor.setValue(await codeFormatter(editor.getValue(), "html"));
              } catch (e) {
                //
              }
            },
          });
        }}
      />
    </div>
  );
}
function CSSEditor(props: EditorProps) {
  if (!props.visible) return <></>;
  return (
    <div className={`editor ${props.theme} ${props.className}`}>
      <MonacoEditor
        height="100%"
        defaultLanguage="css"
        value={props.code}
        options={{ lineNumbersMinChars: 3, readOnly: props.disabled }}
        theme={props.theme}
        onChange={(value) => props.onChange?.(value || "")}
        onMount={(editor, monaco) => {
          editor.addAction({
            id: "css-format",
            label: "Formatting...",
            keybindings: [monaco.KeyMod.Shift | monaco.KeyMod.Alt | monaco.KeyCode.KeyF],
            run: async () => {
              try {
                editor.setValue(await codeFormatter(editor.getValue(), "css"));
              } catch (e) {
                //
              }
            },
          });
        }}
      />
    </div>
  );
}
function CSSVariablesEditor(props: EditorProps) {
  const [collapsed, setCollapsed] = React.useState(true);
  const [code, setCode] = React.useState("");

  React.useEffect(() => {
    codeFormatter(props.code, "css").then(setCode);
  }, [props.code]);

  return (
    <div className="variables-editor-container">
      <div className="titlebar">
        <h3 className="title">Generated CSS Variables</h3>
        <Icon
          className="collapse-icon"
          icon={collapsed ? Icon.Solid.faCaretUp : Icon.Solid.faCaretDown}
          onClick={() => setCollapsed(!collapsed)}
        ></Icon>
      </div>
      <div className={`variablesEditor ${props.theme} ${collapsed ? "minimize" : "maximize"}`}>
        <MonacoEditor
          height="100%"
          defaultLanguage="css"
          value={code}
          options={{
            lineNumbersMinChars: 3,
            readOnly: true,
            formatOnType: true,
            formatOnPaste: true,
          }}
          theme={props.theme}
          onChange={(value) => props.onChange?.(value || "")}
        ></MonacoEditor>
      </div>
    </div>
  );
}
