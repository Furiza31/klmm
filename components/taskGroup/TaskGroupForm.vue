<script setup lang="ts">
import { LoaderCircle, Plus } from "lucide-vue-next";
import { useForm } from "vee-validate";
import { toast } from "vue-sonner";
import { taskGroupSchema } from "~/schema/TaskGroupSchema";

const loading = ref(false);
const isDrawerOpen = ref(false);
const emits = defineEmits(["create"]);
const { handleSubmit, setValues } = useForm({
  validationSchema: taskGroupSchema,
});

const onSubmit = handleSubmit(async (values) => {
  loading.value = true;
  const response = await $fetch("/api/app/taskGroup/create", {
    method: "POST",
    body: values,
  });
  if (response.status !== 200) {
    loading.value = false;
    toast.error(response.body.message);
    return;
  }
  emits("create", response.body.data);
  toast.success(response.body.message);
  isDrawerOpen.value = false;
  loading.value = false;
});

const drawerOpenListener = (state: boolean) => {
  if (state) setValues({ name: "" });
  isDrawerOpen.value = state;
};
</script>

<template>
  <Drawer @update:open="drawerOpenListener" :open="isDrawerOpen">
    <DrawerTrigger>
      <Button size="icon" class="size-9">
        <Plus class="size-6 text-primary-foreground" />
      </Button>
    </DrawerTrigger>
    <DrawerContent>
      <form @submit="onSubmit">
        <DrawerHeader>
          <DrawerTitle class="font-cherry"> Create Task Group </DrawerTitle>
          <DrawerDescription> What the task group is about? </DrawerDescription>
          <FormField v-slot="{ componentField }" name="name">
            <FormItem>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Task Group Name"
                  v-bind="componentField"
                  autofocus
                />
              </FormControl>
            </FormItem>
          </FormField>
        </DrawerHeader>
        <DrawerFooter>
          <Button type="submit" :disabled="loading">
            <LoaderCircle v-if="loading" class="size-6 animate-spin" />
            <span v-if="!loading"> Submit </span>
          </Button>
        </DrawerFooter>
      </form>
    </DrawerContent>
  </Drawer>
</template>
