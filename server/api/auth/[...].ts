import { NuxtAuthHandler } from "#auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { PrismaClient, User } from "@prisma/client";
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

export default NuxtAuthHandler({
  pages: {
    signIn: "/auth",
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
    // @ts-expect-error You need to use .default here for it to work during SSR. May be fixed via Vite at some point
    GithubProvider.default({
      clientId: runtimeConfig.github.clientId,
      clientSecret: runtimeConfig.github.clientSecret,
    }),
  ],
});
