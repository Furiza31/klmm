<script setup lang="ts">
import type { TaskGroup } from "@prisma/client";
import { LoaderCircle, Trash2 } from "lucide-vue-next";
import { useForm } from "vee-validate";
import { toast } from "vue-sonner";
import { taskGroupDeleteSchema } from "~/schema/TaskGroupSchema";

const emits = defineEmits(["delete"]);
const isAlertDialogOpen = ref(false);
const loading = ref(false);
const props = defineProps<{
  selectedTaskGroup: TaskGroup | null;
}>();

const { handleSubmit, setValues } = useForm({
  validationSchema: taskGroupDeleteSchema,
});

const handleDialogTrigger = () => {
  setValues({ id: props.selectedTaskGroup?.id });
};

const dialogOpenListener = (value: boolean) => {
  isAlertDialogOpen.value = value;
};

const onSubmit = handleSubmit(async (values) => {
  loading.value = true;
  const response = await $fetch("/api/app/taskGroup/delete", {
    method: "DELETE",
    body: values,
  });
  if (response.status !== 200) {
    toast.error(response.body.message);
    loading.value = false;
    return;
  }
  toast.success(response.body.message);
  emits("delete", response.body.data);
  isAlertDialogOpen.value = false;
  loading.value = false;
});
</script>

<template>
  <AlertDialog :open="isAlertDialogOpen" @update:open="dialogOpenListener">
    <AlertDialogTrigger class="w-full" @click.stop="handleDialogTrigger">
      <Button
        variant="ghost"
        class="flex flex-row flex-nowrap justify-start items-center gap-2 p-2 h-fit w-full"
      >
        <Trash2 class="size-5" /> <span> Delete </span>
      </Button>
    </AlertDialogTrigger>
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle class="font-cherry"
          >Delete task group "{{ selectedTaskGroup?.name }}"</AlertDialogTitle
        >
        <AlertDialogDescription>
          This action cannot be undone. This will permanently delete the task
          group and all tasks in it.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Cancel</AlertDialogCancel>
        <form @submit="onSubmit">
          <FormField v-slot="{ componentField }" name="id">
            <FormItem>
              <FormControl>
                <Input
                  type="hidden"
                  v-bind="componentField"
                  :defaultValue="selectedTaskGroup?.id"
                />
              </FormControl>
            </FormItem>
          </FormField>
          <Button type="submit" class="w-full">
            <LoaderCircle v-if="loading" class="size-6 animate-spin" />
            <span v-if="!loading"> Continue </span>
          </Button>
        </form>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
</template>
