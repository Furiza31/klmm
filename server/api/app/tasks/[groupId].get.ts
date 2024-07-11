export default defineEventHandler(async (event) => {
  const groupId = Number(getRouterParam(event, "groupId"));

  if (isNaN(groupId)) {
    return {
      status: 400,
      body: {
        message: "Invalid groupId",
        data: null,
      },
    };
  }

  const tasks = await event.context.prisma.task.findMany({
    where: {
      groupId,
      group: {
        userId: event.context.session.userId,
      },
    },
  });

  return {
    status: 200,
    body: {
      message: "Tasks fetched successfully",
      data: {
        tasks,
      },
    },
  };
});
