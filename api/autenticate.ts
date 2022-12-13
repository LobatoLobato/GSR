import axios from "axios";
import { VercelRequest, VercelResponse } from "@vercel/node";
interface TokenResponse {
  data: string;
}
interface ApiRequest extends VercelRequest {
  body: {
    oAuthCode: string;
  };
}
export default async function autenticate(
  req: ApiRequest,
  res: VercelResponse,
) {
  const oAuthCode = req.body.oAuthCode;
  const tokenUrl = "https://github.com/login/oauth/access_token";
  const response: TokenResponse = await axios.post(`${tokenUrl}`, null, {
    params: {
      client_id: process.env.REACT_APP_OAUTH_CLIENT,
      client_secret: process.env.REACT_APP_OAUTH_SECRET,
      code: oAuthCode,
    },
  });
  const access_token = response.data.match(/(?<=access_token=).+?(?=&)/);
  if (!access_token) throw new Error("Error getting access token");

  const userUrl = "https://api.github.com/user";
  const user_info = await axios.get(userUrl, {
    headers: {
      Authorization: `Bearer ${access_token.at(0)}`,
    },
  });
  const filler = "A78391CD8799F97103C8713B";
  const dbToken = (String(user_info.data.id) + filler).slice(0, 24);

  return res.send({
    username: user_info.data.login,
    dbToken,
  });
}
