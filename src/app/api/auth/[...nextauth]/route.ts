import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import { compare } from "bcryptjs";

const handler = NextAuth({
  adapter: PrismaAdapter(prisma),

  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email) throw new Error("Email required.");

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user) throw new Error("No user found.");

        // ✅ Allow login if user has no password (for dev/testing)
        if (!user.password && !credentials.password) {
          return user;
        }

        // 🚫 Require password if one exists in DB
        if (user.password && !credentials.password) {
          throw new Error("Password required.");
        }

        // 🔐 Compare password hash
        const isValid = await compare(credentials.password, user.password);
        if (!isValid) throw new Error("Invalid password.");

        return user;
      },
    }),
  ],

  // ✅ Required for Credentials Provider
  session: {
    strategy: "jwt",
  },

  jwt: {
    maxAge: 60 * 60 * 24 * 30, // 30 days
  },

  pages: {
    signIn: "/login",
  },

  callbacks: {
    async session({ session, token }) {
      if (token?.sub) session.user.id = token.sub;
      return session;
    },
    async redirect({ baseUrl }) {
      return `${baseUrl}/connections`;
    },
  },

  secret: process.env.SESSION_SECRET,
});

export { handler as GET, handler as POST };
