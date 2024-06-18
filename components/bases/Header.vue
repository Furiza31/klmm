<script setup lang="ts">
import { ArrowLeft } from "lucide-vue-next";
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
  <header
    class="flex flew-row flex-nowrap w-screen px-2 py-3 box-border justify-between items-center relative z-50 h-16"
  >
    <div>
      <div class="px-4 py-2">
        <NuxtLink :to="backUrl" v-if="backUrl">
          <ArrowLeft class="size-7" />
        </NuxtLink>
        <div v-else class="size-7"></div>
      </div>
    </div>
    <div>
      <h1 class="text-primary font-bold text-lg font-cherry">{{ title }}</h1>
    </div>
    <div>
      <BasesNavigation />
    </div>
  </header>
</template>
