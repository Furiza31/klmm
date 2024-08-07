import UserMiddlewares from "@/prisma/middleware/user-default-taskGroup";
import { PrismaClient } from "@prisma/client";
let prisma: PrismaClient;

declare module "h3" {
  interface H3EventContext {
    prisma: PrismaClient;
  }
}

export default defineEventHandler((event) => {
  if (!prisma) {
    prisma = new PrismaClient();
    prisma.$use(UserMiddlewares);
  }
  event.context.prisma = prisma;
});

export { prisma };
