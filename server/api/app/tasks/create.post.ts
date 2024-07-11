import { taskSchema } from "~/schema/TaskSchema";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { errors, value } = await taskSchema.parse(body);

  const firstLetterToUpperCase = (str: string) =>
    str.charAt(0).toUpperCase() + str.slice(1);

  if (errors.length > 0 || !value)
    return {
      status: 400,
      body: { message: "Invalid task", data: errors },
    };

  const task = await event.context.prisma.task.create({
    data: {
      name: firstLetterToUpperCase(value.name),
      details: value.details,
      dueDate: value.dueDate,
      dueTime: value.dueTime,
      groupId: value.groupId,
    },
  });

  return {
    status: 200,
    body: { message: `Task ${task.name} created successfully`, data: task },
  };
});
