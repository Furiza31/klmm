<script setup lang="ts">
import { adventurer } from "@dicebear/collection";
import { createAvatar } from "@dicebear/core";
import {
  Home,
  LoaderCircle,
  LogOut,
  Menu,
  SquareCheckBig,
} from "lucide-vue-next";
const { signOut } = useAuth();
const signOutLoading = ref(false);
const { data } = useAuth();
const avatar =
  data.value?.user?.image ||
  (await createAvatar(adventurer, {
    seed: data.value!.user!.email as string,
  }).toDataUri());

const handleSignOut = async () => {
  signOutLoading.value = true;
  await signOut({ callbackUrl: "/auth" });
  signOutLoading.value = false;
};
</script>

<template>
  <Sheet>
    <SheetTrigger as-child>
      <Button variant="ghost" class="mx-2" size="icon">
        <Menu class="size-7" />
      </Button>
    </SheetTrigger>
    <SheetContent
      class="px-4 py-4 box-border flex flex-col justify-between items-start"
    >
      <div class="w-full">
        <SheetHeader>
          <SheetTitle class="flex flex-row items-center justify-start gap-2">
            <NuxtLink to="/app/account">
              <Button
                variant="ghost"
                class="rounded-full flex flex-col items-center justify-center w-fit h-fit p-0"
              >
                <NuxtImg :src="avatar" class="rounded-full size-10" />
              </Button>
            </NuxtLink>
            <span class="font-cherry">Menu</span>
          </SheetTitle>
          <SheetDescription> Where are we going ? </SheetDescription>
        </SheetHeader>

        <div class="mt-2 w-full">
          <NuxtLink to="/app" active-class="group active">
            <Button
              class="flex flex-row items-center justify-start w-full px-2 py-1 h-9 bg-secondary-foreground group-[.active]:bg-primary"
            >
              <Home class="size-5" />
              <span class="w-5/6 text-center font-cherry"> Home </span>
            </Button>
          </NuxtLink>
        </div>
        <div class="mt-2 w-full">
          <NuxtLink to="/app/tasks" active-class="group active">
            <Button
              class="flex flex-row items-center justify-start w-full px-2 py-1 h-9 bg-secondary-foreground group-[.active]:bg-primary"
            >
              <SquareCheckBig class="size-5" />
              <span class="w-5/6 text-center font-cherry"> Tasks </span>
            </Button>
          </NuxtLink>
        </div>
      </div>
      <SheetFooter class="w-full">
        <Button
          @click="handleSignOut"
          class="flex flex-row items-center justify-start w-full px-2 py-1 h-9"
          variant="destructive"
          :disabled="signOutLoading"
        >
          <LogOut v-if="!signOutLoading" />
          <LoaderCircle v-else class="animate-spin" />
          <span class="w-5/6 text-center font-cherry"> Logout </span>
        </Button>
      </SheetFooter>
    </SheetContent>
  </Sheet>
</template>
