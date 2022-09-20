import { withIronSessionApiRoute } from "iron-session/next";
import { sessionOptions } from "lib/session";
import { ObjectId } from 'mongodb'
import clientPromise from "lib/mongodb";

export default withIronSessionApiRoute(adminTaskRoute, sessionOptions);

async function adminTaskRoute(req, res) {
  if (req.method === 'GET') {
    const user = req.session.user;
    if (!user || !user.isLoggedIn || !user.permissions.admin ) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }
    
    const { uid } = req.query.uid
    if (!ObjectId.isValid(uid)) {
      res.status(422).json({ message: "Invalid user ID" });
      return;
    }
    const client = await clientPromise;
    const db = client.db("data");
    const query = { owner: ObjectId(uid) };
  
    try {
      const getTasks = await db.collection("tasks").find(query).toArray();
      res.json(getTasks);
    } catch (error) {
      res.status(200).json([]);
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
