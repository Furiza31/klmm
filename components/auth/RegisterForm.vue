<script setup lang="ts">
import { vAutoAnimate } from "@formkit/auto-animate/vue";
import { toTypedSchema } from "@vee-validate/zod";
import { LoaderCircle } from "lucide-vue-next";
import { useForm } from "vee-validate";
import { toast } from "vue-sonner";
import * as z from "zod";

const loading = ref(false);
const { signIn } = useAuth();

const formSchema = toTypedSchema(
  z
    .object({
      name: z.string().min(3),
      email: z.string().email(),
      password: z.string().min(6),
      confirmPassword: z.string().min(6),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Passwords do not match.",
      path: ["confirmPassword"],
    })
);

const { handleSubmit } = useForm({
  validationSchema: formSchema,
});

const onSubmit = handleSubmit(async (values) => {
  loading.value = true;
  const { body } = await $fetch("/api/auth/register", {
    method: "POST",
    body: JSON.stringify(values),
  });

  if ((body as { error: string }).error) {
    toast.error((body as { error: string }).error);
    return;
  }

  toast.success("Account created successfully.");
  signIn("credentials", {
    email: values.email,
    password: values.password,
    redirect: false,
  }).then((res) => {
    loading.value = false;
    if (res?.error) {
      toast.error("Invalid credentials");
    } else {
      navigateTo({ path: "/app" });
    }
  });
});
</script>

<template>
  <form class="w-full space-y-2" @submit="onSubmit">
    <FormField v-slot="{ componentField }" name="name">
      <FormItem v-auto-animate>
        <FormLabel>Username</FormLabel>
        <FormControl>
          <Input type="text" v-bind="componentField" />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>
    <FormField v-slot="{ componentField }" name="email">
      <FormItem v-auto-animate>
        <FormLabel>Email</FormLabel>
        <FormControl>
          <Input type="text" v-bind="componentField" />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>
    <FormField v-slot="{ componentField }" name="password">
      <FormItem v-auto-animate>
        <FormLabel>Password</FormLabel>
        <FormControl>
          <Input type="password" v-bind="componentField" />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>
    <FormField v-slot="{ componentField }" name="confirmPassword">
      <FormItem v-auto-animate>
        <FormLabel>Confirm Password</FormLabel>
        <FormControl>
          <Input type="password" v-bind="componentField" />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>
    <div class="w-full flex flex-row items-center justify-center">
      <Button type="submit" class="w-1/2 mt-3" :disabled="loading">
        <LoaderCircle v-if="loading" class="size-6 animate-spin" />
        <span v-if="!loading"> Let's Go! </span>
      </Button>
    </div>
  </form>
</template>
