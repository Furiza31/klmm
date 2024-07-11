import { prisma } from "@/server/middleware/prisma";
import { Prisma } from "@prisma/client";

const middleware: Prisma.Middleware = async (params, next) => {
  if (params.model === "User" && params.action === "create") {
    const result = await next(params);
    const userId = result.id;
    await prisma.taskGroup.create({
      data: {
        name: "Default",
        userId: userId,
      },
    });
    return result;
  }
  return next(params);
};

export default middleware;
