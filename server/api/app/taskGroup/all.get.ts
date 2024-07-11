export default defineEventHandler(async (event) => {
  const groups = await event.context.prisma.taskGroup.findMany({
    where: {
      userId: event.context.session.userId,
    },
  });

  return {
    status: 200,
    body: { groups },
  };
});
