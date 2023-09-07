import { User } from "@web/types/github";
import React from "react";
interface State {
  isLoggedIn: boolean;
  user: User | null;
  client_id?: string;
  redirect_uri?: string;
  client_secret?: string;
}
interface AuthContext {
  state: State;
  dispatch: React.Dispatch<AuthAction>;
}
interface AppProviderProps {
  children?: React.ReactNode;
}

export const AuthContext = React.createContext<AuthContext>({} as AuthContext);
const initialState: State = {
  isLoggedIn: localStorage.getItem("isLoggedIn")
    ? JSON.parse(localStorage.getItem("isLoggedIn") as string)
    : false,
  user: localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user") as string) : null,
  client_id: import.meta.env.VITE_GITHUB_OAUTH_CLIENT_ID,
  redirect_uri: import.meta.env.VITE_GITHUB_OAUTH_REDIRECT_URI,
  client_secret: import.meta.env.VITE_GITHUB_OAUTH_CLIENT_SECRET,
};

interface AuthAction {
  type: string;
  payload?: State;
}
const reducer = (state: State, action: AuthAction) => {
  switch (action.type) {
    case "LOGIN": {
      if (!action.payload) return state;
      localStorage.setItem("isLoggedIn", JSON.stringify(action.payload.isLoggedIn));
      localStorage.setItem("user", JSON.stringify(action.payload.user));
      return {
        ...state,
        isLoggedIn: action.payload.isLoggedIn,
        user: action.payload.user,
      };
    }
    case "LOGOUT": {
      localStorage.clear();
      return {
        ...state,
        isLoggedIn: false,
        user: null,
      };
    }
    default:
      return state;
  }
};
export function AuthProvider({ children }: AppProviderProps) {
  const [state, dispatch] = React.useReducer(reducer, initialState);

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

  return <AuthContext.Provider value={{ state, dispatch }}>{children}</AuthContext.Provider>;
}
