import { taskSchema } from "~/schema/TaskSchema";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { errors, value } = await taskSchema.parse(body);

  if (errors.length > 0 || !value)
    return {
      status: 400,
      body: { message: "Invalid task", data: errors },
    };

  const task = await event.context.prisma.task.update({
    where: {
      id: Number(value.id),
      groupId: value.groupId,
      group: {
        userId: event.context.session.userId,
      },
    },
    data: {
      name: value.name,
      details: value.details,
      dueDate: value.dueDate,
      dueTime: value.dueTime,
      done: Boolean(value.done),
      groupId: value.groupId,
      updatedAt: new Date(),
    },
  });

  return {
    status: 200,
    body: { message: `Task ${task.name} updated successfully`, data: task },
  };
});
