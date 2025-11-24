import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import UserModel from "./models/user.model";
import bcrypt from "bcryptjs";
import ConnectDB from "./lib/db";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        await ConnectDB();
        const email = credentials?.email;
        const password = credentials?.password as string;
        if (!email || !password) {
          throw new Error("Missing email or password");
        }
        const user = await UserModel.findOne({ email });
        if (!user) {
          throw new Error("No user found");
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
          throw new Error("Invalid password");
        }
        return user;
      },
    }),
  ],
  callbacks: {
    // token ke andar user ka data dalta hai ye function
    jwt({ token, user }) {
      if (user) {
        token.id = user.id as string;
        token.name = user.name as string;
        token.email = user.email as string;
        token.role = user.role as string;
      }
      return token;
    },
    // session ke andar token ka data use karke user ka data dalta hai ye function
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.name = token.name as string;
        session.user.email = token.email as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60 * 1000,
  },
  secret: process.env.AUTH_SECRET,
});
