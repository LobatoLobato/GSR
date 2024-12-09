import React, { useState } from "react";
import "./preview.scss";

import Icon from "@web/components/Icon";
import { useAppContext } from "@web/hooks/useAppContext";
import { Loader } from "../Loader";

interface Props {
  onMaximized: () => void;
  onMinimized: () => void;
  navbarClassName: string;
  className?: string;
}

export function Preview(props: Props) {
  const appContext = useAppContext();

  const [maximized, setMaximized] = useState(false);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);
  const handleModeChange = () => setDarkModeEnabled((e) => !e);

  const { previewCode } = appContext;
  const [innerHTML, setInnerHTML] = React.useState("");
  React.useEffect(() => setInnerHTML(previewCode), [previewCode]);

  const foreignObjectBg = darkModeEnabled ? "bg-[#292929]" : "bg-white";
  const foreignObject = React.useRef<SVGForeignObjectElement>(null);

  const { setRenderHeights } = appContext;
  React.useEffect(() => {
    if (!foreignObject.current) return;
    const fo = foreignObject.current;
    const heights: [number, number, boolean][] = [];
    for (const screenSize of [2400, 1600, 1200, 800, 520, 360, 240, 120]) {
      fo.setAttribute("width", screenSize.toString());
      heights.push([screenSize + 128, fo.scrollHeight, screenSize === 120]);
    }

    setRenderHeights(heights);
  }, [innerHTML, setRenderHeights]);

  return (
    <div className={`preview ${props.className}`}>
      <div className="navbar">
        <h2 className={`title ${props.navbarClassName}`}> Preview </h2>
        <div className="absolute flex right-0 gap-4 m-10">
          {darkModeEnabled ? (
            <Icon
              className="text-yellow-100 clickable w-4"
              icon={Icon.Solid.faMoon}
              onClick={handleModeChange}
            ></Icon>
          ) : (
            <Icon
              className="text-yellow-200 clickable w-4"
              icon={Icon.Solid.faSun}
              onClick={handleModeChange}
            ></Icon>
          )}
          <Icon
            className={`window-resize-icon ${props.navbarClassName}`}
            icon={maximized ? Icon.Solid.faWindowMinimize : Icon.Solid.faWindowMaximize}
            onClick={() => {
              maximized ? props.onMinimized() : props.onMaximized();
              setMaximized(!maximized);
            }}
          ></Icon>
        </div>
      </div>
      {appContext.isLoadingCode ? (
        <Loader className="viewBox items-center justify-center flex" />
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" className="viewBox" width={800} height={0}>
          <foreignObject
            className={`xhtmlContainer ${foreignObjectBg}`}
            width="100%"
            height="100%"
            dangerouslySetInnerHTML={{ __html: innerHTML}}
          />
        </svg>
      )}
    </div>
  );
}
