<script setup lang="ts">
import { LogOut, Menu, SquareCheckBig } from "lucide-vue-next";
const { signOut } = useAuth();

const handleSignOut = async () => {
  await signOut({ callbackUrl: "/auth" });
};
</script>

<template>
  <Sheet>
    <SheetTrigger as-child>
      <Button variant="ghost" class="rounded-full">
        <Menu class="size-8" />
      </Button>
    </SheetTrigger>
    <SheetContent
      class="px-4 py-4 box-border flex flex-col justify-between items-start"
    >
      <div class="w-full">
        <SheetHeader>
          <SheetTitle>Menu</SheetTitle>
          <SheetDescription> Where are we going ? </SheetDescription>
        </SheetHeader>

        <div class="mt-3 w-full">
          <NuxtLink to="/app/tasks">
            <Button class="flex flex-row items-center justify-start w-full">
              <SquareCheckBig /> <span class="w-5/6 text-center"> Tasks </span>
            </Button>
          </NuxtLink>
        </div>
      </div>
      <SheetFooter class="w-full">
        <Button
          @click="handleSignOut"
          class="flex flex-row items-center justify-start w-full"
          variant="destructive"
        >
          <LogOut /> <span class="w-5/6 text-center"> Logout </span>
        </Button>
      </SheetFooter>
    </SheetContent>
  </Sheet>
</template>
