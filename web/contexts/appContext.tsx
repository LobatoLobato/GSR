import React from "react";
import HTMLExample from "@web/assets/example.html?raw";
import CSSExample from "../assets/example.css?raw";
import axios from "axios";
import { GitHubData } from "@web/types/github";
import { randomHexColor } from "@web/utils";
import { GSRSVGRenderer } from "@web/models/SVGRenderer";
import { useAuthContext } from "@web/hooks/useAuthContext";
import { asyncWrap } from "@web/utils/asyncWrap";

interface UserData {
  username: "gsr-guest" | string;
  code: {
    htmlCode: string;
    cssCode: string;
  };
}

interface AppContext {
  updatePreview(HTMLCode: string, CSSCode: string): void;
  loadCode(): Promise<void>;
  uploadCode(): Promise<void>;
  isLoadingCode: boolean;
  editorTheme: string;
  setEditorTheme(theme: string): void;
  forceShowSidebar: boolean;
  setForceShowSidebar(forceShowSidebar: boolean): void;
  userData: UserData;
  githubData: GitHubData;
  previewCode: string;
  cssVariables: string;
  generateMarkdown(): string;
  setRenderHeights(heights: [number, number, boolean][]): void;
}
interface AppProviderProps {
  children?: React.ReactNode;
}

export const AppContext = React.createContext<AppContext>({} as AppContext);

