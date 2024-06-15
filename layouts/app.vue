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
  <section>
    <slot />
  </section>
</template>
