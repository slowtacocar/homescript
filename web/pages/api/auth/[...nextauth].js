import { defaults } from "../../../lib/modules";
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import { connection } from "../../../lib/middleware";
import { User } from "../../../lib/models";

export default NextAuth({
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  events: {
    async signIn({ user }) {
      await new Promise((resolve) => {
        connection({}, null, resolve);
      });
      if ((await User.countDocuments({ _id: user.email }).exec()) <= 0) {
        await new User({ _id: user.email, global: defaults }).save();
      }
    },
  },
});
