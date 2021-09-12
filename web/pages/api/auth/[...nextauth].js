import { defaults } from "../../../lib/modules";
import NextAuth from "next-auth";
import Providers from "next-auth/providers";
import { connection } from "../../../lib/middleware";
import { User } from "../../../lib/models";

export default NextAuth({
  providers: [
    Providers.GitHub({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
    Providers.Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  events: {
    async signIn(message) {
      await new Promise((resolve) => {
        connection({}, null, resolve);
      });
      if (
        (await User.countDocuments({ _id: message.user.email }).exec()) <= 0
      ) {
        await new User({ _id: message.user.email, global: defaults }).save();
      }
    },
  },
});
