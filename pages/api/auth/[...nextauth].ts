import NextAuth from "next-auth/next";
import type { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import { prisma } from "@/db";
import bcrypt from "bcrypt";

export const authOptions: AuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials, req) {
        if (!credentials) throw new Error("Informe as credenciais");

        const { email, password } = credentials;

        const user = await prisma.user.findFirst({
          where: {
            email: email,
          },
        });

        if (!user) throw new Error("Usuário não existe");
        if (!user.is_enabled) throw new Error("Usuário desativado.");

        const match = await bcrypt.compare(password, user.password);
        if (match) {
          return {
            id: `${user.id}`,
            name: user.name,
            email: user.email,
            role: user.role,
          };
        } else {
          throw new Error("Credenciais inválidas");
        }
      },
    }),
  ],
  callbacks: {
    jwt: async ({ token, user }) => {
      return { ...token, ...user };
    },
    session: async ({ session, token, user }) => {
      session.user = token;
      return session;
    },
  },
};

export default NextAuth(authOptions);
