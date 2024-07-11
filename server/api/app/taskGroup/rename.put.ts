import { taskGroupRenameSchema } from "~/schema/TaskGroupSchema";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { errors, value } = await taskGroupRenameSchema.parse(body);

  const firstLetterToUpperCase = (str: string) =>
    str.charAt(0).toUpperCase() + str.slice(1);

  if (errors.length > 0 || !value)
    return {
      status: 400,
      body: { message: "Invalid task group", data: errors },
    };

  const taskGroup = await event.context.prisma.taskGroup.update({
    where: { id: value.id, userId: event.context.session.userId },
    data: { name: firstLetterToUpperCase(value.name) },
  });

  return {
    status: 200,
    body: {
      message: `Task group renamed successfully to ${taskGroup.name}`,
      data: taskGroup,
    },
  };
});
