<script setup lang="ts">
import type { TaskGroup } from "@prisma/client";

const emits = defineEmits(["select"]);
const props = defineProps<{
  taskGroup: TaskGroup;
  selected: boolean;
}>();

const handleSelect = () => {
  emits("select", props.taskGroup);
};
</script>

<template>
  <Button
    :variant="selected ? 'secondary' : 'outline'"
    @click="handleSelect"
    class="h-9"
  >
    {{ props.taskGroup.name }}
  </Button>
</template>
