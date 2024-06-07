<script setup lang="ts">
definePageMeta({
  title: "Home",
  auth: {
    unauthenticatedOnly: true,
    navigateAuthenticatedTo: "/app",
  },
});
</script>

<template>
  <NuxtLink to="/auth"> Go to Auth </NuxtLink>
</template>
