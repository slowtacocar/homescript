import nc from "next-connect";
import { auth, connection, onError } from "../../../lib/middleware";
import { User } from "../../../lib/models";

export default nc({ onError })
  .use(auth)
  .use(connection)
  .get(async (req, res) => {
    const { global } = await User.findById(req.session.user.email, "global")
      .lean()
      .exec();
    res.status(200).json(global);
  })
  .patch(async (req, res) => {
    await User.updateOne(
      { _id: req.session.user.email },
      Object.fromEntries(
        Object.entries(req.body).map(([key, value]) => [`global.${key}`, value])
      )
    )
      .lean()
      .exec();
    res.status(204).end();
  });
