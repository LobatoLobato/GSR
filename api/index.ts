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
}

let cachedDb: Db | null = null;

async function connectToDatabase(uri: string) {
  if (cachedDb) return cachedDb;
  // console.time("DBCONNECT");
  const client = await MongoClient.connect(uri);
  // console.timeEnd("DBCONNECT");
  const dbName = url.parse(uri).pathname?.substring(1);
  const db = client.db(dbName);

  cachedDb = db;

  return db;
}

export default async function render(req: ApiRequest, res: VercelResponse) {
  try {
    const { token, height } = req.query;
    // console.log();
    // console.time("DB");
    const db = await connectToDatabase(process.env.MONGODB_URI as string);
    // console.timeEnd("DB");

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
    // console.time("FIND_ONE");
    const item = await collection.findOne(new ObjectId(token));
    // console.timeEnd("FIND_ONE");
    if (!item) throw new Error();
    const { githubUsername, code } = item;
    if (!githubUsername) throw new Error();

    // console.time("GITHUBDATA");
    const githubData = await fetchGithubData({ username: githubUsername });
    // console.timeEnd("GITHUBDATA");

    // console.time("NSDIV");
    const nsDiv = createNSDiv(code, githubData);
    // console.timeEnd("NSDIV");

    return res.send(`
    <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="${height}">
        <foreignObject
          width="100%"
          height="100%"
        >
        ${nsDiv.replace(/\n/gm, "")}
        </foreignObject>
    </svg>
    `);
  } catch (err) {
    res.setHeader("Cache-Control", `no-cache, no-store, must-revalidate`); // Don't cache error responses.
    console.log(err);
    return res.send(`
    <svg>
      ${err.message}
    </svg>
    `);
  }
}

function createNSDiv(xhtml: string, githubData: GitHubData): string {
  let preFormattedCode = htmlFormatter(xhtml);
  const parsedXhtml = githubStatsParser(preFormattedCode, githubData);
  const { scope, scopedXhtml } = styleTagScoper(parsedXhtml);
  return `
    <div xmlns="http://www.w3.org/1999/xhtml" class="${scope}">
      ${scopedXhtml}
    </div>`;
}
