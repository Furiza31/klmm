import bcrypt from "bcryptjs";

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

  if (!user) {
    return {
      status: 404,
      body: { error: "User not found" },
    };
  }
  const passwordMatch =
    body.password && user.password
      ? await bcrypt.compare(body.password, user.password)
      : false;

  if (!passwordMatch) {
    return {
      status: 401,
      body: { error: "Invalid password" },
    };
  }

  return {
    status: 200,
    body: { user },
  };
});
