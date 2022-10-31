import type { VercelRequest, VercelResponse } from "@vercel/node";

interface ApiRequest extends VercelRequest {
  body: {
    something: {};
  };
}
export default async function foo(req: ApiRequest, res: VercelResponse) {
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Cache-Control", `no-store`);

  try {
    return res.send("something");
  } catch (err) {
    return res.send(err.message);
  }
}
