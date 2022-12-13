import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { useEffect, useState } from "react";
import LoginGithub from "react-login-github";

interface LoginButtonProps {
  onLogin: (dbToken: string) => void;
  onLogout: () => void;
}
interface AuthResponse {
  username: string;
  dbToken: string;
}
export function LoginButton(props: LoginButtonProps) {
  const [username, setUsername] = useState("");
  async function onSuccess(response: { code: string }) {
    const { data } = await axios.post<AuthResponse>("/api/autenticate", {
      oAuthCode: response.code,
    });
    const { username, dbToken } = data;
    setUsername(username);
    props.onLogin(dbToken);
    localStorage.setItem("AuthenticatedUserName", username);
    localStorage.setItem("AuthenticatedUserDBToken", dbToken);
  }
  function onFailure(response: Error) {
    console.log(response);
  }
  function logout() {
    props.onLogout();
    setUsername("");
    localStorage.removeItem("AuthenticatedUserName");
    localStorage.removeItem("AuthenticatedUserDBToken");
  }
  useEffect(() => {
    if (localStorage.length > 0) {
      const username = localStorage.getItem("AuthenticatedUserName");
      const dbToken = localStorage.getItem("AuthenticatedUserDBToken");
      setUsername(username || "");
      props.onLogin(dbToken || "");
    }
  }, [props]);
  return (
    <div className="flex flex-col items-center justify-center gap-2">
      <h2 className="title">
        {username ? `Logged in as ${username}` : "Not logged in"}
      </h2>
      {username ? (
        <button className="login-github" onClick={logout}>
          Logout
        </button>
      ) : (
        <div className="login-github">
          <LoginGithub
            buttonText="Login with GitHub"
            clientId={process.env.REACT_APP_OAUTH_CLIENT}
            onSuccess={onSuccess}
            onFailure={onFailure}
          />

          <FontAwesomeIcon icon={faGithub} />
        </div>
      )}
    </div>
  );
}
