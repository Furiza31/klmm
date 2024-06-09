import bcrypt from "bcryptjs";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const runtimeConfig = useRuntimeConfig();

  const existingUser = await event.context.prisma.user.findUnique({
    where: { email: body.email },
  });

  if (existingUser) {
    return {
      status: 409,
      body: { error: "User already exists" },
    };
  }

  const hashedPassword = await bcrypt.hashSync(
    body.password,
    runtimeConfig.bcrypt.saltRounds
  );

  const user = await event.context.prisma.user.create({
    data: {
      email: body.email,
      password: hashedPassword,
      name: body.name,
    },
  });

  return {
    status: 201,
    body: {
      user,
    },
  };
});
