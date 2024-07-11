import { getServerSession } from "#auth";

declare module "h3" {
  interface H3EventContext {
    session: {
      userId: number;
    };
  }
}

export default defineEventHandler(async (event) => {
  const route = event.path;
  const regex = /\/api\/app\/.*/;
  if (!regex.test(route)) {
    return;
  }
  const session = await getServerSession(event);
  if (!session) {
    throw createError({ statusMessage: "Unauthenticated", statusCode: 403 });
  }
  event.context.session = session as unknown as { userId: number };
});
