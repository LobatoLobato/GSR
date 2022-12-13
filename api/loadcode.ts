import { VercelRequest, VercelResponse } from "@vercel/node";
import { MongoClient, Db, ObjectId } from "mongodb";
import url from "url";

interface ApiRequest extends VercelRequest {
  body: {
    dbToken: string;
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

export default async function loadCode(req: ApiRequest, res: VercelResponse) {
  const { dbToken } = req.body;

  const db = await connectToDatabase(process.env.MONGODB_URI as string);

  const collection = db.collection<{
    _id: ObjectId;
    code: string;
    githubUsername: string;
  }>("users");

  try {
    const item = await collection.findOne(new ObjectId(dbToken));
    if (!item) throw new Error("");
    const { code, githubUsername } = item;

    return res.status(201).json({ ok: true, code, githubUsername });
  } catch (err) {
    return res.status(401).json({ ok: false, registeredId: dbToken });
  }
}
