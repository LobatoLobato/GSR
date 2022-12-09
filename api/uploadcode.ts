import { VercelRequest, VercelResponse } from "@vercel/node";
import { MongoClient, Db, ObjectId } from "mongodb";
import { stringToHex } from "../src/common/utils";
import url from "url";

interface ApiRequest extends VercelRequest {
  body: {
    code: string;
    githubUsername: string;
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
  const { code, githubUsername } = req.body;

  const userId = stringToHex(githubUsername);
  if (!userId) return res.status(404).json({ ok: false, registeredId: userId });

  const db = await connectToDatabase(process.env.MONGODB_URI as string);

  const collection = db.collection("users");
  try {
    const a = await collection.insertOne({
      _id: new ObjectId(userId),
      githubUsername,
      code,
    });
    console.log({
      _id: new ObjectId(userId),
      githubUsername,
    });
    return res.status(201).json({ ok: true, registeredId: a.insertedId });
  } catch (err) {
    try {
      await collection.updateOne(
        {
          _id: new ObjectId(userId),
        },
        { $set: { code, githubUsername } },
      );
      return res.status(201).json({ ok: true, registeredId: userId });
    } catch (err) {
      return res.status(401).json({ ok: false, registeredId: userId });
    }
  }
  // res.setHeader("Content-Type", "application/json");
  // res.setHeader("Cache-Control", `no-store`);

  // try {
  //   return res.send("something");
  // } catch (err) {
  //   return res.send(err.message);
  // }
}
