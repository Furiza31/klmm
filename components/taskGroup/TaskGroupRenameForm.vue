<script setup lang="ts">
import type { TaskGroup } from "@prisma/client";
import { LoaderCircle, Pen } from "lucide-vue-next";
import { useForm } from "vee-validate";
import { toast } from "vue-sonner";
import { taskGroupRenameSchema } from "~/schema/TaskGroupSchema";

const emits = defineEmits(["rename"]);
const isAlertDialogOpen = ref(false);
const loading = ref(false);
const props = defineProps<{
  selectedTaskGroup: TaskGroup | null;
}>();

const { handleSubmit, setValues } = useForm({
  validationSchema: taskGroupRenameSchema,
});

const dialogOpenListener = (value: boolean) => {
  if (value)
    setValues({
      name: props.selectedTaskGroup?.name,
      id: props.selectedTaskGroup?.id,
    });
  isAlertDialogOpen.value = value;
};

const onSubmit = handleSubmit(async (values) => {
  loading.value = true;
  const response = await $fetch("/api/app/taskGroup/rename", {
    method: "PUT",
    body: values,
  });
  if (response.status !== 200) {
    toast.error(response.body.message);
    loading.value = false;
    return;
  }
  toast.success(response.body.message);
  emits("rename", response.body.data);
  isAlertDialogOpen.value = false;
  loading.value = false;
});
</script>

<template>
  <Dialog :open="isAlertDialogOpen" @update:open="dialogOpenListener">
    <DialogTrigger class="w-full" @click.stop>
      <Button
        variant="ghost"
        class="flex flex-row flex-nowrap justify-start items-center gap-2 p-2 h-fit w-full"
      >
        <Pen class="size-5" /> <span> Rename </span>
      </Button>
    </DialogTrigger>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>
          Rename task group "{{ selectedTaskGroup?.name }}"
        </DialogTitle>
        <DialogDescription>
          What's wrong with the current name?
        </DialogDescription>
      </DialogHeader>
      <form @submit="onSubmit">
        <FormField v-slot="{ componentField }" name="name">
          <FormItem>
            <FormControl>
              <Input
                type="text"
                placeholder="New name"
                v-bind="componentField"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>
        <FormField v-slot="{ componentField }" name="id">
          <FormItem>
            <FormControl>
              <Input
                type="hidden"
                v-bind="componentField"
                :value="selectedTaskGroup?.id"
              />
            </FormControl>
          </FormItem>
        </FormField>
        <DialogFooter class="mt-4">
          <Button type="submit">
            <LoaderCircle v-if="loading" class="size-6 animate-spin" />
            <span v-if="!loading"> Save change </span>
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>