export function AppProvider({ children }: AppProviderProps) {
  const { state } = useAuthContext();
  const [userData, setUserData] = React.useState<UserData>({
    username: state.user?.login ?? "gsr-guest",
    code: { htmlCode: HTMLExample, cssCode: CSSExample },
  });

  // Sets logged in user's username
  React.useEffect(() => {
    if (!state.user) return;
    const username = state.user.login;
    setUserData((d) => ({ ...d, username }));
  }, [state.user]);

  // Loads logged in user's code from the database
  const _loadCode = React.useCallback(async (username: string) => {
    const [response] = await asyncWrap(axios.post("/api/user/load", { username }));
    if (response) {
      setUserData((d) => ({ ...d, code: response.data.code }));
    }
  }, []);
  async function loadCode() {
    await _loadCode(userData.username);
  }
  React.useEffect(() => {
    if (userData.username === "gsr-guest") return;
    _loadCode(userData.username);
  }, [userData.username, _loadCode]);

  const [editorCode, setEditorCode] = React.useState({
    htmlCode: HTMLExample,
    cssCode: CSSExample,
  });
  const _uploadCode = async (htmlCode: string, cssCode: string, username: string) => {
    const code = `<style>${cssCode}</style>${htmlCode}`;
    const [response] = await asyncWrap(axios.post("/api/user/upload", { username, code }));
    if (response) console.log(response);
  };
  async function uploadCode() {
    await _uploadCode(editorCode.htmlCode, editorCode.cssCode, userData.username);
  }

  const [githubData, setGithubData] = React.useState<GitHubData>(githubDataMock);
  // Gets logged in user's github data or, if not logged in, the guest's mock data
  React.useEffect(() => {
    const { username } = userData;
    if (username === "gsr-guest") return setGithubData(githubDataMock);

    axios.post("/api/user/githubdata", { username }).then(({ data }) => {
      setGithubData(data);
    });
  }, [userData]);

  // async function saveStorageData(appData: StoredAppData | AppData) {
  //   const usrKey = `@AppData/${auth.authData?.email ?? "Guest"}`;
  //   if (isStoredAppData(appData)) {
  //     const serializedData = JSON.stringify(appData);
  //     AsyncStorage.setItem(usrKey, serializedData).catch();
  //   } else {
  //     const serializedData = JSON.stringify({
  //       events: appData.events,
  //       ratePendingEvents: appData.ratePendingEvents,
  //       selectedEvents: appData.selectedEvents,
  //       upcomingEvents: appData.upcomingEvents,
  //       classSchedules: appData.classScheduler.schedules,
  //     } as StoredAppData);
  //     AsyncStorage.setItem(usrKey, serializedData).catch();
  //   }
  // }

  // async function loadStorageData(): Promise<StoredAppData | undefined> {
  //   let appData: StoredAppData | undefined = undefined;
  //   try {
  //     const usrKey = `@AppData/${auth.authData?.email ?? "Guest"}`;
  //     const appDataSerialized = await AsyncStorage.getItem(usrKey);
  //     if (appDataSerialized) {
  //       appData = JSON.parse(appDataSerialized);
  //     }
  //   } catch (error) {
  //   } finally {
  //     // setLoading(false);
  //     return appData;
  //   }
  // }

  const [previewCode, setPreviewCode] = React.useState(
    `<style>${userData.code.cssCode}</style>\n${userData.code.htmlCode}`,
  );
  const [cssVariables, setCssVariables] = React.useState(":root {\n\n}");

  // Updates the preview code
  const _updatePreview = React.useCallback(
    async (options: { HTMLCode: string; CSSCode: string; githubData: GitHubData }) => {
      const { HTMLCode, CSSCode, githubData } = options;
      const { renderedXhtml, cssVariables } = await GSRSVGRenderer.render({
        xhtml: `<style>${CSSCode}</style>\n${HTMLCode}`,
        githubData,
        preview: true,
      });

      if (cssVariables) {
        const cssVariablesString = Object.entries(cssVariables).reduce((acc, [key, value]) => {
          return acc + `${key}: ${value};`;
        }, "");
        setCssVariables(`:root {${cssVariablesString}}`);
      } else {
        setCssVariables(":root {}");
      }
      setEditorCode({ htmlCode: HTMLCode, cssCode: CSSCode });
      setPreviewCode(renderedXhtml);
    },
    [],
  );
  async function updatePreview(HTMLCode: string, CSSCode: string): Promise<void> {
    await _updatePreview({ HTMLCode, CSSCode, githubData });
  }

  // Updates the preview everytime the user's data changes
  React.useEffect(() => {
    const { username } = userData;
    if (username === "gsr-guest") {
      _updatePreview({
        HTMLCode: HTMLExample,
        CSSCode: CSSExample,
        githubData: githubDataMock,
      });
      return;
    }
    _updatePreview({
      HTMLCode: userData.code.htmlCode,
      CSSCode: userData.code.cssCode,
      githubData,
    });
  }, [userData, _updatePreview, githubData]);

  const [editorTheme, setEditorTheme] = React.useState("vs-dark");

  const [forceShowSidebar, setForceShowSidebar] = React.useState(false);

  const [isLoadingCode, setIsLoadingCode] = React.useState(true);

  React.useEffect(() => {
    setTimeout(() => {
      setIsLoadingCode(false);
    }, 2000);
  }, []);

  const [renderHeights, setRenderHeights] = React.useState<[number, number, boolean][]>([]);

  function generateMarkdown(): string {
    const url = "https://gsr.frll.cloud/api/render";

    const tags = renderHeights.map(([k, v, isBase]) => {
      const params = `username=${userData.username.toLowerCase()}&height=${v}`;
      if (isBase) {
        return `  <img src="${url}?${params}" width="100%" alt=":(" />`;
      }
      return `  <source media="(min-width:${k}px)" srcset="${url}?${params}" width="100%" />`;
    });

    return `<picture>\n${tags.join("\n")}\n</picture>`;
  }
  return (
    <AppContext.Provider
      value={{
        generateMarkdown,
        setRenderHeights,
        isLoadingCode,
        forceShowSidebar,
        setForceShowSidebar,
        editorTheme,
        setEditorTheme,
        uploadCode,
        userData,
        loadCode,
        githubData,
        cssVariables,
        previewCode,
        updatePreview,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
const githubDataMock: GitHubData = {
  stats: {
    commits: 3,
    contributedTo: 3,
    issues: 0,
    PRs: 0,
    starsEarned: 90,
  },
  streak: {
    contributions: {
      count: 0,
      firstDate: "Date",
    },
    currentStreak: {
      count: 0,
      startDate: "Date",
      endDate: "Date",
    },
    longestStreak: {
      count: 0,
      startDate: "Date",
      endDate: "Date",
    },
  },
  topLangs: [...Array(10)].reduce((acc, _, i) => {
    return {
      ...acc,
      [i.toString()]: {
        name: `Lang${i}`,
        color: randomHexColor(),
        size: 10 - i,
      },
    };
  }, {}),
  repos: [...Array(10)].reduce((acc, _, i) => {
    return {
      ...acc,
      [i.toString()]: {
        description: `description`,
        forkCount: Math.trunc(Math.random() * 100),
        name: `repo${i}`,
        nameWithOwner: `owner/repo${i}`,
        primaryLanguage: {
          name: `LangName`,
          color: randomHexColor(),
        },
        stargazerCount: Math.trunc(Math.random() * 100),
      },
    };
  }, {}),
};
