<script setup lang="ts">
import type { Task, TaskGroup } from "@prisma/client";
import { ChevronDown, LoaderCircle } from "lucide-vue-next";
import { nextTick, ref, watch, type ComponentPublicInstance } from "vue";
import { toast } from "vue-sonner";

const taskGroupLoading = ref<boolean>(true);
const tasksLoading = ref<boolean>(true);
const selectedTaskGroup = ref<TaskGroup | null>(null);
const taskGroups = ref<TaskGroup[] | null>(null);
const tasks = ref<Task[] | null>(null);
const isTaskDoneOpen = ref<boolean>(true);
const convertDate = <
  T extends { createdAt: Date | string; updatedAt: Date | string }
>(
  data: T[]
) => {
  if (!data) return [];
  return data.map((item) => {
    return {
      ...item,
      createdAt: new Date(item.createdAt),
      updatedAt: new Date(item.updatedAt),
    };
  });
};

const getTasks = async (groupId: number) => {
  const responseTasks = await $fetch<{
    status: number;
    body: { data: { tasks: Task[] } };
  }>(`/api/app/tasks/${groupId}`, {
    method: "GET",
  });
  if (responseTasks.status !== 200) {
    toast.error("Failed to fetch tasks");
    return;
  }
  return convertDate(responseTasks.body.data!.tasks);
};

onMounted(async () => {
  taskGroupLoading.value = true;
  tasksLoading.value = true;
  const responseGroups = await $fetch("/api/app/taskGroup/all");
  if (responseGroups.status !== 200) {
    toast.error("Failed to fetch task groups");
    taskGroupLoading.value = false;
    return;
  }
  taskGroups.value = convertDate(responseGroups.body.groups);
  selectedTaskGroup.value =
    taskGroups.value.find((group) => group.name === "Default") || null;
  taskGroupLoading.value = false;

  tasks.value = ((await getTasks(selectedTaskGroup.value!.id)) as Task[]) || [];
  tasksLoading.value = false;
});

const handleGroupSelect = (taskGroup: TaskGroup) => {
  selectedTaskGroup.value = taskGroup;
};

const handleGroupCreate = (taskGroup: TaskGroup) => {
  taskGroups.value?.push(taskGroup);
};

const handleGroupDelete = (taskGroup: TaskGroup) => {
  taskGroups.value =
    taskGroups.value?.filter((group) => group.id !== taskGroup.id) || [];
  selectedTaskGroup.value =
    taskGroups.value[taskGroups.value.length - 1] || null;
};

const handleGroupRename = (taskGroup: TaskGroup) => {
  const index = taskGroups.value?.findIndex(
    (group) => group.id === taskGroup.id
  );
  if (index !== -1 && index !== undefined)
    taskGroups.value?.splice(index, 1, taskGroup);
};

const handleTaskCreate = (task: Task) => {
  tasks.value?.push(task);
};

const taskGroupRefs = ref<
  Record<string, Element | ComponentPublicInstance | null>
>({});

watch(selectedTaskGroup, async (newSelected) => {
  if (newSelected?.id) {
    await nextTick();
    const selectedCard = taskGroupRefs.value[newSelected.id];
    if (
      selectedCard &&
      selectedCard instanceof Element &&
      selectedCard.scrollIntoView
    )
      selectedCard.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "center",
      });

    tasksLoading.value = true;
    tasks.value = ((await getTasks(newSelected.id)) as Task[]) || [];
    tasksLoading.value = false;
  }
});
</script>

<template>
  <ScrollArea class="w-full py-2 px-3">
    <div
      v-if="taskGroupLoading"
      class="flex flex-row flex-nowrap justify-start items-center gap-4"
    >
      <Skeleton class="size-9" />
      <LoaderCircle class="size-9 animate-spin" />
      <p class="text-lg font-semibold">Loading task groups...</p>
    </div>
    <div
      v-else
      class="flex flex-row flex-nowrap justify-start items-center gap-4 h-9"
    >
      <div>
        <TaskGroupForm :onCreate="handleGroupCreate" />
      </div>
      <div
        v-for="taskGroup in taskGroups"
        :key="taskGroup.id"
        class="flex flex-col items-center gap-4"
        :ref="(el) => (taskGroupRefs[taskGroup.id] = el)"
      >
        <TaskGroupCard
          :taskGroup="taskGroup"
          @select="handleGroupSelect"
          :selected="taskGroup.id === selectedTaskGroup?.id"
        />
      </div>
    </div>
    <ScrollBar orientation="horizontal" class="hidden" />
  </ScrollArea>
  <div
    v-if="tasksLoading"
    class="h-[calc(100%_-_3.5rem)] w-full flex flex-col items-center justify-center p-4"
  >
    <div class="flex flex-col flex-nowrap items-center justify-center gap-2">
      <LoaderCircle class="size-9 animate-spin" />
      <p class="text-lg font-semibold">Loading tasks...</p>
    </div>
  </div>
  <div
    v-else
    class="w-full h-fit flex flex-col justify-start items-start flex-nowrap p-4 pt-2 mb-14"
  >
    <TaskCard
      v-for="task in tasks?.filter((task) => !task.done)"
      :key="task.id"
      :task="task"
    />
    <Separator v-if="tasks?.filter((task) => task.done).length || 0 > 0" />
    <Collapsible
      v-if="tasks?.filter((task) => task.done).length || 0 > 0"
      class="w-full"
      v-model:open="isTaskDoneOpen"
    >
      <CollapsibleTrigger asChild>
        <Button
          class="w-full h-fit flex flex-nowrap flex-row justify-between items-center"
          variant="ghost"
        >
          Completed ({{ tasks?.filter((task) => task.done).length }})
          <div>
            <ChevronDown
              class="size-6 duration-300"
              :class="{
                'rotate-180': isTaskDoneOpen,
              }"
            />
          </div>
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <TaskCard
          v-for="task in tasks?.filter((task) => task.done)"
          :key="task.id"
          :task="task"
        />
      </CollapsibleContent>
    </Collapsible>
  </div>
  <div
    class="w-full fixed bottom-0 left-0 h-14 block backdrop-blur-[2px] rounded-t-xl"
  >
    <TaskGroupMenu
      :selectedTaskGroup="selectedTaskGroup"
      :handleRename="handleGroupRename"
      :handleDelete="handleGroupDelete"
    />
    <TaskForm :groupId="selectedTaskGroup?.id" @create="handleTaskCreate" />
  </div>
</template>
