<script lang="ts" setup>
defineProps({
  title: {
    type: String,
    default: "Home",
  },
  backUrl: {
    type: String,
    default: "",
  },
});
</script>

<template>
  <BasesHeader :title="title" :backUrl="backUrl" />
  <section
    class="h-[calc(100%_-_4rem)] w-screen box-border block overflow-y-auto overflow-x-hidden"
  >
    <slot />
  </section>
</template>
