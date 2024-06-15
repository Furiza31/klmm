<script setup lang="ts">
import { LoaderCircle } from "lucide-vue-next";

const { signIn } = useAuth();
const loading = ref(false);

const handleSignInWithGoogle = async () => {
  loading.value = true;
  await signIn("google", { callbackUrl: "/app" });
};
</script>

<template>
  <div class="w-full flex justify-center items-center gap-2">
    <Button
      @click="handleSignInWithGoogle"
      variant="ghost"
      class="rounded-full"
    >
      <NuxtImg
        src="/images/icons/google.svg"
        width="24"
        height="24"
        alt="Google logo"
        v-if="!loading"
      />
      <LoaderCircle class="animate-spin" v-else />
    </Button>
  </div>
</template>
