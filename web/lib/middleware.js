import mongoose from "mongoose";
import { getSession } from "next-auth/client";

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function auth(req, res, next) {
  const session = await getSession({ req });

  if (session) {
    req.session = session;
    next();
  } else {
    res.status(401).send("User not authenticated");
  }
}

export async function connection(req, res, next) {
  if (!cached.conn) {
    if (!cached.promise) {
      cached.promise = mongoose.connect(process.env.DB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
    }
    cached.conn = await cached.promise;
  }
  req.connection = cached.conn;
  next();
}

export function onError(error, req, res) {
  console.error(error);
  res.status(error.status || 500).send(error.message);
}
