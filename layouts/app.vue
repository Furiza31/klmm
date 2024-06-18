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
  <section class="min-h-[calc(100vh-4rem)] w-screen box-border">
    <slot />
  </section>
</template>
