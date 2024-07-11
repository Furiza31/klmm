<script setup lang="ts">
import { Github, LoaderCircle } from "lucide-vue-next";

const { signIn } = useAuth();
const loading = ref(false);

const handleSignInWithGitHub = async () => {
  loading.value = true;
  await signIn("github", { callbackUrl: "/app" });
};
</script>

<template>
  <div class="w-full flex justify-center items-center gap-2">
    <Button
      @click="handleSignInWithGitHub"
      variant="ghost"
      class="rounded-full"
      :disabled="loading"
    >
      <Github v-if="!loading" />
      <LoaderCircle class="animate-spin" v-else />
    </Button>
  </div>
</template>
