import { NuxtAuthHandler } from "#auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { PrismaClient, User } from "@prisma/client";
import CredentialsProvider from "next-auth/providers/credentials";
import GithubProvider from "next-auth/providers/github";

const runtimeConfig = useRuntimeConfig();
const prisma = new PrismaClient();
const getMe = async (session: any) => {
  return await $fetch("/api/me", {
    method: "POST",
    headers: {
      authorization: runtimeConfig.apiKey,
    },
    body: {
      email: session?.user?.email,
    },
  });
};
const login = async (credentials: { email: string; password: string }) => {
  return await $fetch("/api/auth/login", {
    method: "POST",
    headers: {
      authorization: runtimeConfig.apiKey,
    },
    body: {
      email: credentials.email,
      password: credentials.password,
    },
  });
};

export default NuxtAuthHandler({
  secret: runtimeConfig.auth.secret,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/auth",
    error: "/auth",
  },
  // @ts-expect-error
  adapter: PrismaAdapter(prisma),
  callbacks: {
    session: async ({ session }) => {
      const { body } = (await getMe(session)) as unknown as {
        body: { user: User };
      };
      (session as any).language = body.user.language;
      return Promise.resolve(session);
    },
  },
  providers: [
    // @ts-expect-error
    GithubProvider.default({
      name: "github",
      clientId: runtimeConfig.github.clientId,
      clientSecret: runtimeConfig.github.clientSecret,
    }),
    // @ts-expect-error
    CredentialsProvider.default({
      name: "credentials",
      credentials: {},
      async authorize(credentials: { email: string; password: string }) {
        const { body } = (await login(credentials)) as unknown as {
          body: { user: User; error: string };
        };
        if (body.user) return body.user;
        return null;
      },
    }),
  ],
});
