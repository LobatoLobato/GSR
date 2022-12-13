import { VercelRequest, VercelResponse } from "@vercel/node";
import { MongoClient, Db, ObjectId } from "mongodb";
import url from "url";

interface ApiRequest extends VercelRequest {
  body: {
    code: string;
    githubUsername: string;
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

export default async function uploadCode(req: ApiRequest, res: VercelResponse) {
  const { code, githubUsername, dbToken } = req.body;

  const db = await connectToDatabase(process.env.MONGODB_URI as string);

  const collection = db.collection("users");

  try {
    const a = await collection.insertOne({
      _id: new ObjectId(dbToken),
      githubUsername,
      code,
    });

    return res.status(201).json({ ok: true, registeredId: a.insertedId });
  } catch (err) {
    try {
      await collection.updateOne(
        {
          _id: new ObjectId(dbToken),
        },
        { $set: { code, githubUsername } },
      );
      return res.status(201).json({ ok: true, registeredId: dbToken });
    } catch (err) {
      return res.status(401).json({ ok: false, registeredId: dbToken });
    }
  }
}
