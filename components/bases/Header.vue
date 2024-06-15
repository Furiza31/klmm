<script setup lang="ts">
import { ArrowLeft } from "lucide-vue-next";

let pageTitle = "Home";
let back = true;
let backUrl = "/app";
</script>

<template>
  <header
    class="flex flew-row flex-nowrap w-screen px-4 py-3 box-border justify-between items-center relative z-50"
  >
    <div>
      <NuxtLink v-if="back" :to="backUrl">
        <ArrowLeft class="size-7" />
      </NuxtLink>
    </div>
    <div>
      <h1>{{ pageTitle }}</h1>
    </div>
    <div>
      <BasesNavigation />
    </div>
  </header>
</template>
