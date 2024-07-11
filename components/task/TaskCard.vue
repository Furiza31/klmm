<script setup lang="ts">
import { DateFormatter } from "@internationalized/date";
import type { Task } from "@prisma/client";
import { toast } from "vue-sonner";

const props = defineProps<{
  task: Task;
}>();
const user = useAuth();

const df = new DateFormatter(
  (user.data.value as unknown as { language: string }).language,
  {
    dateStyle: "long",
  }
);

const handleCheckUpdate = async (checked: boolean) => {
  const response = await $fetch<{
    status: number;
    body: { data: Task };
  }>(`/api/app/tasks/update`, {
    method: "PUT",
    body: {
      ...props.task,
      done: checked,
    },
  });
  if (response.status !== 200) {
    console.log(response.body.data);
    toast.error(`Failed to update task ${props.task.name}`);
    props.task.done = !checked;
    return;
  }
};
</script>

<template>
  <div
    class="flex flex-row flex-nowrap justify-start items-start gap-2 w-full py-2"
  >
    <Checkbox
      class="size-6"
      v-model:checked="task.done"
      @update:checked="handleCheckUpdate"
    />
    <div
      class="flex flex-nowrap w-full justify-start flex-col items-start text-md"
      :class="{
        'line-through': task.done,
        'opacity-50': task.done,
      }"
    >
      <h1>{{ task.name }}</h1>
      <p class="text-muted-foreground text-sm">{{ task.details }}</p>
      <Badge v-if="task.dueDate || task.dueTime" class="mt-1">
        <span v-if="task.dueDate">{{ df.format(new Date(task.dueDate)) }}</span>
        <span v-if="task.dueDate && task.dueTime">, </span>
        <span v-if="task.dueTime">{{ task.dueTime }}</span>
      </Badge>
    </div>
  </div>
</template>
