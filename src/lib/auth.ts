import { NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";

const githubId = process.env.GITHUB_ID;
const githubSecret = process.env.GITHUB_SECRET;

export const authOptions: NextAuthOptions = {
  providers: [
    GithubProvider({
      clientId: githubId ?? "",
      clientSecret: githubSecret ?? "",
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        // @ts-ignore
        session.user.id = token.sub;
        // @ts-ignore
        session.accessToken = token.accessToken;
      }
      return session;
    },
  },
};
