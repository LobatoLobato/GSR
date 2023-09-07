import express from "express";
import UserService from "@api/services/UserService";
import FetchService from "@api/services/FetchService";

const userRouter = express.Router();

interface AuthRequestBody {
  code: string;
}
userRouter.post("/authenticate", async (req, res) => {
  const { code } = req.body as AuthRequestBody;

  try {
    const result = await UserService.authenticate(code);

    return res.status(result.ok ? 200 : 404).send(result);
  } catch (err) {
    console.log(err);
    return res.status(500).send(err);
  }
});

interface LoadRequestBody {
  username: string;
}
userRouter.post("/load", async (req, res) => {
  const { username } = req.body as LoadRequestBody;
  try {
    const result = await UserService.load(username);

    return res.status(result.ok ? 200 : 304).send(result);
  } catch (err) {
    return res.status(500).send(err);
  }
});

interface UploadRequestBody {
  code: string;
  username: string;
}
userRouter.post("/upload", async (req, res) => {
  const { code, username } = req.body as UploadRequestBody;
  try {
    const result = await UserService.upload(code, username);

    return res.status(result.ok ? 200 : 404).send(result);
  } catch (err) {
    return res.status(500).send(err);
  }
});

userRouter.post("/githubdata", async (req, res) => {
  const { username } = req.body;

  if (!username) return res.status(404).send("viajou");
  const data = await FetchService.fetchGithubData(username);
  return res.status(200).json(data);
});

export default userRouter;
