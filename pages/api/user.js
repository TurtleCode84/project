import { withIronSessionApiRoute } from "iron-session/next";
import { sessionOptions } from "lib/session";
import { ObjectId } from 'mongodb'
import clientPromise from "lib/mongodb";
import { hash, compare } from 'bcryptjs';
import {v4 as uuidv4} from "uuid";

export default withIronSessionApiRoute(userRoute, sessionOptions);

async function userRoute(req, res) {
  if (req.method === 'GET') {
    if (req.session.user) {
      const client = await clientPromise;
      const db = client.db("data");
      const query = { _id: ObjectId(req.session.user.id) };
      const userInfo = await db.collection("users").findOne(query);
      if (!userInfo) {
        await req.session.destroy();
        res.json({
          isLoggedIn: false,
          id: "",
          username: "",
          permissions: {},
        });
        return;
      }
      const user = {
        ...req.session.user,
        isLoggedIn: true,
        email: userInfo.email,
        profilePicture: userInfo.profilePicture,
        history: { joined: userInfo.history.joined, banReason: userInfo.history.banReason, warnings: userInfo.history.warnings },
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
    const body = await req.body;
    const user = req.session.user;
    if (!user || !user.isLoggedIn || user.permissions.banned ) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }
    const client = await clientPromise;
    const db = client.db("data");
    const query = { _id: ObjectId(user.id) };
    if (body.acknowledgedWarning) {
      try {
        const warnUpdateDoc = {
          $set: {'permissions.warned': false},
        };
        const updatedWarn = await db.collection('users').updateOne(query, warnUpdateDoc);
        res.json(updatedWarn);
      } catch (error) {
        res.status(500).json({ "message": error.data.message });
      }
    } else {
      //start
      var updateUser = {};
      const query = { _id: ObjectId(user.id) }
      if (body.username && user.permissions.verified) {
        const taken = await db.collection('users').countDocuments({ username: body.username.trim().toLowerCase() });
        if (taken > 0) {
          res.status(422).json({ message: "Username is already taken!" });
          return;
        } else {
          updateUser.username = body.username.trim().toLowerCase()
        }
      } else if (!user.permissions.verified) {
        res.status(401).json({ message: "Only verified users can change their username!" });
        return;
      }
      //1
      if (body.email !== undefined) {updateUser.email = body.email.trim().toLowerCase()}
      if (body.password) {
        const oldPass = await db.collection("users").find(query).project({ password: 1 });
        const newPass = await hash(body.password, 10);
        const passwordMatch = await compare(newPass, oldPass.password);
        if (passwordMatch) {
          updateUser.password = await hash(body.password, 10);
        } else {
          res.status(401).json({ message: "Incorrect current password!" });
          return;
        }
      }
      //2
      if (body.resetShareKey) {updateUser.shareKey = uuidv4()}
      if (body.profilePicture !== undefined) {updateUser.profilePicture = body.profilePicture}
      const updateDoc = {
        $set: updateUser,
      };
      const updated = await db.collection('users').updateOne(query, updateDoc);
      res.json(updated);
      //end
    }
  } else if (req.method === 'DELETE') {
    const user = req.session.user;
    if (user.permissions.admin) {
      res.status(403).json({ message: "Trying to take the easy way out, huh? I don\'t think so..." });
      return;
    }
    const client = await clientPromise;
    const db = client.db("data");
    const deletedTasks = await db.collection("tasks").deleteMany({ owner: ObjectId(user.id) });
    const deletedCollections = await db.collection("collections").deleteMany({ owner: ObjectId(user.id) });
    const deletedUser = await db.collection("users").deleteOne({ id: ObjectId(user.id) });
    res.json(deletedUser);
  } else {
    res.status(405).json({ message: "Method not allowed" });
    return;
  }
}
