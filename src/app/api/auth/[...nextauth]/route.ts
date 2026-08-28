import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "@/lib/db";
import bcrypt from "bcrypt";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Vul a.u.b. zowel uw e-mailadres als wachtwoord in.");
        }

        // Fetch user from DB
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        // Verify user exists and check for deactivated state
        if (!user) {
          throw new Error("Ongeldig e-mailadres of wachtwoord.");
        }

        if (user.passwordHash === "DEACTIVATED_PENDING_APPROVAL") {
          throw new Error("Uw lidmaatschapsaccount is nog in afwachting van goedkeuring door het bestuur.");
        }

        // Verify password
        const isValidPassword = await bcrypt.compare(credentials.password, user.passwordHash);

        if (!isValidPassword) {
          throw new Error("Ongeldig e-mailadres of wachtwoord.");
        }

        // Return user fields for token
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
      }
      return session;
    },
  },
  pages: {
    signIn: "/leden/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET || "uvon-noord-brabant-secret-key-3392",
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
export default handler;
