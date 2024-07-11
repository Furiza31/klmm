import { taskGroupDeleteSchema } from "~/schema/TaskGroupSchema";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { errors, value } = await taskGroupDeleteSchema.parse(body);

  if (errors.length > 0 || !value)
    return {
      status: 400,
      body: { message: "Invalid task group", data: errors },
    };

  const taskGroup = await event.context.prisma.taskGroup.delete({
    where: { id: value.id, userId: event.context.session.userId },
  });

  return {
    status: 200,
    body: {
      message: `Task group ${taskGroup.name} deleted successfully`,
      data: taskGroup,
    },
  };
});
