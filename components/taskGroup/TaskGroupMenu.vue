<script setup lang="ts">
import type { TaskGroup } from "@prisma/client";
import { Ellipsis } from "lucide-vue-next";

const props = defineProps<{
  selectedTaskGroup: TaskGroup | null;
  handleRename: (taskGroup: TaskGroup) => void;
  handleDelete: (taskGroup: TaskGroup) => void;
}>();
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger class="absolute left-4 bottom-5"
      ><Ellipsis
    /></DropdownMenuTrigger>
    <DropdownMenuContent>
      <DropdownMenuLabel class="font-cherry">Group actions</DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuItem
        class="p-0"
        v-if="selectedTaskGroup?.name !== 'Default'"
      >
        <TaskGroupRenameForm
          :selectedTaskGroup="selectedTaskGroup"
          :onRename="handleRename"
        />
      </DropdownMenuItem>
      <DropdownMenuItem
        class="p-0"
        v-if="selectedTaskGroup?.name !== 'Default'"
      >
        <TaskGroupDeleteForm
          :selectedTaskGroup="selectedTaskGroup"
          :onDelete="handleDelete"
        />
      </DropdownMenuItem>
      <DropdownMenuItem class="p-0">
        <TaskGroupDeleteAllCompletedTasks
          :selectedTaskGroup="selectedTaskGroup"
        />
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
