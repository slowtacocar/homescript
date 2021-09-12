import nc from "next-connect";
import { auth, connection, onError } from "../../../lib/middleware";
import { Script } from "../../../lib/models";

export default nc({ onError })
  .use(auth)
  .use(connection)
  .get(async (req, res) => {
    const script = await Script.findById(req.query.id).lean().exec();
    if (script.userId === req.session.user.email) {
      res.status(200).json(script);
    } else {
      res.status(404).end();
    }
  })
  .patch(async (req, res) => {
    const { userId } = await Script.findById(req.query.id, "userId")
      .lean()
      .exec();
    if (userId === req.session.user.email) {
      await Script.updateOne({ _id: req.query.id }, req.body).lean().exec();
      res.status(204).end();
    } else {
      res.status(404).end();
    }
  })
  .delete(async (req, res) => {
    const { userId } = await Script.findById(req.query.id, "userId")
      .lean()
      .exec();
    if (userId === req.session.user.email) {
      await Script.deleteOne({ _id: req.query.id }, req.body).exec();
      res.status(204).end();
    } else {
      res.status(404).end();
    }
  });
