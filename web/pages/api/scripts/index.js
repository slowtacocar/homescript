import nc from "next-connect";
import { auth, connection, onError } from "../../../lib/middleware";
import { Script } from "../../../lib/models";

export default nc({ onError })
  .use(auth)
  .use(connection)
  .post(async (req, res) => {
    const script = await new Script({
      ...req.body,
      userId: req.session.user.email,
    }).save();
    res.status(201).json(script);
  })
  .get(async (req, res) => {
    const scripts = await Script.find({ userId: req.session.user.email })
      .lean()
      .exec();
    res.status(200).json(scripts);
  });
