<script setup lang="ts">
import { vAutoAnimate } from "@formkit/auto-animate/vue";
definePageMeta({
  title: "Authentication",
  auth: {
    unauthenticatedOnly: true,
    navigateAuthenticatedTo: "/app",
  },
});
const route = useRoute();
const tabs = {
  login: "login",
  register: "register",
};
if (
  !route.query.tab ||
  !Object.values(tabs).includes(route.query.tab as string)
) {
  navigateTo({ path: "/auth", query: { tab: "login" } });
}

const onTabChange = (tab: unknown) => {
  navigateTo({ path: "/auth", query: { tab: tab as string } });
};
</script>

<template>
  <section
    class="h-screen w-screen flex flex-col items-center justify-center p-4"
  >
    <Tabs
      :default-value="route.query.tab as string"
      class="w-full max-w-md"
      @update:model-value="onTabChange"
    >
      <TabsList class="grid w-full grid-cols-2">
        <TabsTrigger :value="tabs.login"> Login </TabsTrigger>
        <TabsTrigger :value="tabs.register"> Register </TabsTrigger>
      </TabsList>
      <TabsContent :value="tabs.login" v-auto-animate>
        <Card>
          <CardHeader class="pb-2">
            <CardTitle>Login</CardTitle>
            <CardDescription>
              I don't know about you, but I'm a fan of the classics.
            </CardDescription>
          </CardHeader>
          <CardContent class="space-y-2">
            <AuthLoginForm />
          </CardContent>
          <CardFooter>
            <div class="w-full flex flex-col items-center justify-center gap-2">
              <p>Or Sign Up Using</p>
              <div class="flex flex-row items-center justify-center gap-2">
                <AuthGithubLogin />
                <AuthGoogleLogin />
              </div>
            </div>
          </CardFooter>
        </Card>
      </TabsContent>
      <TabsContent :value="tabs.register" v-auto-animate>
        <Card>
          <CardHeader class="pb-2">
            <CardTitle>Register</CardTitle>
            <CardDescription>
              I want to know more about you. Let's get started.
            </CardDescription>
          </CardHeader>
          <CardContent class="space-y-2">
            <AuthRegisterForm />
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  </section>
</template>
