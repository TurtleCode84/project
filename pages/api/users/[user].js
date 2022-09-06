import clientPromise from "../../../lib/mongodb";

export default async function handler(req, res) {
  const { user } = req.query
  const client = await clientPromise;
  const db = client.db("data");
  const exists = await db.collection("users").find({ username : user }).count();
  if (exists !== 0) {
    const userInfo = await db.collection("users").find({ username : user }); // yes, I know it's a bit inefficient, but nothing else was working
    res.json(userInfo);
  } else {
    res.status(404).json({ error : "user not found" });
  }
}
