import { withIronSessionApiRoute } from "iron-session/next";
import { sessionOptions } from "lib/session";
import { ObjectId } from 'mongodb'
import clientPromise from "lib/mongodb";

export default withIronSessionApiRoute(userRoute, sessionOptions);

async function userRoute(req, res) {
  if (req.method === 'POST') {
    if (req.session.user) {
      const client = await clientPromise;
      const db = client.db("data");
      const query = { _id: ObjectId(req.session.user.id) };
      const userInfo = await db.collection("users").findOne(query);
      const user = {
        ...req.session.user,
        isLoggedIn: true,
        email: userInfo.email,
        profilePicture: userInfo.profilePicture,
        history: { joined: userInfo.history.joined, banReason: userInfo.history.banReason },
        shareKey: userInfo.shareKey,
        permissions: userInfo.permissions,
      };
      req.session.user = user;
      await req.session.save();
      res.json(user);
    } else {
      res.json({
        isLoggedIn: false,
        id: "",
        username: "",
        permissions: {},
      });
    }
  } else if (req.method === 'POST') {
    res.status(418).json({ message: "Under construction" });
    return;
  } else {
    res.status(405).json({ message: "Method not allowed" });
    return;
  }
}
