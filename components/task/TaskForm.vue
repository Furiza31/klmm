<script setup lang="ts">
import {
  DateFormatter,
  getLocalTimeZone,
  parseDate,
  today,
} from "@internationalized/date";
import {
  Calendar as CalendarIcon,
  Clock,
  LoaderCircle,
  Plus,
  Text,
  X,
} from "lucide-vue-next";
import { toDate } from "radix-vue/date";
import { useForm } from "vee-validate";
import { toast } from "vue-sonner";
import { taskSchema } from "~/schema/TaskSchema";
const isDetailsOpen = ref(false);
const isDatePopoverOpen = ref(false);
const isTimeOpen = ref(false);
const isDrawerOpen = ref(false);
const loading = ref(false);
const nameInput = ref<{ inputRef: HTMLInputElement }>();
const user = useAuth();

const emits = defineEmits(["create"]);
const props = defineProps<{
  groupId: number | undefined;
}>();
const { handleSubmit, setValues, setFieldValue, values } = useForm({
  validationSchema: taskSchema,
});

const onSubmit = handleSubmit(async (values) => {
  loading.value = true;
  const response = await $fetch("/api/app/tasks/create", {
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

const drawerOpenListener = async (state: boolean) => {
  isDrawerOpen.value = state;
  if (state) {
    setValues({ name: "", groupId: props.groupId });
    isDetailsOpen.value = false;
    isDatePopoverOpen.value = false;
    isTimeOpen.value = false;
    await nextTick();
    nameInput.value!.inputRef.focus();
  }
};

const dueDateValue = computed({
  get: () => (values.dueDate ? parseDate(values.dueDate) : undefined),
  set: (val) => val,
});

const clearDueDate = () => {
  setFieldValue("dueDate", undefined);
};

const df = new DateFormatter(
  (user.data.value as unknown as { language: string }).language,
  {
    dateStyle: "long",
  }
);
</script>

<template>
  <Drawer @update:open="drawerOpenListener" :open="isDrawerOpen">
    <DrawerTrigger
      class="rounded-lg size-10 bg-primary flex flex-row items-center justify-center absolute bottom-4 right-4"
    >
      <Plus class="size-6 text-primary-foreground" />
    </DrawerTrigger>
    <DrawerContent>
      <form @submit="onSubmit">
        <DrawerHeader>
          <DrawerTitle class="font-cherry">New Task</DrawerTitle>
          <DrawerDescription>What we need to do?</DrawerDescription>
          <FormField v-slot="{ componentField }" name="name">
            <FormItem>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Task name"
                  v-bind="componentField"
                  ref="nameInput"
                />
              </FormControl>
            </FormItem>
          </FormField>
          <FormField
            v-slot="{ componentField }"
            name="details"
            v-if="isDetailsOpen"
          >
            <FormItem>
              <FormControl>
                <Textarea
                  placeholder="Add details"
                  v-bind="componentField"
                  class="w-full resize-none max-h-52"
                />
              </FormControl>
            </FormItem>
          </FormField>
          <FormField
            v-slot="{ componentField }"
            name="dueTime"
            v-if="isTimeOpen"
          >
            <FormItem>
              <FormControl>
                <Input type="time" v-bind="componentField" class="w-full" />
              </FormControl>
            </FormItem>
          </FormField>
          <div v-if="dueDateValue">
            <Badge class="flex flex-row items-center gap-2 w-fit"
              >{{ df.format(toDate(dueDateValue)) }}
              <Button @click.stop="clearDueDate" class="p-0 h-fit"
                ><X class="size-5"
              /></Button>
            </Badge>
          </div>
          <FormField
            v-slot="{ componentField }"
            name="dueDate"
            v-if="dueDateValue"
          >
            <FormItem>
              <FormControl>
                <Input type="hidden" v-bind="componentField" />
              </FormControl>
            </FormItem>
          </FormField>
          <div class="flex flex-row items-center justify-start gap-2">
            <Toggle v-model:pressed="isDetailsOpen" class="p-3">
              <Text class="size-6" />
            </Toggle>
            <Popover v-model:open="isDatePopoverOpen">
              <PopoverTrigger as-child>
                <Button
                  variant="ghost"
                  class="p-3 hover:opacity-60"
                  :class="{ 'bg-accent text-accent-foreground': dueDateValue }"
                >
                  <CalendarIcon class="size-6" />
                </Button>
              </PopoverTrigger>
              <PopoverContent class="w-auto p-0">
                <Calendar
                  calendar-label="Date of birth"
                  v-model="dueDateValue"
                  :min-value="today(getLocalTimeZone())"
                  @update:model-value="
                    (v) => {
                      if (v) {
                        setFieldValue('dueDate', v.toString());
                      } else {
                        setFieldValue('dueDate', undefined);
                      }
                    }
                  "
                />
                <Button
                  @click="isDatePopoverOpen = false"
                  :disabled="!dueDateValue"
                  class="w-full"
                >
                  Ok
                </Button>
              </PopoverContent>
            </Popover>
            <Toggle v-model:pressed="isTimeOpen" class="p-3">
              <Clock class="size-6" />
            </Toggle>
          </div>
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
