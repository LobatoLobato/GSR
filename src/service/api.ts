import axios from "axios";

interface UploadResponse {
  ok: boolean;
  registeredId: string;
}
export async function uploadCode(requestBody: {}) {
  if (!process.env.REACT_APP_UPD_PATH) throw new Error("UPLOAD PATH IS NULL");
  const response = await axios.post<UploadResponse>(
    process.env.REACT_APP_UPD_PATH,
    requestBody,
  );

  return response;
}

interface TokenResponse {
  data: string;
}
export async function authenticateUser(code: string) {
  const proxyUrl = process.env.REACT_APP_PROXY;
  const tokenUrl = "https://github.com/login/oauth/access_token";
  const response: TokenResponse = await axios.post(
    `${proxyUrl}${tokenUrl}`,
    null,
    {
      params: {
        client_id: process.env.REACT_APP_OAUTH_CLIENT,
        client_secret: process.env.REACT_APP_OAUTH_SECRET,
        code: code,
      },
    },
  );
  const access_token = response.data.match(/(?<=access_token=).+?(?=&)/);
  if (!access_token) throw new Error("Error getting access token");

  const userUrl = "https://api.github.com/user";
  const user_info = await axios.get(userUrl, {
    headers: {
      Authorization: `Bearer ${access_token.at(0)}`,
    },
  });

  const dbToken = user_info.data.id + user_info.data.node_id;

  return {
    username: user_info.data.login,
    dbToken,
  };
}
