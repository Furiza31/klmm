export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const headers = getHeaders(event);
  const runtimeConfig = useRuntimeConfig();

  if (headers.authorization !== runtimeConfig.apiKey) {
    return {
      status: 401,
      body: { error: "Unauthorized" },
    };
  }

  const user = await event.context.prisma.user.findUnique({
    where: { email: body.email },
  });

  return {
    status: 200,
    body: { user },
  };
});
