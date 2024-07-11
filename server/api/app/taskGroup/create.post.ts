import { taskGroupSchema } from "~/schema/TaskGroupSchema";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { errors, value } = await taskGroupSchema.parse(body);

  const firstLetterToUpperCase = (str: string) =>
    str.charAt(0).toUpperCase() + str.slice(1);

  if (errors.length > 0 || !value)
    return {
      status: 400,
      body: { message: "Invalid task group", data: errors },
    };

  const taskGroup = await event.context.prisma.taskGroup.create({
    data: {
      name: firstLetterToUpperCase(value.name),
      userId: event.context.session.userId,
    },
  });

  return {
    status: 200,
    body: {
      message: `Task group ${taskGroup.name} created successfully`,
      data: taskGroup,
    },
  };
});
