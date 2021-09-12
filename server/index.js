import dotenv from "dotenv";
import User from "./user.js";
import { MongoClient } from "mongodb";
import Script from "./script.js";

dotenv.config();

const users = {};
const scripts = {};

function printStatus() {
  console.clear();
  console.log("Users:");
  for (const user in users) {
    console.log("  " + user);
  }
  console.log("Scripts:");
  for (const script in scripts) {
    console.log("  " + script);
  }
}

const client = new MongoClient(process.env.DB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
client.connect().then(() => {
  const db = client.db("homescript");
  const usersCollection = db.collection("users");
  const scriptsCollection = db.collection("scripts");

  usersCollection.find().forEach((doc) => {
    users[doc._id] = new User(doc);
    printStatus();
  });
  scriptsCollection.find().forEach(async (doc) => {
    if (users[doc.userId]) {
      await users[doc.userId].promise;
      scripts[doc._id] = new Script(users[doc.userId], doc);
      printStatus();
    }
  });

  usersCollection
    .watch({ fullDocument: "updateLookup" })
    .on("change", (next) => {
      if (next.operationType === "delete") {
        delete users[next.documentKey._id];
      } else {
        if (users[next.documentKey._id]) {
          users[next.documentKey._id].update(next.fullDocument);
        } else {
          users[next.documentKey._id] = new User(next.fullDocument);
        }
      }
      printStatus();
    });
  scriptsCollection
    .watch({ fullDocument: "updateLookup" })
    .on("change", async (next) => {
      if (next.operationType === "delete") {
        scripts[next.documentKey._id].stop();
        delete scripts[next.documentKey._id];
      } else {
        if (scripts[next.documentKey._id]) {
          scripts[next.documentKey._id].stop();
        }
        if (users[next.fullDocument.userId]) {
          await users[next.fullDocument.userId].promise;
          scripts[next.documentKey._id] = new Script(
            users[next.fullDocument.userId],
            next.fullDocument
          );
        }
      }
      printStatus();
    });
});
