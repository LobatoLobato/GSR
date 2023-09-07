import { useState } from "react";
import "./sidebar.scss";
import { RepositoryList } from "@web/types/github";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark } from "@fortawesome/free-regular-svg-icons";
import { LoginButton } from "../LoginButton";
import Icon from "../Icon";
import { useAppContext } from "@web/hooks/useAppContext";
import { useAuthContext } from "@web/hooks/useAuthContext";
import React from "react";
import { Button } from "../Button";
import { ThemeSelector } from "../ThemeSelector";

export function SideBar() {
  const appContext = useAppContext();
  const { state } = useAuthContext();
  const [showSidebar, setShowSidebar] = useState(false);
  const [sidebarClassName, setSidebarClassName] = useState(
    "fixed left-0 z-10 w-full lg:w-fit h-fit hover:bg-green-500",
  );
  const [showSidebarBtnClassName, setShowSidebarBtnClassName] = useState(
    "relative rounded-br-sm px-2",
  );
  const [contentClassName, setContentClassName] = useState("hidden");
  const [showHelp, setShowHelp] = useState(false);

  const [isLoading, setIsLoading] = React.useState(false);
  const handleLoad = async () => {
    setIsLoading(true);
    await appContext.loadCode();
    setIsLoading(false);
  };

  const [isUploading, setIsUploading] = React.useState(false);
  const handleUpload = async () => {
    setIsUploading(true);
    await appContext.uploadCode();
    setIsUploading(false);
  };

  const onChangeVisibility = () => {
    setShowSidebar(!showSidebar);
  };
  const firstRender = React.useRef(true);
  React.useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    const className = showSidebar ? "show" : "hide";
    setShowSidebarBtnClassName(className);
    setSidebarClassName(className);
    setContentClassName(className);
  }, [showSidebar]);

  React.useEffect(() => {
    if (appContext.forceShowSidebar) {
      setShowSidebar(true);
      appContext.setForceShowSidebar(false);
    }
  }, [appContext.forceShowSidebar, appContext]);

  return (
    <div className={`sidebar ${sidebarClassName}`}>
      <HelpPopup show={showHelp} onClosed={() => setShowHelp(false)} />
      <div className={`showSidebarBtn ${showSidebarBtnClassName}`} onClick={onChangeVisibility}>
        <Icon className="icon" icon={Icon.Solid.faBars} />
      </div>
      <div className={`content ${contentClassName}`}>
        <div className="flex flex-col justify-center items-center w-full gap-2">
          <div className="flex-col bg-[#ffffff22] w-11/12 p-2 rounded-sm justify-center items-center flex">
            <span className="text-lg">Profile</span>
            <LoginButton />
          </div>
          <ThemeSelector onInput={(theme) => appContext.setEditorTheme(theme)} />
        </div>
        <div className="flex flex-col justify-center items-center w-full">
          {state.isLoggedIn && (
            <div className="githubStats w-full gap-1">
              <h3> API </h3>
              <div className="flex justify-between w-full">
                <Button
                  className="api-btn w-full"
                  onClick={handleLoad}
                  text="Load"
                  loading={isLoading}
                />
                <Button
                  className="api-btn w-full"
                  onClick={handleUpload}
                  text="Upload"
                  loading={isUploading}
                />
              </div>
            </div>
          )}
          <div className="githubStats">
            {state.isLoggedIn && <RepoList list={appContext.githubData.repos}></RepoList>}
            <button className="helpBtn" onClick={() => setShowHelp(true)}>
              HELP
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function RepoList(props: { list: RepositoryList | undefined }) {
  return (
    <div className="flex flex-col gap-2 w-full">
      <p className="text-base text-center w-full">Repository List</p>
      <ul className="repoList">
        {props.list
          ? Object.entries(props.list).map((curr, index) => {
              const repo = curr[1];
              const color = repo.primaryLanguage ? repo.primaryLanguage.color : "#FFFFFF";
              const background = index % 2 === 0 ? "bg-[#383838]" : "bg-[transparent]";
              const languageName = repo.primaryLanguage ? repo.primaryLanguage.name : "undefined";
              return (
                <Repo
                  className={`py-[0.125rem] hover:bg-[#444] ${background} clickable`}
                  key={repo.name}
                  background={background}
                  color={color}
                  name={repo.name}
                  languageName={languageName}
                />
              );
            })
          : ""}
      </ul>
    </div>
  );
}
function Repo(props: {
  color: string;
  background: string;
  name: string;
  languageName: string;
  key: string;
  className: string;
}) {
  const [showLanguage, setShowLanguage] = useState(false);
  return (
    <li
      className={`${props.className} ${showLanguage ? "bg-[#555444]" : ""}`}
      style={{ color: props.color }}
      key={props.name}
      onClick={() => setShowLanguage(!showLanguage)}
    >
      {/* {showLanguage ? props.languageName : } */}
      {showLanguage ? props.languageName : props.name}
    </li>
  );
}

function HelpPopup(props: { onClosed: () => void; show: boolean }) {
  const [showStats, setShowStats] = useState(false);
  const [showStreak, setShowStreak] = useState(false);
  const [showTopLanguages, setShowTopLanguages] = useState(false);
  const [showRepositories, setShowRepositories] = useState(false);
  const hideAll = () => {
    setShowStats(false);
    setShowStreak(false);
    setShowRepositories(false);
    setShowTopLanguages(false);
  };
  return props.show ? (
    <div className="helpPopup animate-fadeIn">
      <div className="navbar">
        <div className="topics">
          <h2
            onClick={() => {
              hideAll();
              setShowStats(!showStats);
            }}
          >
            Stats
          </h2>
          <h2
            onClick={() => {
              hideAll();
              setShowStreak(!showStreak);
            }}
          >
            Streak
          </h2>
          <h2
            onClick={() => {
              hideAll();
              setShowTopLanguages(!showTopLanguages);
            }}
          >
            Top Languages
          </h2>
          <h2
            onClick={() => {
              hideAll();
              setShowRepositories(!showRepositories);
            }}
          >
            Repositories
          </h2>
        </div>
        <button onClick={() => props.onClosed()}>
          <FontAwesomeIcon className="icon" icon={faCircleXmark}></FontAwesomeIcon>
        </button>
      </div>
      <div className={showStats ? "topic" : "hidden"}>
        <h2 className="text-xl">STATS</h2>
      </div>
      <div className={showStreak ? "topic" : "hidden"}>
        <h2 className="text-xl">STREAK</h2>
      </div>
      <div className={showTopLanguages ? "topic" : "hidden"}>
        <h2 className="text-xl">TOP LANGUAGES</h2>
      </div>
      <div className={showRepositories ? "topic" : "hidden"}>
        <h2 className="text-xl">REPOSITORIES</h2>
      </div>
    </div>
  ) : (
    <></>
  );
}
