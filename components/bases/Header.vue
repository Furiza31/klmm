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
    class="flex flew-row flex-nowrap w-screen px-2 py-3 box-border justify-between items-center z-50 h-16 sticky top-0 left-0 rounded-b-xl border"
  >
    <div>
      <div class="mx-0">
        <NuxtLink :to="backUrl" v-if="backUrl">
          <Button variant="ghost" size="icon">
            <ArrowLeft class="size-7" />
          </Button>
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
