import { VercelRequest, VercelResponse } from "@vercel/node";
import { MongoClient, Db, ObjectId } from "mongodb";
import {
  CONSTANTS,
  GitHubData,
  githubStatsParser,
  htmlFormatter,
  styleTagScoper,
} from "../src/common/utils";
import url from "url";
import { fetchGithubData } from "../src/fetchers";

interface ApiRequest extends VercelRequest {
  query: {
    token: string;
    height: string;
  };
  body: {
    code: string;
    username: string;
  };
}

let cachedDb: Db | null = null;

async function connectToDatabase(uri: string) {
  if (cachedDb) return cachedDb;

  const client = await MongoClient.connect(uri);

  const dbName = url.parse(uri).pathname?.substring(1);
  const db = client.db(dbName);

  cachedDb = db;

  return db;
}

export default async function foo(req: ApiRequest, res: VercelResponse) {
  try {
    const { token, height } = req.query;

    const db = await connectToDatabase(process.env.MONGODB_URI as string);

    const collection = db.collection<{
      _id: ObjectId;
      code: string;
      githubUsername: string;
    }>("users");

    res.setHeader("Content-Type", "image/svg+xml");

    const cacheSeconds = CONSTANTS.FOUR_HOURS;

    res.setHeader(
      "Cache-Control",
      `max-age=${
        cacheSeconds / 2
      },s-maxage=${cacheSeconds}, stale-while-revalidate=${CONSTANTS.ONE_DAY}`,
    );

    const item = await collection.findOne(new ObjectId(token));
    if (!item) throw new Error();
    const { githubUsername, code } = item;
    if (!githubUsername) throw new Error();

    const githubData = await fetchGithubData({ username: githubUsername });

    const a = createNSDiv(code, githubData);
    console.log(a.replace(/\n/gm, "").replace(/\s+/gim, " "));

    return res.status(201).send(`
    <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="${height}">
        <foreignObject
          width="100%"
          height="100%"
        >
        ${a.replace(/\n/gm, "")}
        </foreignObject>
    </svg>
    `);
  } catch (err) {
    res.setHeader("Cache-Control", `no-cache, no-store, must-revalidate`); // Don't cache error responses.
    console.log(err);
    return res.send({});
  }
}

function createNSDiv(xhtml: string, githubData: GitHubData): string {
  let preFormattedCode = "";
  try {
    preFormattedCode = htmlFormatter(xhtml);
  } catch (e) {
    const error = e as Error;
    return `
    <div xmlns="http://www.w3.org/1999/xhtml">
      <style>
        .error-view {
          width: 100%;
          height: 94vh;
          overflow: hidden;
          background: transparent;
          resize: none;
          outline: none;
          caret-color: transparent;
          padding: 4px;
        }
      </style>
      <textarea class="error-view" readonly>${error.message}</textarea>
    </div>`;
  }
  const parsedXhtml = githubStatsParser(preFormattedCode, githubData);
  const { scope, scopedXhtml } = styleTagScoper(parsedXhtml);
  return `
    <div xmlns="http://www.w3.org/1999/xhtml" class="${scope}">
      ${htmlFormatter(scopedXhtml)}
    </div>`;
}
