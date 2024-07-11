<script setup lang="ts">
import type { TaskGroup } from "@prisma/client";
import { BadgeX } from "lucide-vue-next";

const props = defineProps<{
  selectedTaskGroup: TaskGroup | null;
}>();
</script>

<template>
  <AlertDialog>
    <AlertDialogTrigger @click.stop class="w-full">
      <Button
        variant="ghost"
        class="flex flex-row flex-nowrap justify-start items-center gap-2 p-2 h-fit w-full"
      >
        <BadgeX class="size-5" /> <span> Delete completed tasks </span>
      </Button>
    </AlertDialogTrigger>
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle class="font-cherry">
          Delete completed tasks in task group "{{
            selectedTaskGroup?.name
          }}"</AlertDialogTitle
        >
        <AlertDialogDescription>
          This action cannot be undone. This will permanently delete all
          completed tasks.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Cancel</AlertDialogCancel>
        <AlertDialogAction>Continue</AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
</template>
