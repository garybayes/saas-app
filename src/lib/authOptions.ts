// src/lib/authOptions.ts
import type { NextAuthOptions } from "next-auth";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export const authConfig: NextAuthOptions = {
  pages: {
    signIn: "/login",
  },

  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email" },
        password: { label: "Password", type: "password" },
      },

      async authorize(creds) {
        if (!creds?.email || !creds?.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: creds.email },
        });

        if (!user) return null;

        const valid = await bcrypt.compare(creds.password, user.password);
        if (!valid) return null;

        return {
          id: user.id,
          email: user.email,
          displayName: user.displayName,
          theme: user.theme,
        };
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },

  secret: process.env.NEXTAUTH_SECRET,

  callbacks: {
    async jwt({ token, user, trigger, session }) {
      // First login: merge DB fields into token
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.displayName = user.displayName;
        token.theme = user.theme;
      }

      // Theme/profile updated in Settings → sync JWT
      if (trigger === "update" && session) {
        if (session.displayName) token.displayName = session.displayName;
        if (session.theme) token.theme = session.theme;
      }

      return token;
    },

    async session({ session, token }) {
      session.user = {
        id: token.id as string,
        email: token.email as string,
        displayName: token.displayName as string,
        theme: token.theme as string,
      };
      return session;
    },
  },

  events: {
    async signIn({ user }) {
      if (!user?.id) return;

      await prisma.user.update({
        where: { id: user.id },
        data: { lastLogin: new Date() },
      });
    },
  },
};

// Required by Next.js Route Handler
const handler = NextAuth(authConfig);
export { handler as GET, handler as POST };
