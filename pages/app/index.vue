<script setup lang="ts">
const { signOut, data } = useAuth();

const handleSignOut = async () => {
  await signOut({ callbackUrl: "/auth" });
};
</script>

<template>
  <Button @click="handleSignOut">Sign Out</Button>
  <pre>{{ data }}</pre>
</template>
