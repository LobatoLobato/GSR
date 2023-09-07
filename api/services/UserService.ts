import { prisma } from "@api/models/prisma";
import codeFormatter from "@api/utils/codeFormatter";
import axios from "axios";

interface TokenResponse {
  data: {
    access_token: string;
    token_type: string;
    scope: string;
  };
}
async function authenticate(oAuthCode: string) {
  const tokenUrl = "https://github.com/login/oauth/access_token";
  const { data }: TokenResponse = await axios.post(
    tokenUrl,
    {
      client_id: process.env.VITE_GITHUB_OAUTH_CLIENT_ID,
      client_secret: process.env.VITE_GITHUB_OAUTH_CLIENT_SECRET,
      code: oAuthCode,
      redirect_uri: process.env.VITE_GITHUB_OAUTH_REDIRECT_URI,
    },
    {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    },
  );

  const { access_token } = data;
  if (!access_token) return { ok: false, message: "Error getting access token" };

  const userUrl = "https://api.github.com/user";
  const user_info = await axios.get(userUrl, {
    headers: { Authorization: `Bearer ${access_token}` },
  });

  return { ok: true, ...user_info.data };
}

async function load(github_username: string) {
  try {
    const user = await prisma.user.findFirst({ where: { github_username } });
    if (!user) throw new Error("User not found");

    const htmlCode = user.code.replace(/<style.*?>(.|\n)+?<\/style>/gim, "");
    const cssCode = user.code.match(/(?<=<style.*?>)(.|\n)+?(?=<\/style>)/gim)?.join("\n") ?? "";
    const code = {
      htmlCode: (await codeFormatter(htmlCode, "html")),
      cssCode: await codeFormatter(cssCode, "css")
    };

    return { ok: true, code, github_username };
  } catch (err) {
    const error = err as Error;

    if (error.message.includes("User not found")) {
      return { ok: false, message: (err as Error).message };
    }

    throw error;
  }
}

async function upload(code: string, github_username: string) {
  code = code.replace(/((?<=>)\s+)|(\n\s+)/g, " ");

  try {
    const user = await prisma.user.findFirst({ where: { github_username } });
    if (!user) await prisma.user.create({ data: { code, github_username } });
    else await prisma.user.update({ data: { code }, where: { github_username } });

    return { ok: true, github_username };
  } catch (err) {
    const error = err as Error;

    if (error.message.includes("User not found")) {
      return { ok: false, message: (err as Error).message };
    }

    throw error;
  }
}

export default {
  authenticate,
  load,
  upload,
};
