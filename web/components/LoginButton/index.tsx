import React from "react";
import { useAuthContext } from "@web/hooks/useAuthContext";
import axios from "axios";
import { asyncWrap } from "@web/utils/asyncWrap";
import Icon from "../Icon";
import "./loginButton.scss";
import { Loader } from "../Loader";

interface LoginButtonProps {
  onLogin?: () => void;
  onLogout?: () => void;
}

export function LoginButton(props: LoginButtonProps) {
  const { state, dispatch } = useAuthContext();
  const [isLoading, setIsLoading] = React.useState(false);

  const { client_id, redirect_uri } = state;
  const { onLogin, onLogout } = props;
  React.useEffect(() => {
    const url = window.location.href;
    const hasCode = url.includes("?code=");

    if (hasCode) {
      const [newUrl, code] = url.split("?code=");
      window.history.pushState({}, "", newUrl);
      setIsLoading(true);

      (async () => {
        const [response, error] = await asyncWrap(axios.post("/api/user/authenticate", { code }));
        if (error) {
          return setIsLoading(false);
        }
        onLogin?.();
        const payload = { ...state, user: response.data, isLoggedIn: true };
        return dispatch({ type: "LOGIN", payload });
      })();
    }
  }, [state, dispatch, isLoading, onLogin]);

  if (state.isLoggedIn) {
    const avatar_url =
      state.user?.avatar_url || "https://www.svgrepo.com/show/350417/user-circle.svg";
    return (
      <div className="flex flex-col text-base justify-center items-center">
        <img src={avatar_url} className="profile-picture" />
        <span>{state.user?.login}</span>
        <button
          type="button"
          className="btn"
          onClick={() => {
            dispatch({ type: "LOGOUT" });
            onLogout?.();
            setIsLoading(false);
          }}
        >
          Logout
        </button>
      </div>
    );
  }

  if (isLoading) {
    return <Loader />;
  }

  return (
    <a
      className="btn"
      href={`https://github.com/login/oauth/authorize?scope=user&client_id=${client_id}&redirect_uri=${redirect_uri}`}
      onClick={() => setIsLoading(true)}
    >
      <Icon icon={Icon.Brands.faGithub} />
      <span>Login with GitHub</span>
    </a>
  );
}
